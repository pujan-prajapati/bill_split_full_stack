import * as z from "zod";

export const groupCreateFormScheme = z.object({
  image: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "Maximum file size is 5 MB",
    })
    .optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string(),
});
