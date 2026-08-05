import { ForgotPasswordPage } from "@/pages/auth/forgotPassword.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/forgot-password")({
  component: ForgotPasswordPage,
});
