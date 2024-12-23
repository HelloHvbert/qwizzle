import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  onClick,
  ...props
}: ButtonProps) {
  const baseStyles =
    "font-semibold rounded-lg transition-colors active:translate-y-px disabled:active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-offset-2 active:ring-offset-custom-primary inline-flex items-center justify-center";

  const variantStyles = {
    primary:
      "bg-primary text-custom-secondary hover:bg-primary_hover focus:ring-custom-primary",
    secondary:
      "bg-gray text-white hover:bg-light_gray focus:ring-custom-secondary",
    outline:
      "border border-custom-primary text-custom-primary hover:bg-custom-primary hover:text-custom-secondary focus:ring-custom-primary",
    danger: "bg-red text-white hover:opacity-80 focus:ring-custom-red",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <button className={combinedStyles} {...props} onClick={onClick}>
      {children}
    </button>
  );
}
