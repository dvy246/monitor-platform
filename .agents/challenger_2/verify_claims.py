import json
import os
import sys

def test_static_data_payloads():
    # 1. Solar ZIP code data simulation
    # 41,704 ZIP codes in US
    zip_sample = {
        "zip": "90210",
        "lat": 34.0901,
        "lon": -118.4065,
        "sun_hours": 5.6,
        "rate": 0.32,
        "nem_tier": "NEM_3",
        "state": "CA"
    }
    sample_json = json.dumps(zip_sample)
    total_zips_bytes = len(sample_json) * 41704
    total_zips_mb = total_zips_bytes / (1024 * 1024)

    # 2. Cloud rates simulation across 6 providers
    # AWS, Azure, GCP, Cloudflare, DO, Hetzner
    # Skus: 50 compute instances * 5 storage tiers * 4 egress tiers * 3 regions
    cloud_sku_sample = {
        "provider": "AWS",
        "region": "us-east-1",
        "instance": "m6i.xlarge",
        "vcpu": 4,
        "ram_gb": 16,
        "price_per_hr": 0.192,
        "storage_gb_month": 0.023,
        "egress_per_gb": [0.0, 0.09, 0.085, 0.07],
        "api_class_a": 0.005,
        "api_class_b": 0.0004
    }
    cloud_json = json.dumps(cloud_sku_sample)
    # Approx 2,500 SKUs minimum for realistic multi-cloud coverage
    cloud_total_mb = (len(cloud_json) * 2500) / (1024 * 1024)

    # 3. 50-State tax brackets simulation
    state_tax_sample = {
        "state": "CA",
        "filing_status": "single",
        "brackets": [
            {"threshold": 0, "rate": 0.01},
            {"threshold": 10099, "rate": 0.02},
            {"threshold": 23942, "rate": 0.04},
            {"threshold": 37788, "rate": 0.06},
            {"threshold": 52455, "rate": 0.08},
            {"threshold": 66295, "rate": 0.093},
            {"threshold": 338639, "rate": 0.103},
            {"threshold": 406364, "rate": 0.113},
            {"threshold": 677275, "rate": 0.123}
        ],
        "sd": 5363,
        "se_deduction": True
    }
    state_total_kb = (len(json.dumps(state_tax_sample)) * 50 * 3) / 1024

    return {
        "solar_zip_dataset_mb": round(total_zips_mb, 2),
        "cloud_pricing_dataset_mb": round(cloud_total_mb, 2),
        "state_tax_dataset_kb": round(state_total_kb, 2)
    }

def test_url_hash_capacity():
    # Test complex multi-cloud configuration URL hash length
    complex_config = {
        "p": ["aws", "azure", "gcp", "cf", "do", "hetzner"],
        "c": [{"type": "c5.2xlarge", "qty": 4, "hr": 0.34}, {"type": "m6i.xlarge", "qty": 2, "hr": 0.192}],
        "s": [{"type": "s3_std", "gb": 15000}, {"type": "r2", "gb": 50000}],
        "e": [{"from": "aws", "to": "internet", "gb": 25000}, {"from": "cf", "to": "internet", "gb": 50000}],
        "a": {"class_a": 5000000, "class_b": 20000000},
        "mau": 150000,
        "cogs_target": 0.05
    }
    import urllib.parse
    hash_str = urllib.parse.urlencode({"config": json.dumps(complex_config)})
    return {
        "raw_json_len": len(json.dumps(complex_config)),
        "encoded_url_hash_len": len(hash_str),
        "exceeds_safe_url_limit_2k": len(hash_str) > 2000
    }

if __name__ == "__main__":
    payloads = test_static_data_payloads()
    url_test = test_url_hash_capacity()
    print("PAYLOAD SIMULATION:", json.dumps(payloads, indent=2))
    print("URL HASH TEST:", json.dumps(url_test, indent=2))
