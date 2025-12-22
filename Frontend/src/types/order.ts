import type { CartItem } from "./cart";

export type PaymentMethod = "cod" | "bank" | "momo";

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  note?: string;
}

export interface OrderDraft {
  items: CartItem[];
  shipping: ShippingAddress;
  paymentMethod: PaymentMethod;
  totals: {
    subtotal: number;
    shippingFee: number;
    discount: number;
    total: number;
  };
}
