// =========================
// src/features/auth/LoginPage.jsx
// =========================
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

import API_BASE_URL from "../../../config/api";
import Button from "../../components/ui/Button";
import loginbg from "../../assets/loginbg.png";

import { setCredentials } from "../../redux/authSlice";
import { ROLES } from "../../lib/roles";
import { shapeUserFromBackend } from "./shapeUser";

function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const from = location.state?.from?.pathname;

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

      let data;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(
          data?.detail || data?.message || "Неверный логин или пароль"
        );
      }
      if (!data?.access || !data?.refresh || !data?.user) {
        throw new Error("Неверный формат ответа от сервера");
      }

      // 👇 нормализуем пользователя под фронт
      const shaped = shapeUserFromBackend(data.user);

      dispatch(
        setCredentials({
          user: shaped,
          access: data.access,
          refresh: data.refresh,
        })
      );

      // совместимость с кодом, который читает напрямую из localStorage
      if (shaped?.id != null) localStorage.setItem("id", String(shaped.id));
      if (shaped?.role) localStorage.setItem("role", shaped.role);
      if (shaped?.doctorId)
        localStorage.setItem("doctorId", String(shaped.doctorId));

      const fallback =
        shaped?.role === ROLES.DOCTOR ? "/calendar" : "/patients";
      navigate(from || fallback, { replace: true });
    } catch (err) {
      setError(err?.message || "Ошибка входа. Проверьте email и пароль.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Левая часть */}
      <div className="w-[45%] relative">
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
                  minLength: { value: 5, message: "Минимум 5 символов" },
                })}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPass((p) => !p)}
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

          <p
            onClick={() => navigate("/resetPassword")}
            className="text-blue-500 text-center mb-6 text-1xl cursor-pointer"
          >
            Забыли пароль!
          </p>

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
