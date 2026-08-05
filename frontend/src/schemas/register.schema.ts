import * as z from "zod";

export const registerFormSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username can't be less than 3 characters")
      .max(15, "Username can't be more than 15 characters"),
    first_name: z
      .string()
      .min(3, "First name can't be less than 3 characters")
      .max(15, "First name can't be more than 15 characters"),
    last_name: z
      .string()
      .min(3, "Last name can't be less than 3 characters")
      .max(15, "Last name can't be more than 15 characters"),
    email: z
      .string()
      .min(1, "Email is required!")
      .email("Invalid email format"),
    password: z.string().min(1, "Password is required!"),
    confirm_password: z.string().min(1, "Confirm Password is required!"),
  })
  .superRefine(({ confirm_password, password }, ctx) => {
    if (confirm_password !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The password did not match",
        path: ["confirm_password"],
      });
    }
  });
