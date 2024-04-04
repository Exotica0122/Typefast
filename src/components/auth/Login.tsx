import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  LoginValidationSchemaType,
} from "../../schema/loginSchema";
import { supabase } from "../../utils/supabaseClient";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Input } from "../ui/Input";
import { useState } from "react";
import { LoadingSpinner } from "../LoadingSpinner";
import { Button } from "../ui/Button";
import { FiLogIn } from "react-icons/fi";

export const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValidationSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginValidationSchemaType> = async ({
    email,
    password,
  }) => {
    setIsLoading(true);

    const response = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (response.error) {
      setIsLoading(false);
      return toast.error(response.error.message);
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-end justify-between">
        <p>login</p>
        <p className="text-sm text-neutral-500">Forgot password?</p>
      </div>
      <form
        className="flex w-64 flex-col gap-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          type="email"
          placeholder="email"
          error={!!errors.email}
          message={errors.email?.message}
          {...register("email")}
        />
        <Input
          type="password"
          placeholder="password"
          error={!!errors.password}
          message={errors.password?.message}
          {...register("password")}
        />
        {!isLoading ? (
          <Button type="submit">
            <FiLogIn />
            Sign In
          </Button>
        ) : (
          <LoadingSpinner className="self-center" />
        )}
      </form>
    </div>
  );
};
