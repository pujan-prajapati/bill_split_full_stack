import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import "./index.css";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/auth.context";

const queryClient = new QueryClient();

// Create a new router instance
const router = createRouter({ routeTree, context: { queryClient } });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster
            position="bottom-right"
            toastOptions={{
              classNames: {
                success: "bg-green-600! text-white! ",
                error: "bg-red-600! text-white! ",
              },
            }}
          />
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}
