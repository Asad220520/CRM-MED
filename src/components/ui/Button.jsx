import * as Icons from "react-icons/fi";
import { FiLoader } from "react-icons/fi";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary", // primary | outline
  disabled = false,
  loading = false,
  size = "md", // sm | md | lg
  startIcon,
  endIcon,
  className = "",
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-[50px] transition focus:outline-none";

  const sizeStyles = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-4 py-2",
    lg: "text-lg px-5 py-3",
  };

  const variants = {
    primary: "bg-[#267CDC] text-white hover:bg-[#1a5bbd]",
    outline:
      "bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50",
  };

  const disabledStyles = "bg-gray-300 text-white cursor-not-allowed";
  const isDisabled = disabled || loading;

  // 🔄 Если передали строку (например: "FiUser") — пробуем достать иконку из Icons
  const StartIcon =
    typeof startIcon === "string" ? Icons[startIcon] : startIcon;
  const EndIcon = typeof endIcon === "string" ? Icons[endIcon] : endIcon;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`${baseStyles} ${sizeStyles[size]} ${
        isDisabled ? disabledStyles : variants[variant]
      } ${className}`}
    >
      {loading ? (
        <FiLoader className="animate-spin mr-2" size={18} />
      ) : (
        StartIcon && <StartIcon className="mr-2" size={18} />
      )}

      {children}

      {EndIcon && !loading && <EndIcon className="ml-2" size={18} />}
    </button>
  );
}
