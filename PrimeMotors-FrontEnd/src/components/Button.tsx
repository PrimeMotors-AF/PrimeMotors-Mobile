import type { InputProps } from "../types/types.tsx";

export default function Button({
  texto,
  onClick,
  className,
  children,
  type = "button",
}: InputProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        cursor-pointer
        px-4 py-2
        rounded-sm
        transition
        hover:bg-gray-700
        active:scale-100 
        ${className || ""}
      `}
    >
      {children || texto}
    </button>
  );
}
