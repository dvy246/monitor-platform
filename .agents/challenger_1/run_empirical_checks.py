#!/usr/bin/env python3
"""
Comprehensive Empirical Verification Script for Challenger Report
"""

def generate_verification_data():
    results = {}
    
    # 1. Long distance tariff calculation
    W = 7000 # 7000 lbs
    M = 1000 # 1000 miles
    R = 75.0 # $75/cwt
    S = 0.12 # 12% fuel
    C_val = 150 # $150
    
    report_cost = (W * (M / 1000.0) * R) * (1 + S) + C_val
    correct_cost = ((W / 100.0) * (M / 1000.0) * R) * (1 + S) + C_val
    
    results['tariff_report_cost'] = report_cost
    results['tariff_correct_cost'] = correct_cost
    results['tariff_error_factor'] = report_cost / correct_cost
    
    # 2. Box volumes
    small_calc = (16 * 12 * 12) / 1728.0
    wardrobe_calc = (24 * 21 * 48) / 1728.0
    results['small_box_calc'] = small_calc
    results['wardrobe_box_calc'] = wardrobe_calc
    
    # 3. Payload utilization at 100% gross volume and 7 lbs/cu ft
    trucks = [
        ("10ft", 402, 2850),
        ("15ft", 764, 6385),
        ("20ft", 1016, 8500),
        ("26ft", 1682, 12890)
    ]
    truck_res = []
    for name, gross, payload in trucks:
        wt_gross = gross * 7.0
        util_gross = (wt_gross / payload) * 100.0
        truck_res.append({
            'name': name,
            'gross': gross,
            'payload': payload,
            'wt_gross': wt_gross,
            'util_gross': util_gross
        })
    results['trucks'] = truck_res
    
    return results

if __name__ == '__main__':
    data = generate_verification_data()
    print("=== EMPIRICAL VERIFICATION RESULTS ===")
    print(f"Tariff Report Cost: ${data['tariff_report_cost']:,.2f}")
    print(f"Tariff Correct Cost: ${data['tariff_correct_cost']:,.2f}")
    print(f"Error Factor: {data['tariff_error_factor']:.2f}x")
    print(f"Small Box (16x12x12): {data['small_box_calc']:.3f} cu ft (Report claimed 1.5 cu ft)")
    print(f"Wardrobe Box (24x21x48): {data['wardrobe_box_calc']:.3f} cu ft (Report claimed 15.0 cu ft)")
    for t in data['trucks']:
        print(f"Truck {t['name']}: Gross {t['gross']} cu ft -> Wt @ 7lbs/cu ft = {t['wt_gross']} lbs / Payload {t['payload']} lbs ({t['util_gross']:.1f}%)")
