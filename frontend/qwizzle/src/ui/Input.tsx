import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  placeholder?: string;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}

export default function Input({
  label,
  error,
  className = "",
  placeholder = "",
  handleChange,
  value,
  ...props
}: InputProps) {
  const inputId =
    props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1 block text-sm font-medium text-primary"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        value={value}
        placeholder={`${!value && placeholder}`}
        className={`w-full rounded-md border-2 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary ${
          error ? "border-red" : "border-gray-300"
        } ${className}`}
        {...props}
        onChange={handleChange}
      />
      {error && <p className="mt-1 text-sm text-red">{error}</p>}
    </div>
  );
}
