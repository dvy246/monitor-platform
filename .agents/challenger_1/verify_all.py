#!/usr/bin/env python3
"""
Empirical verification script for niche_research_report.md
"""

import sys

def test_long_distance_mover_formula():
    print("=== TEST 1: Long-Distance Professional Mover Cost Equation ===")
    # Report line 199 formula: C_Pro,Long = ( W_lbs * (M_miles / 1000) * R_cwt ) * (1 + S_fuel%) + C_valuation
    # Report line 200 definition: R_cwt = $60.00 - $90.00 per 100 lbs per 1,000 miles
    
    # Test case: 3-Bedroom house (~1,000 cu ft = 7,000 lbs)
    W_lbs = 7000
    M_miles = 1000
    R_cwt = 75.0  # $75 per 100 lbs (hundredweight) per 1,000 miles
    S_fuel = 0.12  # 12% fuel surcharge
    C_valuation = 150  # $150 insurance/valuation
    
    # Report's explicit mathematical formula as written:
    c_pro_long_report = (W_lbs * (M_miles / 1000.0) * R_cwt) * (1 + S_fuel) + C_valuation
    
    # Correct tariff formula (dividing W_lbs by 100 to get CWT / hundredweight):
    cwt = W_lbs / 100.0
    c_pro_long_correct = (cwt * (M_miles / 1000.0) * R_cwt) * (1 + S_fuel) + C_valuation
    
    print(f"Test scenario: Weight = {W_lbs} lbs, Distance = {M_miles} miles, R_cwt = ${R_cwt}/cwt, Fuel Surcharge = {S_fuel*100}%")
    print(f"Report formula calculation:  ${c_pro_long_report:,.2f}")
    print(f"Correct tariff calculation:  ${c_pro_long_correct:,.2f}")
    print(f"Ratio (Report / Correct):    {c_pro_long_report / c_pro_long_correct:.2f}x (Off by 100x!)")
    
    is_bug = abs(c_pro_long_report - c_pro_long_correct) > 1.0
    print(f"Formula Error Confirmed: {is_bug}\n")
    return is_bug

def test_diy_rental_cost_formula():
    print("=== TEST 2: DIY Rental Truck Cost Equation for Long-Distance ===")
    # Report line 190 formula: C_DIY = (D_days * R_daily) + (M_miles * R_mile) + (M_miles / MPG * P_gas) + C_tolls + C_equip + C_ins + C_helpers
    # Report line 191 notes: R_daily = $19.95 - $39.95 local (or flat long-distance rate), R_mile = $0.99 - $1.49/mi local
    
    # Test case: 1,000 mile move over 3 days using a 26ft truck (7 MPG)
    D_days = 3
    M_miles = 1000
    MPG = 7.0
    P_gas = 3.85
    C_tolls = 50
    C_equip = 25
    C_ins = 45 * D_days # $135
    C_helpers = 300
    
    # Scenario A: Local pricing structure applied to long distance
    R_daily_local = 39.95
    R_mile_local = 0.99
    c_diy_local_struct = (D_days * R_daily_local) + (M_miles * R_mile_local) + (M_miles / MPG * P_gas) + C_tolls + C_equip + C_ins + C_helpers
    
    # Scenario B: Flat long distance rate ($1,200 package rate) + naive formula application keeping R_mile = 0.99
    R_daily_flat = 1200 / D_days # flat rate interpreted per day
    R_mile_flat = 0.99
    c_diy_flat_naive = (D_days * R_daily_flat) + (M_miles * R_mile_flat) + (M_miles / MPG * P_gas) + C_tolls + C_equip + C_ins + C_helpers
    
    # Scenario C: Actual long distance structure (Flat rate includes miles, R_mile = 0)
    c_diy_flat_actual = 1200 + (M_miles / MPG * P_gas) + C_tolls + C_equip + C_ins + C_helpers
    
    print(f"Scenario A (Local rates for 1000mi): ${c_diy_local_struct:,.2f}")
    print(f"Scenario B (Flat rate + per-mile fee in naive formula): ${c_diy_flat_naive:,.2f}")
    print(f"Scenario C (Actual flat rate with included mileage): ${c_diy_flat_actual:,.2f}")
    print("Flaw: Formula conflates local per-mile charges with long-distance flat rates without setting R_mile=0 for one-way moves.\n")

def test_box_volume_geometry():
    print("=== TEST 3: Box Dimension Geometry Verification ===")
    boxes = [
        ("Small Box", 16, 12, 12, 1.5),
        ("Medium Box", 18, 18, 16, 3.0),
        ("Large Box", 18, 18, 24, 4.5),
        ("Wardrobe Box", 24, 21, 48, 15.0),
        ("Dish Barrel Box", 18, 18, 28, 5.2),
    ]
    
    mismatches = []
    for name, L, W, H, claimed_vol in boxes:
        calc_vol = (L * W * H) / 1728.0
        diff = abs(calc_vol - claimed_vol)
        status = "EXACT MATCH" if diff < 0.06 else f"DISCREPANCY (Calc: {calc_vol:.3f} cu ft vs Claimed: {claimed_vol} cu ft)"
        print(f"{name:16s} ({L}\"x{W}\"x{H}\"): Calculated = {calc_vol:.3f} cu ft | Claimed = {claimed_vol} cu ft -> {status}")
        if diff >= 0.06:
            mismatches.append((name, L, W, H, calc_vol, claimed_vol))
            
    print(f"Total Box Geometry Mismatches: {len(mismatches)}\n")
    return mismatches

def test_truck_volume_and_efficiency():
    print("=== TEST 4: Truck Volume & Usable Packing Efficiency ===")
    trucks = [
        ("10 Foot Truck", 402, 340),
        ("15 Foot Truck", 764, 650),
        ("20 Foot Truck", 1016, 860),
        ("26 Foot Truck", 1682, 1430),
    ]
    eta = 0.85
    for name, gross, claimed_usable in trucks:
        calc_usable = gross * eta
        diff = abs(calc_usable - claimed_usable)
        print(f"{name:15s}: Gross = {gross} cu ft | Usable (85%): Calc = {calc_usable:.1f} cu ft | Claimed = {claimed_usable} cu ft")
    print()

def test_dot_weight_payload_math():
    print("=== TEST 5: DOT Weight & Payload Capacity Limits ===")
    trucks = [
        ("10 Foot Truck", 402, 2850, 8600),
        ("15 Foot Truck", 764, 6385, 14500),
        ("20 Foot Truck", 1016, 8500, 18000),
        ("26 Foot Truck", 1682, 12890, 25999),
    ]
    density = 7.0 # lbs / cu ft
    
    print(f"Using standard household density factor: {density} lbs/cu ft")
    for name, gross_vol, payload_limit, gvwr in trucks:
        usable_vol = gross_vol * 0.85
        weight_at_usable = usable_vol * density
        weight_at_gross = gross_vol * density
        ratio_usable = weight_at_usable / payload_limit
        ratio_gross = weight_at_gross / payload_limit
        req_density_to_overload = payload_limit / gross_vol
        print(f"{name}:")
        print(f"  Gross Vol: {gross_vol} cu ft | Payload Limit: {payload_limit:,} lbs")
        print(f"  Weight @ 85% Usable Vol: {weight_at_usable:,.1f} lbs (Utilization: {ratio_usable*100:.1f}%)")
        print(f"  Weight @ 100% Gross Vol: {weight_at_gross:,.1f} lbs (Utilization: {ratio_gross*100:.1f}%)")
        print(f"  Density required to reach 100% payload: {req_density_to_overload:.2f} lbs/cu ft")
    print()

if __name__ == "__main__":
    test_long_distance_mover_formula()
    test_diy_rental_cost_formula()
    test_box_volume_geometry()
    test_truck_volume_and_efficiency()
    test_dot_weight_payload_math()
