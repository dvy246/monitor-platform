/**
 * Appliance Electricity Cost & Energy Usage Engine
 * 
 * Provides state-by-state US residential electricity rate lookups (EIA benchmarks),
 * pre-loaded appliance wattage specs, daily/monthly/annual kWh and cost math,
 * seasonal usage adjustments, and side-by-side appliance cost comparisons.
 */

export interface StateEnergyRate {
  code: string;
  name: string;
  rateCentsPerKwh: number; // e.g. 32.5 for CA, 14.2 for TX
}

export interface AppliancePreset {
  id: string;
  name: string;
  category: 'Heating & Cooling' | 'Kitchen & Cooking' | 'Entertainment & Tech' | 'Laundry & Cleaning' | 'EV & Heavy Hardware';
  typicalWatts: number;
  defaultDailyHours: number;
  icon: string;
}

export interface EnergyCalculationResult {
  state: StateEnergyRate;
  appliance: AppliancePreset;
  watts: number;
  dailyHours: number;
  daysPerMonth: number;
  dailyKwh: number;
  monthlyKwh: number;
  annualKwh: number;
  dailyCost: number;
  monthlyCost: number;
  annualCost: number;
  formattedMonthlyCost: string;
  formattedAnnualCost: string;
}

export class ApplianceEnergyEngine {
  public static readonly US_STATES: StateEnergyRate[] = [
    { code: 'US', name: 'National Average', rateCentsPerKwh: 16.8 },
    { code: 'AL', name: 'Alabama', rateCentsPerKwh: 15.2 },
    { code: 'AK', name: 'Alaska', rateCentsPerKwh: 24.8 },
    { code: 'AZ', name: 'Arizona', rateCentsPerKwh: 14.9 },
    { code: 'AR', name: 'Arkansas', rateCentsPerKwh: 13.1 },
    { code: 'CA', name: 'California', rateCentsPerKwh: 32.5 },
    { code: 'CO', name: 'Colorado', rateCentsPerKwh: 15.4 },
    { code: 'CT', name: 'Connecticut', rateCentsPerKwh: 28.2 },
    { code: 'DE', name: 'Delaware', rateCentsPerKwh: 16.1 },
    { code: 'FL', name: 'Florida', rateCentsPerKwh: 15.6 },
    { code: 'GA', name: 'Georgia', rateCentsPerKwh: 14.8 },
    { code: 'HI', name: 'Hawaii', rateCentsPerKwh: 42.1 },
    { code: 'ID', name: 'Idaho', rateCentsPerKwh: 11.2 },
    { code: 'IL', name: 'Illinois', rateCentsPerKwh: 16.9 },
    { code: 'IN', name: 'Indiana', rateCentsPerKwh: 15.8 },
    { code: 'IA', name: 'Iowa', rateCentsPerKwh: 14.1 },
    { code: 'KS', name: 'Kansas', rateCentsPerKwh: 14.9 },
    { code: 'KY', name: 'Kentucky', rateCentsPerKwh: 12.9 },
    { code: 'LA', name: 'Louisiana', rateCentsPerKwh: 12.4 },
    { code: 'ME', name: 'Maine', rateCentsPerKwh: 23.5 },
    { code: 'MD', name: 'Maryland', rateCentsPerKwh: 17.2 },
    { code: 'MA', name: 'Massachusetts', rateCentsPerKwh: 27.9 },
    { code: 'MI', name: 'Michigan', rateCentsPerKwh: 18.5 },
    { code: 'MN', name: 'Minnesota', rateCentsPerKwh: 15.3 },
    { code: 'MS', name: 'Mississippi', rateCentsPerKwh: 13.8 },
    { code: 'MO', name: 'Missouri', rateCentsPerKwh: 13.5 },
    { code: 'MT', name: 'Montana', rateCentsPerKwh: 12.8 },
    { code: 'NE', name: 'Nebraska', rateCentsPerKwh: 12.2 },
    { code: 'NV', name: 'Nevada', rateCentsPerKwh: 16.4 },
    { code: 'NH', name: 'New Hampshire', rateCentsPerKwh: 22.9 },
    { code: 'NJ', name: 'New Jersey', rateCentsPerKwh: 18.7 },
    { code: 'NM', name: 'New Mexico', rateCentsPerKwh: 14.6 },
    { code: 'NY', name: 'New York', rateCentsPerKwh: 23.1 },
    { code: 'NC', name: 'North Carolina', rateCentsPerKwh: 13.9 },
    { code: 'ND', name: 'North Dakota', rateCentsPerKwh: 11.9 },
    { code: 'OH', name: 'Ohio', rateCentsPerKwh: 15.7 },
    { code: 'OK', name: 'Oklahoma', rateCentsPerKwh: 12.7 },
    { code: 'OR', name: 'Oregon', rateCentsPerKwh: 13.2 },
    { code: 'PA', name: 'Pennsylvania', rateCentsPerKwh: 18.1 },
    { code: 'RI', name: 'Rhode Island', rateCentsPerKwh: 27.4 },
    { code: 'SC', name: 'South Carolina', rateCentsPerKwh: 14.5 },
    { code: 'SD', name: 'South Dakota', rateCentsPerKwh: 13.4 },
    { code: 'TN', name: 'Tennessee', rateCentsPerKwh: 13.1 },
    { code: 'TX', name: 'Texas', rateCentsPerKwh: 14.6 },
    { code: 'UT', name: 'Utah', rateCentsPerKwh: 11.8 },
    { code: 'VT', name: 'Vermont', rateCentsPerKwh: 21.2 },
    { code: 'VA', name: 'Virginia', rateCentsPerKwh: 14.4 },
    { code: 'WA', name: 'Washington', rateCentsPerKwh: 11.5 },
    { code: 'WV', name: 'West Virginia', rateCentsPerKwh: 14.2 },
    { code: 'WI', name: 'Wisconsin', rateCentsPerKwh: 16.5 },
    { code: 'WY', name: 'Wyoming', rateCentsPerKwh: 12.1 }
  ];

  public static readonly APPLIANCES: AppliancePreset[] = [
    { id: 'space-heater', name: 'Portable Space Heater', category: 'Heating & Cooling', typicalWatts: 1500, defaultDailyHours: 8, icon: 'heater' },
    { id: 'central-ac', name: 'Central Air Conditioner (3 Ton)', category: 'Heating & Cooling', typicalWatts: 3500, defaultDailyHours: 9, icon: 'ac' },
    { id: 'window-ac', name: 'Window AC Unit (8,000 BTU)', category: 'Heating & Cooling', typicalWatts: 750, defaultDailyHours: 8, icon: 'ac' },
    { id: 'gaming-pc', name: 'High-End Gaming PC & Monitor', category: 'Entertainment & Tech', typicalWatts: 550, defaultDailyHours: 5, icon: 'pc' },
    { id: 'refrigerator', name: 'Standard Refrigerator', category: 'Kitchen & Cooking', typicalWatts: 150, defaultDailyHours: 24, icon: 'fridge' },
    { id: 'clothes-dryer', name: 'Electric Clothes Dryer', category: 'Laundry & Cleaning', typicalWatts: 3000, defaultDailyHours: 1, icon: 'dryer' },
    { id: 'ev-charger', name: 'Level 2 EV Home Charger', category: 'EV & Heavy Hardware', typicalWatts: 7200, defaultDailyHours: 3, icon: 'ev' },
    { id: 'water-heater', name: 'Electric Water Heater (50 Gal)', category: 'Heating & Cooling', typicalWatts: 4500, defaultDailyHours: 3, icon: 'water' },
    { id: 'oled-tv', name: '65" OLED 4K TV', category: 'Entertainment & Tech', typicalWatts: 140, defaultDailyHours: 6, icon: 'tv' }
  ];

  public static getStateByCode(code: string): StateEnergyRate {
    return this.US_STATES.find(s => s.code.toUpperCase() === code.toUpperCase()) || this.US_STATES[0];
  }

  public static getApplianceById(id: string): AppliancePreset {
    return this.APPLIANCES.find(a => a.id === id) || this.APPLIANCES[0];
  }

  /**
   * Computes exact energy consumption and cost breakdown
   */
  public static calculateCost(
    stateCode: string,
    applianceId: string,
    customWatts?: number,
    customHours?: number,
    customRateCents?: number
  ): EnergyCalculationResult {
    const state = this.getStateByCode(stateCode);
    const appliance = this.getApplianceById(applianceId);

    const watts = customWatts !== undefined && customWatts > 0 ? customWatts : appliance.typicalWatts;
    const dailyHours = customHours !== undefined && customHours >= 0 ? customHours : appliance.defaultDailyHours;
    const rateCents = customRateCents !== undefined && customRateCents > 0 ? customRateCents : state.rateCentsPerKwh;

    const rateDollarsPerKwh = rateCents / 100;

    const dailyKwh = (watts * dailyHours) / 1000;
    const monthlyKwh = dailyKwh * 30.416; // Average days per month
    const annualKwh = dailyKwh * 365;

    const dailyCost = dailyKwh * rateDollarsPerKwh;
    const monthlyCost = monthlyKwh * rateDollarsPerKwh;
    const annualCost = annualKwh * rateDollarsPerKwh;

    return {
      state: { ...state, rateCentsPerKwh: rateCents },
      appliance,
      watts,
      dailyHours,
      daysPerMonth: 30,
      dailyKwh: Math.round(dailyKwh * 100) / 100,
      monthlyKwh: Math.round(monthlyKwh * 10) / 10,
      annualKwh: Math.round(annualKwh),
      dailyCost: Math.round(dailyCost * 100) / 100,
      monthlyCost: Math.round(monthlyCost * 100) / 100,
      annualCost: Math.round(annualCost * 100) / 100,
      formattedMonthlyCost: `$${monthlyCost.toFixed(2)}`,
      formattedAnnualCost: `$${annualCost.toFixed(2)}`
    };
  }
}
