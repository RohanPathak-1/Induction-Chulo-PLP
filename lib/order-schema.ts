import { z } from "zod";

export const orderSchema = z.object({
  fullName: z.string().trim().min(2, "पूरा नाम आवश्यक छ।").max(100),
  phone: z.string().trim().regex(/^(?:\+977[-\s]?)?9[78]\d{8}$/, "कृपया मान्य नेपाली मोबाइल नम्बर लेख्नुहोस्।"),
  email: z.string().trim().email("कृपया मान्य इमेल ठेगाना लेख्नुहोस्।").max(160),
  province: z.string().trim().min(2, "प्रदेश छान्नुहोस्।").max(80),
  district: z.string().trim().min(2, "जिल्ला आवश्यक छ।").max(80),
  city: z.string().trim().min(2, "नगरपालिका वा सहर आवश्यक छ।").max(100),
  address: z.string().trim().min(6, "कृपया पूरा डेलिभरी ठेगाना लेख्नुहोस्।").max(300),
  deliveryZone: z.enum(["inside", "outside"], { message: "डेलिभरी क्षेत्र छान्नुहोस्।" }),
  quantity: z.coerce.number().int().min(1).max(10),
  productName: z.string().trim().min(2),
  paymentMethod: z.literal("Cash On Delivery"),
  notes: z.string().trim().max(300).optional().default(""),
  website: z.string().max(0).optional().default(""),
});

export type OrderInput = z.infer<typeof orderSchema>;
