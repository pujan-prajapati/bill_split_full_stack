import * as z from "zod";

export const changePassowrdFormSchema = z
  .object({
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
