import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { LeftSidebar } from "@/components/my-compoents/LeftSidebar";
import { Navbar } from "@/components/my-compoents/Navbar";
import { useAuth } from "@/context/auth.context";
import { Spinner } from "@/components/ui/spinner";

export const Route = createFileRoute("/(home)")({
  component: HomeLayout,
});

// eslint-disable-next-line react-refresh/only-export-components
function HomeLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinner />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <SidebarProvider>
        <LeftSidebar />
        <SidebarInset className="flex flex-col h-svh">
          <Navbar />

          <div className="flex flex-1 ">
            <div className="flex-1 p-4 lg:p-8">
              <Outlet />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
