import { FormField } from "@/components/my-compoents/FormField";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { loginFormSchema } from "@/schemas/login.schema";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/context/auth.context";
import axios from "axios";
import { useLogin } from "@/hooks/auth.hooks";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, refreshUser } = useAuth();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useLogin();

  // on form submit
  const onSubmit = async (data: z.infer<typeof loginFormSchema>) => {
    mutate(data, {
      onSuccess: (data) => {
        toast.success("Login Success");
        login(data.user, data.access_token);
        refreshUser();
        navigate({
          to: "/",
        });
        form.reset();
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          toast.error(error?.response?.data.message);
          form.reset();
        }
      },
    });
  };

  return (
    <section className="px-4 h-screen w-screen flex justify-center items-center">
      <Card className="max-w-140 w-full">
        <CardHeader className="border-b">
          <CardTitle className="text-xl text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-2">
              {/* email */}
              <FormField
                control={form.control}
                name="email"
                label="Email"
                disabled={isPending ? true : false}
                required
              />

              {/* password */}
              <FormField
                control={form.control}
                name="password"
                type="password"
                label="Passowrd"
                disabled={isPending ? true : false}
                required
              />
            </FieldGroup>

            <div className="float-end my-4">
              <Link
                to="/forgot-password"
                className="text-orange-600 hover:text-orange-500"
              >
                Forgot password?
              </Link>
            </div>

            <div className="w-full mt-4">
              <Button
                className="w-full"
                size={"xl"}
                type="submit"
                disabled={isPending}
              >
                {isPending && <Spinner />} Login
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col justify-center gap-4">
          <p>
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-orange-600 hover:text-orange-500"
            >
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </section>
  );
};
