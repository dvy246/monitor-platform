/**
 * 3D Printer Filament Cost & Material Estimator Engine
 * 
 * Computes 3D print costs based on material density (PLA, ABS, PETG, TPU, Nylon, PC),
 * spool weight/price ratios, electricity consumption, failure cushion factors,
 * and "Etsy Retail Pricing" business margins.
 */

export interface MaterialSpec {
  id: string;
  name: string;
  densityGcm3: number;
  typicalSpoolPriceUsd: number; // 1000g spool
  bedTempC: number;
  printTempC: number;
  flexibilityRating: 'Rigid' | 'Semi-Flexible' | 'Flexible';
  strengthRating: 'Moderate' | 'High' | 'Very High';
}

export interface PrintCostResult {
  material: MaterialSpec;
  printWeightGrams: number;
  printTimeHours: number;
  spoolPriceUsd: number;
  spoolWeightGrams: number;
  filamentCostUsd: number;
  electricityCostUsd: number;
  wearAndTearCostUsd: number;
  totalDirectCostUsd: number;
  
  // Etsy / Retail pricing mode
  laborCostUsd: number;
  failureBufferUsd: number;
  suggestedRetailPriceUsd: number;
  profitMarginUsd: number;

  formattedDirectCost: string;
  formattedRetailPrice: string;
  explanation: string;
}

export class FilamentCostEngine {
  public static readonly MATERIALS: MaterialSpec[] = [
    { id: 'pla', name: 'PLA (Polylactic Acid)', densityGcm3: 1.24, typicalSpoolPriceUsd: 22.00, bedTempC: 60, printTempC: 210, flexibilityRating: 'Rigid', strengthRating: 'Moderate' },
    { id: 'abs', name: 'ABS (Acrylonitrile Butadiene Styrene)', densityGcm3: 1.04, typicalSpoolPriceUsd: 24.00, bedTempC: 100, printTempC: 240, flexibilityRating: 'Rigid', strengthRating: 'High' },
    { id: 'petg', name: 'PETG (Polyethylene Terephthalate Glycol)', densityGcm3: 1.27, typicalSpoolPriceUsd: 25.00, bedTempC: 80, printTempC: 235, flexibilityRating: 'Semi-Flexible', strengthRating: 'High' },
    { id: 'tpu', name: 'TPU (Thermoplastic Polyurethane 95A)', densityGcm3: 1.21, typicalSpoolPriceUsd: 32.00, bedTempC: 50, printTempC: 225, flexibilityRating: 'Flexible', strengthRating: 'High' },
    { id: 'nylon', name: 'Nylon / PA', densityGcm3: 1.14, typicalSpoolPriceUsd: 45.00, bedTempC: 90, printTempC: 260, flexibilityRating: 'Semi-Flexible', strengthRating: 'Very High' },
    { id: 'pc', name: 'PC (Polycarbonate)', densityGcm3: 1.20, typicalSpoolPriceUsd: 50.00, bedTempC: 110, printTempC: 280, flexibilityRating: 'Rigid', strengthRating: 'Very High' }
  ];

  public static getMaterialById(id: string): MaterialSpec {
    return this.MATERIALS.find(m => m.id.toLowerCase() === id.toLowerCase()) || this.MATERIALS[0];
  }

  /**
   * Calculates detailed 3D print costs and optional retail pricing.
   */
  public static calculateCost(
    materialId: string,
    printWeightGrams: number,
    printTimeHours: number,
    customSpoolPriceUsd?: number,
    customElectricityRateKwhCents: number = 16.8, // national avg
    printerWatts: number = 150,
    hourlyLaborRateUsd: number = 15.00,
    profitMarginPercent: number = 40
  ): PrintCostResult {
    const material = this.getMaterialById(materialId);
    const spoolPrice = customSpoolPriceUsd && customSpoolPriceUsd > 0 ? customSpoolPriceUsd : material.typicalSpoolPriceUsd;
    const spoolWeight = 1000; // 1kg standard

    // Filament cost = (weight / 1000) * spool price
    const filamentCost = (printWeightGrams / spoolWeight) * spoolPrice;

    // Electricity cost = (watts * hours / 1000) * ($ / kWh)
    const kwh = (printerWatts * printTimeHours) / 1000;
    const electricityCost = kwh * (customElectricityRateKwhCents / 100);

    // Wear and tear / nozzle depreciation (~$0.10 per printing hour)
    const wearAndTearCost = printTimeHours * 0.10;

    const totalDirectCost = filamentCost + electricityCost + wearAndTearCost;

    // Failure rate buffer (10% standard buffer)
    const failureBuffer = totalDirectCost * 0.10;

    // Labor cost (assuming 10 min setup/post-processing = 0.166 hr per print)
    const laborCost = (0.166 * hourlyLaborRateUsd);

    const baseCostWithLabor = totalDirectCost + failureBuffer + laborCost;
    const retailPrice = baseCostWithLabor / (1 - (profitMarginPercent / 100));
    const profitMargin = retailPrice - baseCostWithLabor;

    const explanation = `Printing ${printWeightGrams}g of ${material.name} over ${printTimeHours} hrs costs $${totalDirectCost.toFixed(2)} in raw materials ($${filamentCost.toFixed(2)} filament, $${electricityCost.toFixed(2)} electricity).`;

    return {
      material,
      printWeightGrams,
      printTimeHours,
      spoolPriceUsd: spoolPrice,
      spoolWeightGrams: spoolWeight,
      filamentCostUsd: Math.round(filamentCost * 100) / 100,
      electricityCostUsd: Math.round(electricityCost * 100) / 100,
      wearAndTearCostUsd: Math.round(wearAndTearCost * 100) / 100,
      totalDirectCostUsd: Math.round(totalDirectCost * 100) / 100,
      laborCostUsd: Math.round(laborCost * 100) / 100,
      failureBufferUsd: Math.round(failureBuffer * 100) / 100,
      suggestedRetailPriceUsd: Math.round(retailPrice * 100) / 100,
      profitMarginUsd: Math.round(profitMargin * 100) / 100,
      formattedDirectCost: `$${totalDirectCost.toFixed(2)}`,
      formattedRetailPrice: `$${retailPrice.toFixed(2)}`,
      explanation
    };
  }
}
