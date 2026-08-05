import * as z from "zod";

export const changeAvatarFormSchema = z.object({
  avatar: z
    .instanceof(File, {
      message: "Image is required",
    })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "Maximum file size is 5 MB",
    }),
});
