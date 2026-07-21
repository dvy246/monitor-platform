## 2026-07-21T17:49:37+05:30
<USER_REQUEST>
You are a teamwork_preview_auditor agent assigned to audit the documentation and verification artifacts produced for Monitor Test Hub.

Working directory for your metadata: `/Users/divyyadav/newws/monitor_test_hub/.agents/auditor`

Target Files to Audit:
1. `/Users/divyyadav/newws/monitor_test_hub/prd.md`
2. `/Users/divyyadav/newws/monitor_test_hub/plan.md`
3. `/Users/divyyadav/newws/monitor_test_hub/verify_docs.py`
4. `/Users/divyyadav/newws/monitor_test_hub/competitor_analysis_report.md`
5. `/Users/divyyadav/newws/monitor_test_hub/ORIGINAL_REQUEST.md`

Audit Tasks:
1. Conduct a thorough forensic audit of `prd.md`, `plan.md`, and `verify_docs.py`.
2. Verify that the work product is genuine, non-fabricated, non-hardcoded, complete, and fully accurate according to all requirements in `competitor_analysis_report.md` and `ORIGINAL_REQUEST.md`.
3. Verify that `verify_docs.py` runs genuinely and checks real file contents rather than hardcoding fake test output. You may execute `python3 /Users/divyyadav/newws/monitor_test_hub/verify_docs.py` to verify its execution.
4. Report an explicit verdict: CLEAN (no integrity violations found) or INTEGRITY VIOLATION / CHEATING DETECTED. Provide complete evidence details.

Write your audit report to `/Users/divyyadav/newws/monitor_test_hub/.agents/auditor/handoff.md`. Notify parent via send_message with your verdict and findings.
</USER_REQUEST>
