import { ButtonHTMLAttributes, ReactNode } from "react";
import { cva, VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center transition-all duration-300 font-semibold uppercase tracking-[0.14em] rounded-none",
  {
    variants: {
      variant: {
        primary:
          "bg-black text-white hover:bg-neutral-800",
        secondary:
          "border border-black bg-transparent hover:bg-black hover:text-white",
      },
      size: {
        sm: "px-4 py-2 text-xs",
        md: "px-6 py-3 text-sm",
        lg: "px-8 py-4 text-sm",
      },
    },

    defaultVariants: {
      variant: "primary",
      size: "lg",
    },
  }
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    children: ReactNode;
  };

export function Button({
  children,
  variant,
  size,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${buttonVariants({
        variant,
        size,
      })} ${className ?? ""}`}
      {...props}
    >
      {children}
    </button>
  );
}