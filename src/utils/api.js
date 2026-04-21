/**
 * Anthropic API wrapper for browser-based agent calls.
 * Requires user to provide their API key in the UI.
 *
 * Usage:
 *   import { callClaude } from './api.js';
 *   const result = await callClaude(apiKey, systemPrompt, userPrompt, useWebSearch);
 */

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-6';
const MAX_TOKENS = 3000;

/**
 * Call the Anthropic API from a browser context.
 * @param {string} apiKey - Anthropic API key (sk-ant-...)
 * @param {string} system - System prompt defining the agent role
 * @param {string} user - User message / task prompt
 * @param {boolean} useWebSearch - Whether to enable the web_search tool
 * @returns {Promise<string>} - The text content of Claude's response
 */
export async function callClaude(apiKey, system, user, useWebSearch = false) {
  if (!apiKey) throw new Error('No API key provided.');

  const body = {
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system,
    messages: [{ role: 'user', content: user }],
  };

  if (useWebSearch) {
    body.tools = [{ type: 'web_search_20250305', name: 'web_search' }];
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP ${res.status}`);
  }

  const data = await res.json();
  if (data.error) throw new Error(data.error.message);

  // Extract text from all content blocks (handles tool use + text interleaved)
  return data.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n');
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
