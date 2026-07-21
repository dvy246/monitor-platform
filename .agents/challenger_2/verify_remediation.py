import re
import math

def test_long_distance_pro_mover_formula():
    """
    Test scenario:
    W_lbs = 7,000 lbs
    M_miles = 1,000 miles
    R_cwt = $75
    S_fuel% = 12% (0.12)
    C_valuation = $150
    
    Formula:
    C_pro_long = ( (W_lbs / 100) * (M_miles / 1000) * R_cwt ) * (1 + S_fuel%) + C_valuation
    """
    W_lbs = 7000
    M_miles = 1000
    R_cwt = 75
    S_fuel_pct = 0.12
    C_valuation = 150

    # Correct formula
    cwt = W_lbs / 100.0
    dist_k = M_miles / 1000.0
    base_cost = cwt * dist_k * R_cwt
    with_fuel = base_cost * (1 + S_fuel_pct)
    total_cost = with_fuel + C_valuation

    # Old buggy formula (without / 100 for W_lbs)
    old_base_cost = W_lbs * dist_k * R_cwt
    old_with_fuel = old_base_cost * (1 + S_fuel_pct)
    old_total_cost = old_with_fuel + C_valuation

    print(f"Long-Distance Pro Mover Test:")
    print(f"  Correct Formula Total: ${total_cost:,.2f}")
    print(f"  Old Buggy Formula Total: ${old_total_cost:,.2f}")

    assert abs(total_cost - 6030.00) < 1e-4, f"Expected 6030.00, got {total_cost}"
    assert abs(old_total_cost - 588150.00) < 1e-4, f"Expected 588150.00, got {old_total_cost}"
    return True

def test_box_dimensions_and_volumes():
    """
    Verify geometry math:
    Small box: 16" x 12" x 12" = 2304 / 1728 = 1.333 cu ft (1.33 cu ft actual)
    Medium box: 18" x 18" x 16" = 5184 / 1728 = 3.0 cu ft
    Large box: 18" x 18" x 24" = 7776 / 1728 = 4.5 cu ft
    Wardrobe box: 24" x 21" x 48" = 24192 / 1728 = 14.0 cu ft
    Heavy duty Wardrobe: 24" x 22.5" x 48" = 25920 / 1728 = 15.0 cu ft
    Dish Barrel box: 18" x 18" x 28" = 9072 / 1728 = 5.25 cu ft
    """
    small_v = (16 * 12 * 12) / 1728.0
    med_v = (18 * 18 * 16) / 1728.0
    large_v = (18 * 18 * 24) / 1728.0
    wardrobe_v = (24 * 21 * 48) / 1728.0
    wardrobe_hd_v = (24 * 22.5 * 48) / 1728.0
    dish_v = (18 * 18 * 28) / 1728.0

    print("Box Dimension Math Checks:")
    print(f"  Small Box (16x12x12): {small_v:.2f} cu ft")
    print(f"  Medium Box (18x18x16): {med_v:.2f} cu ft")
    print(f"  Large Box (18x18x24): {large_v:.2f} cu ft")
    print(f"  Wardrobe Box (24x21x48): {wardrobe_v:.2f} cu ft")
    print(f"  Wardrobe HD Box (24x22.5x48): {wardrobe_hd_v:.2f} cu ft")
    print(f"  Dish Barrel Box (18x18x28): {dish_v:.2f} cu ft")

def test_report_file_content(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    results = {}

    # Check 1: Long Distance Formula Division by 100
    ld_match = re.search(r"C_\{?\\text\{Pro,\s*Long\}\}?\s*=.*\\frac\{W_\{?\\text\{lbs\}\}?\}\{100\}", content) or re.search(r"W_\{?\\text\{lbs\}\}?\s*/\s*100", content) or r"\frac{W_{\text{lbs}}}{100}" in content
    results["cwt_division_present"] = bool(ld_match)

    # Check 2: DIY Truck Rental Branching and R_mile = $0.00
    diy_local = "C_{\\text{DIY, Local}}" in content or "C_{DIY, Local}" in content
    diy_oneway = "C_{\\text{DIY, OneWay}}" in content or "C_{DIY, OneWay}" in content
    rmile_zero = "R_{\\text{mile}} = \\$0.00" in content or "R_{\\text{mile}} = $0.00" in content or "R_{mile} = $0.00" in content

    results["diy_local_branch"] = diy_local
    results["diy_oneway_branch"] = diy_oneway
    results["rmile_zero_present"] = rmile_zero

    # Check 3: Box dimensions and volumes alignment
    small_box_aligned = ("1.33 cu ft" in content or "1.33\\text{ cu ft}" in content) and ("1.5 cu ft" in content or "1.5\\text{ cu ft}" in content)
    wardrobe_box_aligned = ("14.0 cu ft" in content or "14.0\\text{ cu ft}" in content) and ("15.0 cu ft" in content or "15.0\\text{ cu ft}" in content)

    results["small_box_aligned"] = small_box_aligned
    results["wardrobe_box_aligned"] = wardrobe_box_aligned

    # Check 4: Explicit YMYL disclaimers
    ymyl_cost = "YMYL Educational Financial Disclaimer" in content
    ymyl_dot = "YMYL Educational Regulatory Disclaimer" in content
    ymyl_notice = "Educational & Planning Notice" in content

    results["ymyl_cost_disclaimer"] = ymyl_cost
    results["ymyl_dot_disclaimer"] = ymyl_dot
    results["ymyl_notice_footer"] = ymyl_notice

    return results

if __name__ == "__main__":
    print("--- Running empirical verification tests ---")
    test_long_distance_pro_mover_formula()
    print()
    test_box_dimensions_and_volumes()
    print()
    res = test_report_file_content("/Users/divyyadav/newws/niche_research_report.md")
    for k, v in res.items():
        print(f"  {k}: {v}")
