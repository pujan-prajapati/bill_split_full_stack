import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { registerFormSchema } from "@/schemas/register.schema";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { FormField } from "@/components/my-compoents/FormField";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useRegister } from "../../hooks/auth.hooks.ts";
import { useAuth } from "@/context/auth.context";
import axios from "axios";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { login, refreshUser } = useAuth();

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const { mutate, isPending } = useRegister();

  // on form submit
  const onSubmit = (data: z.infer<typeof registerFormSchema>) => {
    mutate(data, {
      onSuccess: (data) => {
        toast.success("User Register succes");
        login(data.user, data.access_token);
        refreshUser();
        navigate({
          to: "/",
        });
        form.reset();
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          if (error?.response?.data.email) {
            toast.error(error?.response?.data.email[0]);
          }

          if (error?.response?.data.username) {
            toast.error(error?.response?.data.username[0]);
          }
          form.reset();
        }
      },
    });
  };

  return (
    <section className="px-4 h-screen w-screen flex justify-center items-center">
      {/* form */}
      <Card className="max-w-140 w-full">
        <CardHeader className="border-b">
          <CardTitle className="text-xl text-center">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-3">
              {/* Username */}
              <FormField
                control={form.control}
                label="Username"
                name="username"
                disabled={isPending ? true : false}
                required
              />

              {/* first name */}
              <FormField
                control={form.control}
                label="First Name"
                name="first_name"
                disabled={isPending ? true : false}
                required
              />

              {/* last name */}
              <FormField
                control={form.control}
                label="Last Name"
                name="last_name"
                disabled={isPending ? true : false}
                required
              />

              {/* email */}
              <FormField
                control={form.control}
                label="Email"
                name="email"
                disabled={isPending ? true : false}
                required
              />

              {/* password */}
              <FormField
                control={form.control}
                label="Password"
                name="password"
                type="password"
                disabled={isPending ? true : false}
                required
              />

              {/* confirm_password   */}
              <FormField
                control={form.control}
                label="Confirm Password"
                name="confirm_password"
                type="password"
                disabled={isPending ? true : false}
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
                {isPending && <Spinner />} Register
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col justify-center gap-4">
          <p>
            Already have account?{" "}
            <Link to="/login" className="text-orange-600">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </section>
  );
};
