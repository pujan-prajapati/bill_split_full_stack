import { z } from "zod";

export const verifyOtpFormSchema = z.object({
  otp: z
    .string()
    .regex(/^\d{6}$/, "OTP must be exactly 6 digits")
    .min(6, "OTP must be exactly 6 digits"),
});
