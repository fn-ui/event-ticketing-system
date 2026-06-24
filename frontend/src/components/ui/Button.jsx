function Button({
  children,
  type = "button",
  onClick,
  disabled = false,
  className = "",
  variant = "primary",
}) {
  const baseStyles =
    "flex items-center justify-center rounded-2xl px-6 py-4 text-sm font-semibold transition duration-300";

  const variants = {
    primary:
      "bg-violet-700 text-white hover:bg-violet-800",

    secondary:
      "border border-gray-300 bg-white text-gray-800 hover:bg-gray-100",

    danger:
      "bg-red-600 text-white hover:bg-red-700",

    success:
      "bg-green-600 text-white hover:bg-green-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${
        variants[variant]
      } ${
        disabled
          ? "cursor-not-allowed opacity-50"
          : ""
      } ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;