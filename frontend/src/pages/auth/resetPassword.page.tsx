import { FormField } from "@/components/my-compoents/FormField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { changePassowrdFormSchema } from "@/schemas/changePassword.schema";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import axios from "axios";
import { Spinner } from "@/components/ui/spinner";
import { useResetPassword } from "@/hooks/auth.hooks";

export const ResetPasswordPage = () => {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof changePassowrdFormSchema>>({
    resolver: zodResolver(changePassowrdFormSchema),
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });

  const { mutate, isPending } = useResetPassword();
  // on form submit
  const onSubmit = async (data: z.infer<typeof changePassowrdFormSchema>) => {
    const email = sessionStorage.getItem("reset-email");
    if (email) {
      const formData = {
        email: email,
        password: data.password,
        confirm_password: data.confirm_password,
      };
      mutate(formData, {
        onSuccess: () => {
          toast.success("Password reset success");
          navigate({
            to: "/login",
          });
          sessionStorage.removeItem("reset-email");
          form.reset();
        },
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            toast.error("Failed to reset password");
            form.reset();
          }
        },
      });
    }
  };

  const restEmail = sessionStorage.getItem("reset-email");

  if (!restEmail) {
    return navigate({
      to: "/login",
    });
  }

  return (
    <section className="px-4 h-screen w-screen flex justify-center items-center">
      <Card className="max-w-140 w-full">
        <CardHeader className="border-b">
          <CardTitle className="text-xl text-center">Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-2">
              {/* password */}
              <FormField
                control={form.control}
                name="password"
                type="password"
                label="Passowrd"
                disabled={isPending}
                required
              />

              {/* confirm password */}
              <FormField
                control={form.control}
                type="password"
                name="confirm_password"
                label="confirm_password"
                disabled={isPending}
                required
              />
            </FieldGroup>

            <div className="w-full mt-4">
              <Button
                className="w-full"
                size={"xl"}
                type="submit"
                disabled={isPending}
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <Spinner />
                    Reseting Password
                  </span>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};
