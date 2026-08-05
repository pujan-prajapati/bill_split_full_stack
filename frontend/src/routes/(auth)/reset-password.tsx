import { ResetPasswordPage } from "@/pages/auth/resetPassword.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/reset-password")({
  component: ResetPasswordPage,
});
