import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "@/context/auth.context";
import { useChangeAvatar } from "@/hooks/useChangeAvatar";
import { changeAvatarFormSchema } from "@/schemas/changeAvatar.schema";

interface UserChangeAvatarProps {
  openForm: "avatar" | "password" | null;
  setOpenForm: (value: "avatar" | "password" | null) => void;
}

export const UserChangeAvatarForm = ({
  openForm,
  setOpenForm,
}: UserChangeAvatarProps) => {
  const form = useForm<z.infer<typeof changeAvatarFormSchema>>({
    resolver: zodResolver(changeAvatarFormSchema),
  });

  const { refreshUser } = useAuth();

  const { mutate, isPending } = useChangeAvatar();

  // on submit form
  function onSubmit(data: z.infer<typeof changeAvatarFormSchema>) {
    mutate(data.avatar, {
      onSuccess: () => {
        refreshUser();
        toast.success("Avatar updated success");
        form.reset();
        setOpenForm(null);
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          toast.error(error?.response?.data);
          form.reset();
        }
      },
    });
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn(
        "space-y-2 w-full",
        openForm === "avatar" ? "block" : "hidden",
      )}
    >
      <Controller
        name="avatar"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="avatar">Avatar</FieldLabel>
            <Input
              type="file"
              ref={field.ref}
              id="avatar"
              accept="image/*"
              name="avatar"
              disabled={isPending}
              onBlur={field.onBlur}
              onChange={(e) => {
                field.onChange(e.target.files?.[0]);
              }}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <div className="flex gap-1 items-center mt-3">
        <Button type="submit" disabled={isPending} size={"lg"}>
          Change Avatar
        </Button>

        <Button
          type="button"
          variant={"secondary"}
          size={"lg"}
          onClick={() => {
            form.reset();
            setOpenForm(null);
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};
