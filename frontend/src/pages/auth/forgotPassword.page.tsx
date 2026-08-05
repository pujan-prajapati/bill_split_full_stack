import { FormField } from "@/components/my-compoents/FormField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { sendOptFormSchema } from "@/schemas/sendOpt.schema";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "@tanstack/react-router";
import { Spinner } from "@/components/ui/spinner";
import { useForgotPassword } from "@/hooks/auth.hooks";

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof sendOptFormSchema>>({
    resolver: zodResolver(sendOptFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending } = useForgotPassword();

  // on form submit
  const onSubmit = async (data: z.infer<typeof sendOptFormSchema>) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("Opt sent to email");
        sessionStorage.setItem("reset-email", data.email);
        navigate({
          to: "/verify-opt",
        });
        form.reset();
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          toast.error(error?.response?.data.non_field_errors[0]);
          form.reset();
        }
      },
    });
  };

  return (
    <section className="px-4 h-screen w-screen flex justify-center items-center">
      <Card className="max-w-140 w-full">
        <CardHeader className="border-b">
          <CardTitle className="text-xl text-center">Forgot Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* email */}
            <FormField
              control={form.control}
              name="email"
              label="Email"
              disabled={isPending}
              required
            />

            <div className="w-full mt-4">
              <Button
                className="w-full"
                size={"xl"}
                type="submit"
                disabled={isPending}
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <Spinner /> Sending OTP
                  </span>
                ) : (
                  "Send OTP"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};
