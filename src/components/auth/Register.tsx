import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  RegisterValidationSchemaType,
} from "../../schema/registerSchema";
import { supabase } from "../../utils/supabaseClient";
import toast from "react-hot-toast";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { AiOutlineUserAdd } from "react-icons/ai";

const usernameExistsToast = () => toast.error("Username already exists.");

export const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValidationSchemaType>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<RegisterValidationSchemaType> = async ({
    email,
    password,
    username,
  }) => {
    const usernameQuery = await supabase
      .from("users")
      .select("username")
      .eq("username", username)
      .limit(1);

    if (!usernameQuery.data || usernameQuery.data.length > 0) {
      usernameExistsToast();
      return;
    }

    const response = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username, full_name: username } },
    });

    if (response.error && response.error.status === 429) {
      return toast.error("Please try again later.");
    }

    if (response.error) {
      return toast.error(response.error.message);
    }
  };

  return (
    <div>
      <p>register</p>
      <form
        className="flex w-64 flex-col gap-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          type="text"
          placeholder="username"
          error={!!errors.username}
          message={errors.username?.message}
          {...register("username")}
        />
        <Input
          type="email"
          placeholder="email"
          error={!!errors.email}
          message={errors.email?.message}
          autoComplete="off"
          {...register("email")}
        />
        <Input
          type="password"
          placeholder="password"
          error={!!errors.password}
          message={errors.password?.message}
          {...register("password")}
        />
        <Input
          type="password"
          placeholder="verify password"
          error={!!errors.verifyPassword}
          message={errors.verifyPassword?.message}
          {...register("verifyPassword")}
        />
        <Button type="submit">
          <AiOutlineUserAdd />
          Sign In
        </Button>
      </form>
    </div>
  );
};
