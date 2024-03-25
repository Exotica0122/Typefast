import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const NavbarWrapper = () => {
  return (
    <div className="py-8 px-12 min-h-screen items-center grid grid-rows-layout gap-8 w-full bg-gradient-to-b from-neutral-800 to-neutral-900">
      <NavBar />
      <main className="h-full flex items-center justify-center">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavbarWrapper />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
]);

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
