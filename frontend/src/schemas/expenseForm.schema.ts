import * as z from "zod";

const numericString = z
  .string()
  .optional()
  .transform((val) => (val === "" || val == null ? "0" : val));

const positiveNumericString = z
  .string()
  .min(1, "Amount is required")
  .refine((val) => Number(val) >= 0, "Amount cannot be negative");

export const expenseFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: positiveNumericString,
  expense_category: z.coerce.number().min(1, "Expense category is required"),
  payer: z.coerce.number().min(1, "Payer is required"),
  split_type: z.enum(["equal", "exact", "percentage"]),
  participants: z.array(
    z.object({
      user: z.number(),
      share_amount: numericString,
      percentage: numericString,
    }),
  ),
});
