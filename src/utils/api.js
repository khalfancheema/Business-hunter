/**
 * LLM API wrapper for browser-based agent calls.
 * Production calls go through /api/llm so provider keys stay server-side.
 *
 * Usage:
 *   import { callClaude } from './api.js';
 *   const result = await callClaude(null, systemPrompt, userPrompt, useWebSearch);
 */

const MODEL = 'claude-sonnet-4-6';

/**
 * Call the server-side LLM proxy from a browser context.
 * @param {string|null} apiKey - Deprecated. Kept for backward compatibility.
 * @param {string} system - System prompt defining the agent role
 * @param {string} user - User message / task prompt
 * @param {boolean} useWebSearch - Whether to enable the web_search tool
 * @returns {Promise<string>} - The text content of Claude's response
 */
export async function callClaude(apiKey, system, user, useWebSearch = false) {
  const res = await fetch('/api/llm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      provider: 'anthropic',
      model: MODEL,
      system,
      user,
      opts: { webSearch: useWebSearch },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP ${res.status}`);
  }

  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.text || '';
}

/**
 * Safely parse JSON from a Claude response.
 * Handles markdown code fences (```json ... ```) automatically.
 * @param {string} text - Raw Claude response text
 * @returns {object|null} - Parsed object or null on failure
 */
export function parseJSON(text) {
  try {
    const fenced = text.match(/```json\s*([\s\S]*?)```/);
    return JSON.parse(fenced ? fenced[1] : text);
  } catch {
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }
}
