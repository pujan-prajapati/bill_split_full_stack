import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/context/auth.context";
import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)")({
  component: RouteComponent,
});

// eslint-disable-next-line react-refresh/only-export-components
function RouteComponent() {
  const { loading, user } = useAuth();

  if (loading) {
    return <Spinner />;
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
