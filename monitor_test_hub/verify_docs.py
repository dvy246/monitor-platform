#!/usr/bin/env python3
"""
Monitor Test Hub Documentation Verification Script (`verify_docs.py`)

Programmatically inspects and verifies that `prd.md` and `plan.md` exist, are non-empty,
and contain all required technical details, specifications, formulas, disclaimers, schema snippets,
citations, and milestones specified in `competitor_analysis_report.md`.
"""

import os
import re
import sys
from pathlib import Path

# Target directory and files
BASE_DIR = Path(__file__).resolve().parent
PRD_PATH = BASE_DIR / "prd.md"
PLAN_PATH = BASE_DIR / "plan.md"
REPORT_PATH = BASE_DIR / "competitor_analysis_report.md"

class DocumentationVerifier:
    def __init__(self):
        self.prd_content = ""
        self.plan_content = ""
        self.report_content = ""
        self.results = []

    def log_result(self, category: str, test_name: str, passed: bool, details: str):
        self.results.append({
            "category": category,
            "name": test_name,
            "status": "PASS" if passed else "FAIL",
            "details": details
        })

    def load_files(self) -> bool:
        all_ok = True
        
        # Check PRD
        if PRD_PATH.exists() and PRD_PATH.stat().st_size > 0:
            self.prd_content = PRD_PATH.read_text(encoding="utf-8")
            self.log_result("File Check", "PRD File Existence & Non-Emptiness", True, f"prd.md found ({len(self.prd_content)} bytes)")
        else:
            self.log_result("File Check", "PRD File Existence & Non-Emptiness", False, "prd.md is missing or empty")
            all_ok = False

        # Check Plan
        if PLAN_PATH.exists() and PLAN_PATH.stat().st_size > 0:
            self.plan_content = PLAN_PATH.read_text(encoding="utf-8")
            self.log_result("File Check", "Plan File Existence & Non-Emptiness", True, f"plan.md found ({len(self.plan_content)} bytes)")
        else:
            self.log_result("File Check", "Plan File Existence & Non-Emptiness", False, "plan.md is missing or empty")
            all_ok = False

        # Check Competitor Report
        if REPORT_PATH.exists() and REPORT_PATH.stat().st_size > 0:
            self.report_content = REPORT_PATH.read_text(encoding="utf-8")
            self.log_result("File Check", "Competitor Analysis Report Existence", True, f"competitor_analysis_report.md found ({len(self.report_content)} bytes)")
        else:
            self.log_result("File Check", "Competitor Analysis Report Existence", False, "competitor_analysis_report.md is missing or empty")
            all_ok = False

        return all_ok

    def verify_tech_stack(self):
        """Verify Astro.js & Tailwind CSS stack references in PRD and Plan."""
        astro_in_prd = bool(re.search(r"Astro(\.js)?", self.prd_content, re.IGNORECASE))
        astro_in_plan = bool(re.search(r"Astro(\.js)?", self.plan_content, re.IGNORECASE))
        tailwind_in_prd = "Tailwind" in self.prd_content
        tailwind_in_plan = "Tailwind" in self.plan_content

        passed = astro_in_prd and astro_in_plan and tailwind_in_prd and tailwind_in_plan
        details = f"Astro in PRD: {astro_in_prd}, Plan: {astro_in_plan}; Tailwind in PRD: {tailwind_in_prd}, Plan: {tailwind_in_plan}"
        self.log_result("Tech Stack", "Astro.js & Tailwind CSS Stack References", passed, details)

    def verify_desktop_engine(self):
        """Verify Desktop visual diagnostic engine features."""
        checks = {
            "540Hz+ VSYNC": bool(re.search(r"540Hz\+?", self.prd_content)),
            "Sub-pixel Layout Analyzer (RGB/BGR/QD-OLED/WOLED)": all(sub in self.prd_content for sub in ["RGB", "BGR", "QD-OLED", "WOLED"]),
            "OLED 5%/10% Gray Uniformity & Burn-in": "5%" in self.prd_content and "10%" in self.prd_content and "burn-in" in self.prd_content.lower(),
            "VRR Tear-bar Oscillation / Stutter": "VRR" in self.prd_content and re.search(r"tear-bar|tearing", self.prd_content, re.IGNORECASE),
            "Multi-display Canvas Sync (BroadcastChannel + WebSocket)": "BroadcastChannel" in self.prd_content and "WebSocket" in self.prd_content,
            "WASM LittleCMS ICC Exporter": "LittleCMS" in self.prd_content and "WASM" in self.prd_content
        }

        all_passed = all(checks.values())
        failed_items = [k for k, v in checks.items() if not v]
        details = "All desktop diagnostic engine specs present" if all_passed else f"Missing: {', '.join(failed_items)}"
        self.log_result("Desktop Engine", "Desktop Visual Diagnostic Engine Specifications", all_passed, details)

    def verify_mobile_engine(self):
        """Verify Mobile touch diagnostic engine features."""
        checks = {
            "Multi-touch Count Detection": re.search(r"multi-touch count", self.prd_content, re.IGNORECASE) is not None,
            "Adaptive Dead-zone Grid Matrix": re.search(r"dead-zone", self.prd_content, re.IGNORECASE) is not None,
            "Swipe Velocity Tracking": re.search(r"swipe|gesture velocity", self.prd_content, re.IGNORECASE) is not None,
            "Vector Draw Precision with RMS Formula (Dev_rms)": ("Dev_" in self.prd_content or "Dev}" in self.prd_content) and "rms" in self.prd_content.lower(),
            "Mobile Viewport Sandboxing (100dvh/100dvw)": "100dvh" in self.prd_content and "100dvw" in self.prd_content,
            "Non-passive Event Listeners": "passive: false" in self.prd_content or "non-passive" in self.prd_content.lower(),
            "Offline PWA Service Worker": "Service Worker" in self.prd_content or "ServiceWorker" in self.prd_content or "PWA" in self.prd_content
        }

        all_passed = all(checks.values())
        failed_items = [k for k, v in checks.items() if not v]
        details = "All mobile touch diagnostic engine specs present" if all_passed else f"Missing: {', '.join(failed_items)}"
        self.log_result("Mobile Engine", "Mobile Touch Diagnostic Engine Specifications", all_passed, details)

    def verify_arcade_games(self):
        """Verify All 4 Arcade micro-games, formulas, and ASCII UI diagrams."""
        games = [
            ("Ghosting Invaders", r"Ghosting Invaders", [r"v_{\\text{pursuit}}|V_p", r"f_{\\text{refresh}}"], r"\+--+[\s\S]*?INVADERS[\s\S]*?\+--+"),
            ("Color Match Alchemist", r"Color Match Alchemist", [r"V_{\\text{linear}}", r"\\Delta E_{00}"], r"\+--+[\s\S]*?COLOR MATCH ALCHEMIST[\s\S]*?\+--+"),
            ("Lag Reflex Sniper", r"Lag Reflex Sniper", [r"performance\.now\(\)", r"f_{\\text{poll}}"], r"\+--+[\s\S]*?LAG REFLEX SNIPER[\s\S]*?\+--+"),
            ("Touch Matrix Defusal", r"Touch Matrix Defusal", [r"10 \\times 16|10x16", r"GridState"], r"\+--+[\s\S]*?TOUCH MATRIX DEFUSAL[\s\S]*?\+--+")
        ]

        for game_name, name_pattern, formula_patterns, ascii_pattern in games:
            has_name = bool(re.search(name_pattern, self.prd_content, re.IGNORECASE))
            has_formulas = all(bool(re.search(fp, self.prd_content)) for fp in formula_patterns)
            has_ascii = bool(re.search(ascii_pattern, self.prd_content, re.IGNORECASE))

            passed = has_name and has_formulas and has_ascii
            details = f"Name: {has_name}, Formulas: {has_formulas}, ASCII Diagram: {has_ascii}"
            self.log_result("Arcade Suite", f"Arcade Micro-Game: {game_name}", passed, details)

    def verify_ymyl_eeat(self):
        """Verify Strict YMYL / E-E-A-T Compliance components."""
        # 1. Thin Content Avoidance Strategy
        thin_content = "Thin Content Avoidance" in self.prd_content or "doorway pages" in self.prd_content.lower()
        self.log_result("YMYL / E-E-A-T", "Thin Content Avoidance Strategy", thin_content, "Present in PRD" if thin_content else "Missing")

        # 2. Core Web Vitals & UX Architecture
        cwv = "LCP" in self.prd_content and "CLS" in self.prd_content and "SSG" in self.prd_content
        self.log_result("YMYL / E-E-A-T", "Core Web Vitals & UX Architecture", cwv, "Present in PRD" if cwv else "Missing")

        # 3. Information Architecture & URL Taxonomy
        url_tax = "/display-tests/" in self.prd_content and "/screen-test-meaning/" in self.prd_content
        self.log_result("YMYL / E-E-A-T", "Information Architecture & URL Taxonomy (/display-tests/ vs /screen-test-meaning/)", url_tax, "Present in PRD" if url_tax else "Missing")

        # 4. Medical Bounce Neutralizer Hero Banner
        banner = 'id="ymyl-routing-banner"' in self.prd_content and "Medical Query Routing Notice" in self.prd_content
        self.log_result("YMYL / E-E-A-T", "Medical Bounce Neutralizer Hero Banner (HTML & CSS)", banner, "Present in PRD" if banner else "Missing")

        # 5. Schema.org JSON-LD Metadata Graph
        schema = '"@type": "WebApplication"' in self.prd_content and '"audienceType": "None - Non-Medical Hardware Diagnostic Tool"' in self.prd_content
        self.log_result("YMYL / E-E-A-T", "Schema.org JSON-LD with Explicit medicalAudience Override", schema, "Present in PRD" if schema else "Missing")

        # 6. Copy-Pasteable Disclaimers
        epilepsy_disc = "WCAG 2.1 Success Criterion 2.3.1" in self.prd_content or "WCAG 2.3.1" in self.prd_content or "PHOTOSENSITIVE" in self.prd_content
        ergonomics_disc = "20-20-20 Rule" in self.prd_content
        hardware_disc = "hardware colorimeters" in self.prd_content.lower() or "spectrophotometers" in self.prd_content.lower()
        
        all_disclaimers = epilepsy_disc and ergonomics_disc and hardware_disc
        disc_details = f"Epilepsy: {epilepsy_disc}, Ergonomics (20-20-20): {ergonomics_disc}, Hardware Limit: {hardware_disc}"
        self.log_result("YMYL / E-E-A-T", "Copy-Pasteable Disclaimer HTML Templates (Epilepsy, 20-20-20, Hardware)", all_disclaimers, disc_details)

        # 7. Hardware Citations
        citations = [
            ("ISO 9241-307:2008", "ISO 9241-307"),
            ("VESA DisplayHDR 1.2", "VESA DisplayHDR 1.2"),
            ("IEC 62341", "IEC 62341"),
            ("CIE Standards", "CIE"),
            ("ANSI/IES RP-28-20", "ANSI/IES RP-28-20")
        ]
        citation_results = {name: term in self.prd_content for name, term in citations}
        all_citations = all(citation_results.values())
        missing_citations = [k for k, v in citation_results.items() if not v]
        cit_details = "All 5 standard engineering citations present" if all_citations else f"Missing: {', '.join(missing_citations)}"
        self.log_result("YMYL / E-E-A-T", "Formal Hardware Engineering Citations (ISO, VESA, IEC, CIE, ANSI)", all_citations, cit_details)

        # 8. YMYL Compliance Verification Checklist Table
        matrix = "YMYL & Safety Compliance Verification Matrix" in self.prd_content and self.prd_content.count("| **") >= 10
        self.log_result("YMYL / E-E-A-T", "YMYL Compliance Verification Matrix (10-item table)", matrix, "10-item matrix present in PRD" if matrix else "Missing or incomplete")

    def verify_plan_milestones(self):
        """Verify Actionable Chronological Engineering Milestones (1 through 8) in plan.md."""
        milestones = [
            ("Milestone 1", r"Milestone 1: Project Setup & Core Architecture"),
            ("Milestone 2", r"Milestone 2: Desktop Visual Diagnostics Engine"),
            ("Milestone 3", r"Milestone 3: Mobile Touch Diagnostic Engine"),
            ("Milestone 4", r"Milestone 4: Monitor & Touch Arcade Suite"),
            ("Milestone 5", r"Milestone 5: UI/UX & WCAG Accessibility Implementation"),
            ("Milestone 6", r"Milestone 6: SEO Metadata, Schema.org & YMYL Disambiguation Implementation"),
            ("Milestone 7", r"Milestone 7: Performance Auditing, Testing & Quality Assurance"),
            ("Milestone 8", r"Milestone 8: Deployment & CI/CD Pipeline")
        ]

        m_results = {m_name: bool(re.search(pattern, self.plan_content, re.IGNORECASE)) for m_name, pattern in milestones}
        all_milestones = all(m_results.values())
        missing_m = [k for k, v in m_results.items() if not v]

        m_details = "All Milestones 1-8 present in plan.md" if all_milestones else f"Missing: {', '.join(missing_m)}"
        self.log_result("Execution Plan", "Chronological Milestones (1 through 8)", all_milestones, m_details)

        # Verify key milestone components
        seo_setup = bool(re.search(r"SEO Metadata", self.plan_content, re.IGNORECASE))
        schema_injection = bool(re.search(r"Schema\.org JSON-LD", self.plan_content, re.IGNORECASE))
        perf_auditing = bool(re.search(r"Performance Auditing", self.plan_content, re.IGNORECASE))
        deployment = bool(re.search(r"Deployment", self.plan_content, re.IGNORECASE))

        plan_components = seo_setup and schema_injection and perf_auditing and deployment
        p_details = f"SEO: {seo_setup}, Schema.org: {schema_injection}, Performance Audit: {perf_auditing}, Deployment: {deployment}"
        self.log_result("Execution Plan", "Plan Core Integration Deliverables (SEO, Schema, Audit, CI/CD)", plan_components, p_details)

    def print_report(self) -> bool:
        print("\n" + "=" * 90)
        print("MONITOR TEST HUB — DOCUMENTATION VERIFICATION REPORT")
        print("=" * 90)
        print(f"{'Category':<18} | {'Check Name':<50} | {'Status':<6} | Details")
        print("-" * 90)

        total_checks = len(self.results)
        passed_checks = 0

        for r in self.results:
            status = r["status"]
            if status == "PASS":
                passed_checks += 1
                status_str = "\033[92mPASS\033[0m" if sys.stdout.isatty() else "PASS"
            else:
                status_str = "\033[91mFAIL\033[0m" if sys.stdout.isatty() else "FAIL"

            print(f"{r['category']:<18} | {r['name']:<50} | {status:<6} | {r['details']}")

        print("=" * 90)
        print(f"SUMMARY: {passed_checks}/{total_checks} Checks Passed ({(passed_checks/total_checks)*100:.1f}%)")
        print("=" * 90 + "\n")

        return passed_checks == total_checks

def main():
    verifier = DocumentationVerifier()
    
    if not verifier.load_files():
        print("Error: Required documentation files could not be loaded.")
        sys.exit(1)

    verifier.verify_tech_stack()
    verifier.verify_desktop_engine()
    verifier.verify_mobile_engine()
    verifier.verify_arcade_games()
    verifier.verify_ymyl_eeat()
    verifier.verify_plan_milestones()

    success = verifier.print_report()
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
