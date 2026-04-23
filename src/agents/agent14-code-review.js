/**
 * Agent 14 — Code Review
 * Phase: 11 (sequential, second-to-last)
 * Inputs: R{} — all accumulated agent results
 * Output: Issues, performance metrics, cost analysis, prioritized fixes
 *
 * Renders 5 tabs:
 *   Summary           — Overall grade (A-F) and narrative
 *   Issues Found      — 8 issues (CR-001 to CR-008) sorted by severity
 *   Performance       — 7 metrics scored 0-100 with current vs optimized
 *   Cost Analysis     — Per-agent token cost, total per run, monthly projections
 *   Recommended Fixes — Priority-ordered list with effort estimates
 *
 * Issues identified (see CLAUDE.md for full list):
 *   CR-001 CRITICAL: No stop_reason check — truncated JSON passes silently
 *   CR-002 HIGH:     Context truncation loses data between agents
 *   CR-003 HIGH:     Agents 9+10 prompts too large (~2400 tokens each)
 *   CR-004 MEDIUM:   No retry backoff — rate limits cause all 3 retries to fail
 *   CR-005 MEDIUM:   No per-agent elapsed timer
 *   CR-006 LOW:      API key visible in DevTools
 *   CR-007 LOW:      Single-file monolith (3000+ lines)
 *   CR-008 LOW:      Agents 11+12+13 not parallelized
 */
export const ISSUE_IDS = ['CR-001','CR-002','CR-003','CR-004','CR-005','CR-006','CR-007','CR-008'];
