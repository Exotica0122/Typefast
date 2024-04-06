import { Register } from "../components/auth/Register";
import { SignIn } from "../components/auth/Login";

const Login = () => {
  return (
    <div className="flex gap-48">
      <Register />
      <SignIn />
    </div>
  );
};

export default Login;
