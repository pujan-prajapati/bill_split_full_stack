import { LoginPage } from "@/pages/auth/login.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/login")({
  component: LoginPage,
});
