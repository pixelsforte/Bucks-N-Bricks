/**
 * Escape regex special characters so user input is treated as plain text.
 */
export const escapeRegex = (value) =>
  String(value ?? '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Build a safe, case-insensitive RegExp for Mongo search queries.
 */
export const safeSearchRegex = (value) =>
  new RegExp(escapeRegex(String(value ?? '').trim()), 'i');

export default safeSearchRegex;
