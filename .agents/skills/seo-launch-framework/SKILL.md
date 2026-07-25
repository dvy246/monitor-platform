---
name: seo-launch-framework
description: A production-grade SEO Launch Framework consisting of six structured audits. Use for pre-launch evaluation of any website (SaaS, E-commerce, AI products, etc.) to determine ranking readiness and provide a definitive "Launch" decision.
---

# SEO Launch Framework

This skill provides a systematic, evidence-based framework for auditing websites before they go live. It is designed to function like an experienced SEO Director performing a pre-launch audit for a high-stakes project.

## Workflow Overview

The framework consists of six sequential audits. For a complete launch assessment, perform them in order:

1. **[Technical SEO Audit](references/1-technical-audit.md)**: Crawlability, indexability, and performance.
2. **[Content Quality Audit](references/2-content-audit.md)**: E-E-A-T, helpfulness, and intent matching.
3. **[Competitive Gap Analysis](references/3-competitive-gap.md)**: Identifying missing features and topics vs competitors.
4. **[Product & UX Audit](references/4-ux-audit.md)**: Information architecture, accessibility, and mobile UX.
5. **[Authority Audit](references/5-authority-audit.md)**: Brand signals, schema, and link profile.
6. **[Launch Readiness Audit](references/6-launch-readiness.md)**: The final decision-making aggregate.

## How to Use

### 1. Initialize the Audit
Start by gathering the necessary inputs for the target website:
- URL, Tech Stack, Primary Competitors, and Target Keywords.

### 2. Execute Individual Audits
For each audit phase, read the corresponding reference file in the `references/` directory. Each file contains a specialized prompt structure:
- **Role**: The persona to adopt for that specific audit.
- **Objective**: The goal of the audit.
- **Execution Plan**: Step-by-step instructions.
- **Output Format**: How the findings must be presented.

### 3. Generate the Final Decision
After completing the first five audits, use the **[Launch Readiness Audit](references/6-launch-readiness.md)** to aggregate all findings. 

The final output MUST end with one of these decisions:
- 🟢 **LAUNCH**
- 🟡 **LAUNCH WITH CONDITIONS**
- 🔴 **DO NOT LAUNCH**

## Principles of the Framework

- **Actionable**: Every finding must translate into an engineering or content task.
- **Evidence-Based**: Never provide generic advice; cite specific URLs, errors, or competitor data.
- **Product-Agnostic**: Works for SaaS, E-commerce, Blogs, and AI tools alike.
- **Modern Search Focused**: Optimized for current Google Search Quality standards, AI Overviews, and Core Web Vitals.
