/**
 * TV & Projector Screen Size, Viewing Distance & Room Layout Engine
 * 
 * Implements SMPTE (30°/40° FOV) & THX (36° FOV) visual viewing angle standards,
 * VESA 1-arcminute angular acuity resolution thresholds (4K vs 1080p vs 8K),
 * screen aspect ratio geometry, and projector throw distance calculations.
 */

export type DisplayType = 'TV' | 'Projector';
export type AspectRatio = '16:9' | '21:9' | '4:3';
export type ScreenResolution = '1080p' | '4K' | '8K';

export interface TvDimensions {
  diagonalInches: number;
  widthInches: number;
  heightInches: number;
  widthCm: number;
  heightCm: number;
  areaSqInches: number;
}

export interface ViewingDistanceResult {
  diagonalInches: number;
  resolution: ScreenResolution;
  aspectRatio: AspectRatio;
  dimensions: TvDimensions;
  
  // Recommended viewing distance ranges (in feet and meters)
  minDistanceFeet: number;
  idealThxDistanceFeet: number;
  maxDistanceFeet: number;
  minDistanceMeters: number;
  idealThxDistanceMeters: number;
  maxDistanceMeters: number;

  // Field of View (FOV) angles at ideal distance
  fieldOfViewDegrees: number;
  fovRating: 'Cinema Immersive (40°)' | 'THX Standard (36°)' | 'SMPTE General (30°)';

  // Resolution visual acuity threshold
  fourKBenefitDistanceFeet: number;
  isFourKNoticeableAtDistance: boolean;
  
  // Projector throw calculation (optional)
  projectorThrowMinFeet?: number;
  projectorThrowMaxFeet?: number;

  explanation: string;
}

export class TvViewingDistanceEngine {
  /**
   * Calculates physical screen width and height from diagonal and aspect ratio.
   */
  public static calculateDimensions(diagonalInches: number, aspectRatio: AspectRatio = '16:9'): TvDimensions {
    let ratioW = 16;
    let ratioH = 9;

    if (aspectRatio === '21:9') {
      ratioW = 21;
      ratioH = 9;
    } else if (aspectRatio === '4:3') {
      ratioW = 4;
      ratioH = 3;
    }

    const angleRad = Math.atan(ratioH / ratioW);
    const widthInches = diagonalInches * Math.cos(angleRad);
    const heightInches = diagonalInches * Math.sin(angleRad);

    return {
      diagonalInches,
      widthInches: Math.round(widthInches * 10) / 10,
      heightInches: Math.round(heightInches * 10) / 10,
      widthCm: Math.round(widthInches * 2.54 * 10) / 10,
      heightCm: Math.round(heightInches * 2.54 * 10) / 10,
      areaSqInches: Math.round(widthInches * heightInches)
    };
  }

  /**
   * Computes optimal viewing distance, FOV rating, and 4K acuity benefits.
   */
  public static calculateViewingDistance(
    diagonalInches: number,
    resolution: ScreenResolution = '4K',
    aspectRatio: AspectRatio = '16:9',
    userRoomDistanceFeet?: number,
    projectorThrowRatio?: number // e.g. 1.2 for standard throw
  ): ViewingDistanceResult {
    const dimensions = this.calculateDimensions(diagonalInches, aspectRatio);

    // THX recommended distance formula: Distance (inches) = Screen Diagonal / 0.833 (36° FOV)
    const idealThxDistanceInches = diagonalInches / 0.833;
    const idealThxDistanceFeet = idealThxDistanceInches / 12;

    // Cinema Immersive (40° FOV): Distance = Diagonal / 0.925
    const minDistanceFeet = (diagonalInches / 0.925) / 12;

    // SMPTE Standard (30° FOV): Distance = Diagonal / 0.625
    const maxDistanceFeet = (diagonalInches / 0.625) / 12;

    // 4K Acuity Distance limit (1 arcminute human eye resolution):
    // 4K pixel structure becomes indistinguishable beyond ~1.5x screen height
    const fourKBenefitDistanceFeet = (dimensions.heightInches * 1.5) / 12;

    const actualDistFeet = userRoomDistanceFeet || idealThxDistanceFeet;
    const isFourKNoticeable = actualDistFeet <= fourKBenefitDistanceFeet;

    // FOV calculation at actual/ideal distance
    const distInches = actualDistFeet * 12;
    const fovRad = 2 * Math.atan((dimensions.widthInches / 2) / distInches);
    const fovDeg = Math.round((fovRad * (180 / Math.PI)) * 10) / 10;

    let fovRating: 'Cinema Immersive (40°)' | 'THX Standard (36°)' | 'SMPTE General (30°)' = 'THX Standard (36°)';
    if (fovDeg >= 38) fovRating = 'Cinema Immersive (40°)';
    else if (fovDeg <= 32) fovRating = 'SMPTE General (30°)';

    let explanation = `For a ${diagonalInches}" ${resolution} TV, the THX recommended viewing distance is ${idealThxDistanceFeet.toFixed(1)} feet (${(idealThxDistanceFeet * 0.3048).toFixed(1)} meters).`;
    if (userRoomDistanceFeet) {
      if (userRoomDistanceFeet < minDistanceFeet) {
        explanation = `At ${userRoomDistanceFeet} ft, you are closer than the cinema minimum (${minDistanceFeet.toFixed(1)} ft). Individual pixels may be visible unless using 4K/8K.`;
      } else if (userRoomDistanceFeet > maxDistanceFeet) {
        explanation = `At ${userRoomDistanceFeet} ft, you are beyond the SMPTE recommended limit (${maxDistanceFeet.toFixed(1)} ft). Consider upgrading to a larger screen.`;
      } else {
        explanation = `Your seating distance of ${userRoomDistanceFeet} ft is within the ideal THX/SMPTE window (${minDistanceFeet.toFixed(1)} - ${maxDistanceFeet.toFixed(1)} ft).`;
      }
    }

    let projThrowMin: number | undefined;
    let projThrowMax: number | undefined;

    if (projectorThrowRatio) {
      // Throw distance = Screen Width (ft) * Throw Ratio
      const widthFeet = dimensions.widthInches / 12;
      projThrowMin = Math.round(widthFeet * projectorThrowRatio * 10) / 10;
      projThrowMax = Math.round(widthFeet * (projectorThrowRatio * 1.2) * 10) / 10;
    }

    return {
      diagonalInches,
      resolution,
      aspectRatio,
      dimensions,
      minDistanceFeet: Math.round(minDistanceFeet * 10) / 10,
      idealThxDistanceFeet: Math.round(idealThxDistanceFeet * 10) / 10,
      maxDistanceFeet: Math.round(maxDistanceFeet * 10) / 10,
      minDistanceMeters: Math.round(minDistanceFeet * 0.3048 * 10) / 10,
      idealThxDistanceMeters: Math.round(idealThxDistanceFeet * 0.3048 * 10) / 10,
      maxDistanceMeters: Math.round(maxDistanceFeet * 0.3048 * 10) / 10,
      fieldOfViewDegrees: fovDeg,
      fovRating,
      fourKBenefitDistanceFeet: Math.round(fourKBenefitDistanceFeet * 10) / 10,
      isFourKNoticeableAtDistance: isFourKNoticeable,
      projectorThrowMinFeet: projThrowMin,
      projectorThrowMaxFeet: projThrowMax,
      explanation
    };
  }
}
