/**
 * Agent 10 — Project Plan
 * Phase: 7 (sequential, after business plan)
 * Inputs: agents 3, 4, 5, 7, 9
 * Output: 18-month project execution plan
 *
 * Renders 6 tabs:
 *   Gantt Chart    — Visual timeline across 5 phases (CSS-based, no library)
 *   Milestones     — 18 color-coded milestone markers with owners
 *   Budget Tracker — Line-by-line budget table with phase and due date
 *   Risk Register  — 8 risks with probability, impact, mitigation, owner
 *   Team & Vendors — 12 vendor cards with real contacts and website links
 *   Checklist      — 60+ interactive checkboxes organized by phase
 *
 * 5 Project Phases:
 *   Phase 1: Foundation & Funding (months 1-3)
 *   Phase 2: Legal, Lease & Design (months 3-6)
 *   Phase 3: Construction & Licensing (months 6-12)
 *   Phase 4: Staffing & Pre-Opening (months 12-16)
 *   Phase 5: Soft Open & Ramp (months 16-18)
 *
 * KNOWN ISSUE (CR-003): Same as Agent 9 — very large prompt.
 */
export const KEY_PHASES = [
  'Foundation & Funding',
  'Legal, Lease & Design',
  'Construction & Licensing',
  'Staffing & Pre-Opening',
  'Soft Open & Ramp'
];
