import { forwardRef, HTMLInputTypeAttribute, LegacyRef } from "react";
import { cn } from "../../utils/cn";

export type InputProps = {
  id?: string;
  className?: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  message?: string;
  value?: string;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  label?: string;
  labelClassName?: string;
  fullWidth?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

export const Input = forwardRef(
  (
    {
      id,
      className,
      type = "text",
      placeholder,
      message,
      value,
      autoComplete,
      label,
      required = false,
      disabled = false,
      error = false,
      labelClassName,
      fullWidth,
      onChange,
      ...props
    }: InputProps,
    ref: LegacyRef<HTMLInputElement> | undefined,
  ) => {
    return (
      <div>
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "block text-sm font-medium text-white dark:text-gray-900",
              labelClassName,
            )}
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={id}
          data-testid={id}
          ref={ref}
          value={value}
          disabled={disabled}
          autoComplete={autoComplete}
          className={cn(
            "my-2 block w-full rounded-lg border-2 border-neutral-900 bg-neutral-900 p-2.5 text-sm text-white focus:border-black focus:ring-black",
            className,
            error && "border-red-600",
          )}
          placeholder={placeholder}
          required={required}
          onChange={onChange}
          {...props}
        />
        {message && (
          <span className={cn("text-xs", error && "text-red-600")}>
            {message}
          </span>
        )}
      </div>
    );
  },
);
