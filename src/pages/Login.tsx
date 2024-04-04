import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { Register } from "../components/auth/Register";
import { SignIn } from "../components/auth/Login";

const Login = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      navigate("/account");
    }
  }, [session]);

  return (
    <div className="flex gap-48">
      <Register />
      <SignIn />
    </div>
  );
};

export default Login;
