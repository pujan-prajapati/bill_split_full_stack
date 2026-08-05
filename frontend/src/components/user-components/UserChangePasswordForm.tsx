import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FieldGroup } from "../ui/field";
import { FormField } from "../my-compoents/FormField";
import * as z from "zod";
import { toast } from "sonner";
import { changePassowrdFormSchema } from "@/schemas/changePassword.schema";
import { useChangePassword } from "@/hooks/auth.hooks";

interface UserChangePasswordProps {
  openForm: "avatar" | "password" | null;
  setOpenForm: (value: "avatar" | "password" | null) => void;
}

export const UserChangePasswordForm = ({
  openForm,
  setOpenForm,
}: UserChangePasswordProps) => {
  const form = useForm<z.infer<typeof changePassowrdFormSchema>>({
    resolver: zodResolver(changePassowrdFormSchema),
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });

  const { mutate, isPending } = useChangePassword();

  // on submit form
  function onSubmit(data: z.infer<typeof changePassowrdFormSchema>) {
    mutate(data, {
      onSuccess: () => {
        toast.success("Password changed success");
      },
      onError: () => {
        toast.error("Password changed failed");
      },
    });
    form.reset();
    setOpenForm(null);
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn(
        "space-y-2 w-full",
        openForm === "password" ? "block" : "hidden",
      )}
    >
      <FieldGroup className="gap-2">
        {/* new password */}
        <FormField
          control={form.control}
          type="password"
          name="password"
          label="New Password"
          disabled={isPending ? true : false}
          required
        />

        {/* password */}
        <FormField
          control={form.control}
          name="confirm_password"
          type="password"
          label="Confirm Passowrd"
          disabled={isPending ? true : false}
          required
        />
      </FieldGroup>

      <div className="flex gap-1 items-center mt-3">
        <Button type="submit" size={"lg"} disabled={isPending}>
          {isPending ? "Changing Password" : "Change Password"}
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
