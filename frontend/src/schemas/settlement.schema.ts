import * as z from "zod";

export const settlementFormSchema = z.object({
  amount: z
    .number({
      error: "Amount is required",
    })
    .positive("Amount must be greater than 0"),
});
