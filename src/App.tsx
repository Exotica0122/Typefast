import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import Login from "./pages/Login";
import Footer from "./components/Footer";
import { Account } from "./pages/Account";
import { useEffect } from "react";
import { supabase } from "./utils/supabaseClient";
import { useAuthStore } from "./store/useAuthStore";

const NavbarWrapper = () => {
  const updateSession = useAuthStore((state) => state.updateSession);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      updateSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      updateSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="grid min-h-screen w-full grid-rows-layout items-center gap-8 bg-neutral-800 py-8 px-12 text-white">
      <NavBar />
      <main className="flex h-full flex-col items-center justify-center">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

const ErrorPage = () => {
  return (
    <div className="grid min-h-screen w-full grid-rows-layout items-center gap-8 bg-neutral-800 py-8 px-12 text-white">
      <NavBar />
      <main className="flex h-full flex-col items-center justify-center">
        <h1 className="text-4xl text-yellow-300">404 not found</h1>
      </main>
      <Footer />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavbarWrapper />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/account",
        element: <Account />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
