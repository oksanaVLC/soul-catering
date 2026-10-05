// Deliberately simple technical email format (the real check is that the email arrives).
// Shared by the booking validation and the demo access.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}
