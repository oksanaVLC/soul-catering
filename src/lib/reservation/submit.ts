// Sending the booking request. DEMO: sends NOTHING (no fetch, no email, no payment).
//
// Approved future sequence: request received → email → deposit payment.
// The date will be locked when the deposit payment is received correctly.
// When there is a backend, only this function will be replaced; the request does not carry
// prices or availability: the server will have to recalculate and check everything.
import type { ReservationInput, ReservationRequest, SubmitResult } from '../../types/reservation.ts';

/** Builds the request from an ALREADY validated booking. */
export function buildReservationRequest(input: ReservationInput): ReservationRequest {
  if (input.menuId === null || input.date === null || !input.acceptsPolicies) {
    throw new Error('buildReservationRequest: the booking has not been validated');
  }
  return {
    menuId: input.menuId,
    guests: { ...input.guests },
    date: input.date,
    startTime: input.startTime,
    eventType: input.eventType,
    venue: {
      address: input.venue.address.trim(),
      city: input.venue.city.trim(),
      postalCode: input.venue.postalCode.trim(),
      space: input.venue.space,
    },
    extraIds: [...input.extraIds],
    contact: {
      name: input.contact.name.trim(),
      phone: input.contact.phone.trim(),
      email: input.contact.email.trim(),
      language: input.contact.language,
    },
    allergenIds: [...input.allergenIds],
    comments: input.comments.trim(),
    acceptsPolicies: true,
  };
}

export type SubmitFn = (request: ReservationRequest) => Promise<SubmitResult>;

/** DEMO: returns a controlled result without contacting any service. */
export const submitReservationRequest: SubmitFn = async (request) => ({
  ok: true,
  demo: true,
  status: 'request-received',
  reference: `DEMO-${request.date}`,
});
