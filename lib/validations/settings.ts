import { z } from "zod";

export const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name is too long"),
  phone: z
    .string()
    .min(5, "Phone number is too short")
    .max(20, "Phone number is too long")
    .regex(/^[\d\s\-\+]+$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  country: z.string().optional().or(z.literal("")),
  avatar: z.string().optional().or(z.literal("")),
});

export const emailSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  currentPassword: z.string().min(1, "Current password is required"),
});

export const pinSchema = z
  .object({
    pin: z
      .string()
      .length(6, "PIN must be exactly 6 digits")
      .regex(/^\d{6}$/, "PIN must contain only digits"),
    confirmPin: z
      .string()
      .length(6, "PIN must be exactly 6 digits")
      .regex(/^\d{6}$/, "PIN must contain only digits"),
  })
  .refine((data) => data.pin === data.confirmPin, {
    message: "PINs do not match",
    path: ["confirmPin"],
  });

export type ProfileInput = z.infer<typeof profileSchema>;
export type EmailInput = z.infer<typeof emailSchema>;
export type PinInput = z.infer<typeof pinSchema>;

