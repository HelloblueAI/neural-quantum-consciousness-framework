/**
 * UUID v4 helper using runtime crypto (Works in Node, Cloudflare Workers, browsers).
 * Use this instead of the 'uuid' package in Worker code paths to avoid bundle resolution issues.
 */
export function uuidv4(): string {
  return crypto.randomUUID();
}
