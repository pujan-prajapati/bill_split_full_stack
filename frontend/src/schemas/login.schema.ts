import * as z from "zod";

export const loginFormSchema = z.object({
  email: z.string().min(1, "Email is required!").email("Invalid email format"),
  password: z.string().min(1, "Password is required!"),
});
