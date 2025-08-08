import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import API_BASE_URL from "../../../config/api";
import Button from "../../components/ui/Button";
import loginbg from "../../assets/loginbg.png";

function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Куда редиректить после логина (либо на предыдущую страницу, либо /patients)
  const from = location.state?.from?.pathname || "/patients";

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

      if (!data.access || !data.refresh || !data.user) {
        throw new Error("Неверный формат ответа от сервера");
      }

      // Сохраняем токены
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      // Берём роль из ответа бэка
      const role = (data.user.role || data.user.username || "").toLowerCase();
      localStorage.setItem("role", role);

      // Редиректим
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Ошибка входа. Проверьте email и пароль.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Левая часть */}
      <div className="w-[40%] relative">
        <img
          src={loginbg}
          alt="login background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Добро пожаловать!
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Войдите в систему, чтобы управлять записями, пациентами и процессами
            клиники.
          </p>
        </div>
      </div>

      {/* Пробел */}
      <div style={{ width: "40px" }} />

      {/* Правая часть */}
      <div className="w-[45%] flex items-center justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-[40vw] max-w-[700px] p-8"
        >
          <h2 className="text-4xl font-bold mb-10 text-center">
            Войти в систему
          </h2>

          {/* Email */}
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-600">
              Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Введите email"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none transition ${
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
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Пароль */}
          <div className="mb-8">
            <label className="block mb-2 font-medium text-gray-600">
              Пароль
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPass ? "text" : "password"}
                placeholder="Введите пароль"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none transition ${
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

          {/* Ошибка */}
          {error && (
            <p className="text-red-500 text-center mb-6 text-sm">{error}</p>
          )}

          {/* Кнопка */}
          <Button
            type="submit"
            variant="primary"
            disabled={!isValid || loading}
            className="w-full py-3 text-lg rounded-lg"
            isLoading={loading}
          >
            {loading ? "Вход..." : "Войти"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
