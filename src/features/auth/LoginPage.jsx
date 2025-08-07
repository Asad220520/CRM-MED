import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import API_BASE_URL from "../../../config/api";
import Button from "../../components/ui/Button";

function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const onSubmit = async ({ email, password }) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/en/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || data.message || "Неверный логин или пароль"
        );
      }

      if (!data.access || !data.user?.username) {
        throw new Error("Неверный формат ответа от сервера");
      }

      const token = data.access;
      const role = data.user.username.toLowerCase();

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // Перенаправление по ролям
      const redirectPaths = {
        salahidin: "/patients",
        reception: "/patients",
        doctor: "/patients",
      };

      navigate(redirectPaths[role] || "/");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Ошибка входа. Проверьте email и пароль.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-4xl font-bold mb-10 text-center">
          Войти в систему
        </h2>

        {/* Email Field */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-500">Email</label>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Введите email"
              className={`w-full pl-10 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              {...register("email", {
                required: "Email обязателен",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Некорректный email",
                },
              })}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <label className="block mb-1 font-medium text-gray-500">Пароль</label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPass ? "text" : "password"}
              placeholder="Введите пароль"
              className={`w-full pl-10 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              {...register("password", {
                required: "Пароль обязателен",
                minLength: { value: 4, message: "Минимум 5 символов" },
              })}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPass((prev) => !prev)}
              aria-label={showPass ? "Скрыть пароль" : "Показать пароль"}
            >
              {showPass ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-center mb-4 text-sm">{error}</p>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          disabled={!isValid || loading}
          className="w-full py-2"
          isLoading={loading}
        >
          {loading ? "Вход..." : "Войти"}
        </Button>
      </form>
    </div>
  );
}

export default LoginPage;
