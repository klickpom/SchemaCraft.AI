/** Stable id for the dry-run session. The same email returns the same id in this browser. */
export function idFromEmail(email: string): string {
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  const value = email.trim().toLowerCase();
  for (let i = 0; i < value.length; i += 1) {
    h1 = Math.imul(h1 ^ value.charCodeAt(i), 0x01000193);
    h2 = Math.imul(h2 ^ value.charCodeAt(i), 0x85ebca6b);
  }
  const hex = (n: number) => (n >>> 0).toString(16).padStart(8, '0');
  const raw = `${hex(h1)}${hex(h2)}${hex(h1 ^ h2)}${hex(h2 ^ h1 ^ 0xabcdef01)}`;
  return `${raw.slice(0, 8)}-${raw.slice(8, 12)}-4${raw.slice(13, 16)}-a${raw.slice(17, 20)}-${raw.slice(20, 32)}`;
}
