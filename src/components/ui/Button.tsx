import { ReactNode } from "react";
import { cn } from "../../utils/cn";

export type ButtonProps = {
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
};

export const Button = ({ className, onClick, type, children }: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        "flex h-8 items-center justify-center gap-2 rounded-lg bg-neutral-900 transition hover:bg-neutral-300 hover:text-neutral-900",
        className,
      )}
    >
      {children}
    </button>
  );
};
