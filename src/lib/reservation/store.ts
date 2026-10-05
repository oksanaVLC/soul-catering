// Single source of truth for the state of /reserva. It holds ONLY the data entered and the
// status; the summary and the errors are always derived (they are not stored by hand).
import type {
  ContactDetails,
  GuestGroup,
  IsoDate,
  ReservationField,
  ReservationInput,
  ReservationStatus,
  ReservationSummary,
  ReservationValidationError,
  SubmitResult,
  Venue,
} from '../../types/reservation.ts';
import { calculateSummary } from './summary.ts';
import { validateField, validateReservation, type ValidationContext } from './validation.ts';
import { buildReservationRequest, submitReservationRequest, type SubmitFn } from './submit.ts';

export interface ReservationState {
  input: ReservationInput;
  status: ReservationStatus;
  /** Errors from the last finishing attempt (they are updated while correcting). */
  errors: ReservationValidationError[];
  result: SubmitResult | null;
}

export type Listener = (state: ReservationState, summary: ReservationSummary) => void;

export interface StoreOptions extends ValidationContext {
  initial: ReservationInput;
  submit?: SubmitFn;
}

const clone = (input: ReservationInput): ReservationInput => structuredClone(input);

export function createReservationStore(options: StoreOptions) {
  const { initial, submit = submitReservationRequest, ...ctx } = options;
  let state: ReservationState = { input: clone(initial), status: 'editing', errors: [], result: null };
  const listeners = new Set<Listener>();

  const summary = () => calculateSummary(state.input, ctx.catalog, ctx.config);
  const emit = () => {
    const current = summary();
    listeners.forEach((listener) => listener(state, current));
  };
  const update = (change: (input: ReservationInput) => ReservationInput) => {
    const input = change(clone(state.input));
    // After a failed attempt, the error list is updated as the user corrects.
    const errors = state.status === 'invalid' ? validateReservation(input, ctx) : state.errors;
    state = { ...state, input, errors, status: state.status === 'invalid' && !errors.length ? 'editing' : state.status };
    emit();
  };
  const clampGuests = (n: number) =>
    Math.min(ctx.config.guestsMax, Math.max(ctx.config.guestsMin, Math.trunc(Number.isFinite(n) ? n : 0)));

  return {
    getState: () => state,
    getSummary: summary,
    subscribe(listener: Listener) {
      listeners.add(listener);
      listener(state, summary());
      return () => listeners.delete(listener);
    },

    selectMenu: (menuId: string) => update((i) => ({ ...i, menuId })),
    setGuests: (group: GuestGroup, value: number) =>
      update((i) => ({ ...i, guests: { ...i.guests, [group]: clampGuests(value) } })),
    changeGuests: (group: GuestGroup, delta: number) =>
      update((i) => ({ ...i, guests: { ...i.guests, [group]: clampGuests(i.guests[group] + delta) } })),
    selectDate: (date: IsoDate | null) => update((i) => ({ ...i, date })),
    setStartTime: (startTime: string) => update((i) => ({ ...i, startTime })),
    setEventType: (eventType: string) => update((i) => ({ ...i, eventType })),
    updateVenue: (patch: Partial<Venue>) => update((i) => ({ ...i, venue: { ...i.venue, ...patch } })),
    setExtra: (id: string, selected: boolean) =>
      update((i) => ({
        ...i,
        extraIds: selected ? [...new Set([...i.extraIds, id])] : i.extraIds.filter((x) => x !== id),
      })),
    updateContact: (patch: Partial<ContactDetails>) =>
      update((i) => ({ ...i, contact: { ...i.contact, ...patch } })),
    setAllergen: (id: string, selected: boolean) =>
      update((i) => ({
        ...i,
        allergenIds: selected ? [...new Set([...i.allergenIds, id])] : i.allergenIds.filter((x) => x !== id),
      })),
    setComments: (comments: string) => update((i) => ({ ...i, comments })),
    setAcceptsPolicies: (acceptsPolicies: boolean) => update((i) => ({ ...i, acceptsPolicies })),

    /** Validation of a field (on leaving it). Does not change the status. */
    validateField: (field: ReservationField) => validateField(state.input, field, ctx),

    /** Tries to send the request: validates everything; if there are errors, the status becomes «invalid». */
    async submit(): Promise<SubmitResult> {
      const errors = validateReservation(state.input, ctx);
      if (errors.length) {
        state = { ...state, status: 'invalid', errors };
        emit();
        return { ok: false, demo: true, reason: 'invalid' };
      }
      state = { ...state, status: 'submitting', errors: [] };
      emit();
      const result = await submit(buildReservationRequest(state.input));
      state = { ...state, status: result.ok ? 'request-received' : 'invalid', result };
      emit();
      return result;
    },

    /** Back to the form from the request-received screen (the data is kept). */
    backToEditing() {
      state = { ...state, status: 'editing', result: null };
      emit();
    },
  };
}

export type ReservationStore = ReturnType<typeof createReservationStore>;
