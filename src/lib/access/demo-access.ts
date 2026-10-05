// DEMO access for managers.
//
// THERE IS NO REAL AUTHENTICATION: no credentials are checked, no sessions, cookies, tokens or
// users are created, and the password is not stored or sent anywhere. Only the form format is
// validated in the browser and the user is taken to the example panel.
// The panel is NOT protected: anyone can open /panel/invitados.
// When real authentication exists (PENDING DECISION: provider, roles and permissions), these
// functions will be replaced by calls to the server without changing the interface.
import { isValidEmail } from '../email.ts';

export type AccessField = 'email' | 'password' | 'name' | 'privacy';
export type AccessErrorCode = 'required' | 'invalid' | 'too-short';

export interface AccessError {
  field: AccessField;
  code: AccessErrorCode;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegistrationInput {
  name: string;
  email: string;
  password: string;
  acceptsPrivacy: boolean;
}

/** Minimum password length shown by the design («Mínimo 8 caracteres»). */
export const MIN_PASSWORD_LENGTH = 8;

/** The only destination of the demo access (the only approved panel page). */
export const DEMO_PANEL_PATH = '/panel/invitados';

function checkEmail(email: string, errors: AccessError[]) {
  if (email.trim() === '') errors.push({ field: 'email', code: 'required' });
  else if (!isValidEmail(email)) errors.push({ field: 'email', code: 'invalid' });
}

export function validateLogin(input: LoginInput): AccessError[] {
  const errors: AccessError[] = [];
  checkEmail(input.email, errors);
  if (input.password === '') errors.push({ field: 'password', code: 'required' });
  return errors;
}

export function validateRegistration(input: RegistrationInput): AccessError[] {
  const errors: AccessError[] = [];
  if (input.name.trim() === '') errors.push({ field: 'name', code: 'required' });
  checkEmail(input.email, errors);
  if (input.password === '') errors.push({ field: 'password', code: 'required' });
  else if (input.password.length < MIN_PASSWORD_LENGTH) errors.push({ field: 'password', code: 'too-short' });
  if (!input.acceptsPrivacy) errors.push({ field: 'privacy', code: 'required' });
  return errors;
}

export type DemoSignInResult =
  | { ok: true; demo: true; redirectTo: string }
  | { ok: false; demo: true; errors: AccessError[] };

/**
 * DEMO «Entrar»: if the format is valid, returns the panel path. It does not authenticate,
 * does not contact any service and keeps nothing (not the email or the password).
 */
export function demoSignIn(input: LoginInput, localize: (path: string) => string = (p) => p): DemoSignInResult {
  const errors = validateLogin(input);
  if (errors.length) return { ok: false, demo: true, errors };
  return { ok: true, demo: true, redirectTo: localize(DEMO_PANEL_PATH) };
}

/** DEMO «Crear cuenta»: validates only. No account is created. */
export function demoRegister(input: RegistrationInput): { ok: boolean; demo: true; errors: AccessError[] } {
  const errors = validateRegistration(input);
  return { ok: errors.length === 0, demo: true, errors };
}
