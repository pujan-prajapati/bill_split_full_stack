import { VerifyOptPage } from "@/pages/auth/verifyOpt.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/verify-opt")({
  component: VerifyOptPage,
});
