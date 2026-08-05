import { FormField } from "@/components/my-compoents/FormField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { verifyOtpFormSchema } from "@/schemas/verifyOpt.schema";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { useVerifyOtp } from "@/hooks/auth.hooks";

export const VerifyOptPage = () => {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof verifyOtpFormSchema>>({
    resolver: zodResolver(verifyOtpFormSchema),
    defaultValues: {
      otp: "",
    },
  });

  const { mutate, isPending } = useVerifyOtp();
  // on form submit
  const onSubmit = async (data: z.infer<typeof verifyOtpFormSchema>) => {
    const email = sessionStorage.getItem("reset-email");
    if (email) {
      const formData = {
        email: email,
        otp: data.otp,
      };
      mutate(formData, {
        onSuccess: () => {
          toast.success("Opt verified success");
          navigate({
            to: "/reset-password",
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
          <CardTitle className="text-xl text-center">Verify OTP</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* otp */}
            <FormField
              control={form.control}
              name="otp"
              label="Verify OPT"
              disabled={isPending ? true : false}
              required
            />

            <div className="w-full mt-4">
              <Button
                className="w-full"
                size={"xl"}
                type="submit"
                // disabled={isPending}
              >
                Verify
                {/* {isPending && <Spinner />} Send OTP */}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};
