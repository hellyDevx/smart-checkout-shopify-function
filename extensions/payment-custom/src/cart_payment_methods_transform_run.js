// @ts-check

/**
 * @typedef {import("../generated/api").Input} Input
 * @typedef {import("../generated/api").Operation} Operation
 */

/**
 * @type {{ operations: Operation[] }}
 */
const NO_CHANGES = {
  operations: [],
};

/**
 * @param {Input} input
 * @returns {{ operations: Operation[] }}
 */
export function cartPaymentMethodsTransformRun(input) {
  // Get the selected shipping option title
  const deliveryGroups = input.cart?.deliveryGroups || [];
  const group = deliveryGroups[0];
  const selectedShipping = group?.selectedDeliveryOption;
  const selectedShippingTitle = selectedShipping?.title?.toLowerCase().trim() || "";

  // Use the correct paymentMethods array from input
  const paymentMethods = input.paymentMethods || [];

  /** @type {Operation[]} */
  const operations = [];

  // Hide COD if Standard shipping is selected
  if (selectedShippingTitle.includes("standard")) {
    paymentMethods.forEach(method => {
      if (method.name && method.name.toLowerCase().includes("cash on delivery")) {
        operations.push({ paymentMethodHide: { paymentMethodId: method.id } });
      }
    });
  }

  // Hide all payment methods except Cash on Delivery (COD) if Cash on Delivery shipping is selected
  const codVariants = ["cash on delivery", "cod"];
  if (codVariants.some(v => selectedShippingTitle.includes(v))) {
    paymentMethods.forEach(method => {
      if (!(method.name && method.name.toLowerCase().includes("cash on delivery"))) {
        operations.push({ paymentMethodHide: { paymentMethodId: method.id } });
      }
    });
  }

  return { operations };
}