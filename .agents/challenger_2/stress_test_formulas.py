import math

def test_secondary_formulas():
    print("--- Secondary Formula Stress Testing ---")
    
    # Candidate 1: Packing Efficiency
    v_total = 1000 # cu ft
    eta = 0.85
    v_gross = v_total / eta
    w_est = v_total * 7.0
    print(f"Candidate 1: 1000 cu ft inventory -> Gross truck req: {v_gross:.1f} cu ft, Weight: {w_est:.0f} lbs")
    assert math.isclose(v_gross, 1176.47, abs_tol=0.01)
    assert w_est == 7000

    # Candidate 3: Box Tape rolls (15.7 boxes per roll)
    boxes = 50
    n_tape = math.ceil(boxes / 15.7)
    print(f"Candidate 3: 50 boxes -> Tape rolls: {n_tape} (50/15.7 = {boxes/15.7:.2f})")
    assert n_tape == 4

    # Candidate 3: Stretch Film
    v1 = 300
    s1 = max(1, math.ceil(v1 / 500))
    v2 = 1200
    s2 = max(1, math.ceil(v2 / 500))
    print(f"Candidate 3: Stretch film for {v1} cu ft = {s1} roll(s), for {v2} cu ft = {s2} roll(s)")
    assert s1 == 1 and s2 == 3

    # Candidate 3: Truck payload utilization ratio
    # 26ft truck: Gross Vol 1682 cu ft, Payload limit 12,890 lbs
    w_packed = 14000 # Overload scenario
    p_max = 12890
    mu = w_packed / p_max
    print(f"Candidate 3 DOT Counter: Packed weight {w_packed} lbs / Max {p_max} lbs -> Ratio mu = {mu:.2f}")
    assert mu > 1.0 # Triggers CRITICAL OVERLOAD (Red Alert)

    print("All secondary formula stress tests PASSED cleanly.")

if __name__ == "__main__":
    test_secondary_formulas()
