export const ORDER_CONFIRMATION_STORAGE_KEY = "voltmart-order-confirmation";

export type OrderConfirmation = {
  orderId: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  quantity: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  province: string;
  district: string;
  city: string;
  address: string;
  notificationWarning: boolean;
};

export function saveOrderConfirmation(order: OrderConfirmation) {
  window.sessionStorage.setItem(ORDER_CONFIRMATION_STORAGE_KEY, JSON.stringify(order));
}

export function readOrderConfirmation(): OrderConfirmation | null {
  try {
    const raw = window.sessionStorage.getItem(ORDER_CONFIRMATION_STORAGE_KEY);
    if (!raw) return null;
    const order = JSON.parse(raw) as Partial<OrderConfirmation>;
    if (
      typeof order.orderId !== "string" || !order.orderId.startsWith("VM-") ||
      typeof order.customerName !== "string" || typeof order.customerEmail !== "string" ||
      typeof order.productName !== "string" || typeof order.quantity !== "number" ||
      typeof order.subtotal !== "number" || typeof order.deliveryFee !== "number" ||
      typeof order.total !== "number" || typeof order.province !== "string" ||
      typeof order.district !== "string" || typeof order.city !== "string" ||
      typeof order.address !== "string" || typeof order.notificationWarning !== "boolean"
    ) return null;
    return order as OrderConfirmation;
  } catch {
    return null;
  }
}
