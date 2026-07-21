export interface IDisplayCapabilities {
  screenWidth: number;
  screenHeight: number;
  devicePixelRatio: number;
  colorDepth: number;
  estimatedRefreshRate: number;
  isTouchDevice: boolean;
  maxTouchPoints: number;
}

export interface IVsyncStats {
  currentFps: number;
  frameDeltaMs: number;
  syncLossCount: number;
  lastTimestamp: number;
}
