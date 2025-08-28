import * as Icons from "react-icons/fi";
import { FiLoader } from "react-icons/fi";
import excel from "../../assets/excel.png";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary", // primary | outline | excel
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
    excel:
      "bg-transparent  text-[#0f693a]  border border-[#3bad4a] hover:bg-[#f0f0f0]", // зеленый для Excel
  };

  const disabledStyles = "bg-gray-300 text-white cursor-not-allowed";
  const isDisabled = disabled || loading;

  // Если передали строку — достаем иконку из react-icons
  const StartIcon =
    typeof startIcon === "string" ? Icons[startIcon] : startIcon;
  // Для Excel кнопки добавляем дефолтный endIcon
  const EndIcon =
    endIcon ||
    (variant === "excel" ? (
      <img src={excel} alt="Excel" className="w-8 " />
    ) : null);

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

      {EndIcon && !loading && <span className="ml-2">{EndIcon}</span>}
    </button>
  );
}
