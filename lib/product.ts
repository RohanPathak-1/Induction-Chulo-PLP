export const PRODUCT = {
  name: "Induction Chulo – Modern Electric Cooking Solution",
  shortName: "Induction Chulo",
  unitPrice: 4000,
  regularPrice: 4500,
  savings: 500,
  currency: "NPR",
  brand: process.env.BRAND_NAME || "VoltMart Nepal",
} as const;

export const DELIVERY_FEES = {
  inside: 0,
  outside: 150,
} as const;

export type DeliveryZone = keyof typeof DELIVERY_FEES;

const nepaliDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

export const formatNpr = (amount: number, language: "en" | "ne" = "en") => {
  const formatted = new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace("NPR", "Rs.");
  if (language === "en") return formatted;
  return formatted.replace("Rs.", "रु.").replace(/\d/g, digit => nepaliDigits[Number(digit)]);
};

export const productImages = [
  { src: "/products/induction-hero.jpg", alt: "Induction cooker touch control panel" },
  { src: "/products/induction-top.jpg", alt: "Black induction cooker top view" },
  { src: "/products/induction-angle.jpg", alt: "Induction cooker angled product view" },
  { src: "/products/induction-double.png", alt: "Double-zone induction cooker" },
  { src: "/products/induction-lifestyle.jpg", alt: "Double cooking unit in a kitchen setup" },
];
