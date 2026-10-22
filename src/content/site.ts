// Business settings for the landing page. Change values here, not in components.
// Everything marked "CONFIRM" is a commitment shown to buyers: the owner must confirm it before launch.

export const site = {
  name: "Mommy Plate",

  // Contact email shown on the error state of the signup form. Leave empty to hide it.
  contactEmail: "", // CONFIRM: e.g. "halo@namadomain.id"

  // Founding member pre-order.
  founding: {
    seats: 200, // CONFIRM
    price: 799_000, // CONFIRM
    // Payment link from Midtrans/Xendit. When empty, the pre-order button opens the waitlist form instead.
    paymentUrl: process.env.NEXT_PUBLIC_PREORDER_URL ?? "",
  },

  // Prices after launch.
  plus: {
    monthly: 149_000,
    yearly: 1_490_000,
  },

  // Beta date and refund promise. CONFIRM both before publishing the page.
  betaLabel: { id: "Maret 2027", en: "March 2027" },
  refundDeadline: { id: "30 April 2027", en: "30 April 2027" },
} as const;

export function rupiah(value: number): string {
  return "Rp" + value.toLocaleString("id-ID");
}
