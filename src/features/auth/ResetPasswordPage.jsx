import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import Button from "../../components/ui/Button";
import API_BASE_URL from "../../../config/api";
import loginbg from "../../assets/loginbg.png";

function ResetPasswordPage() {
  const [step, setStep] = useState(1); // 1 - email, 2 - code + new password
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  // ---------------- Step 1: Отправка email ----------------
  const handleEmailSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/en/password_reset/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      const resData = await res.json();
      if (!res.ok)
        throw new Error(resData.email?.[0] || "Ошибка отправки email");

      setEmail(data.email);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Step 2: Сброс пароля ----------------
  const handleResetSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${API_BASE_URL}/en/password_reset/verify_code/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            reset_code: data.reset_code,
            new_password: data.new_password,
          }),
        }
      );

      const resData = await res.json();
      if (!res.ok)
        throw new Error(
          resData.reset_code?.[0] ||
            resData.new_password?.[0] ||
            resData.email?.[0] ||
            "Ошибка сброса пароля"
        );

      alert("Пароль успешно сброшен! Теперь можно войти в систему.");
      window.location.href = "/login";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Левая часть */}
      <div className="w-[45%] relative">
        <img src={loginbg} alt="bg" className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {step === 1 ? "Сброс пароля" : "Новый пароль"}
          </h1>
          <p className="text-lg md:text-xl mb-8">
            {step === 1
              ? "Введите email для получения кода сброса пароля."
              : `На почту ${email} отправлен код подтверждения`}
          </p>
        </div>
      </div>

      <div style={{ width: "40px" }} />

      {/* Правая часть */}
      <div className="w-[45%] flex items-center justify-center">
        <form
          onSubmit={handleSubmit(
            step === 1 ? handleEmailSubmit : handleResetSubmit
          )}
          className="w-[40vw] max-w-[700px] p-8 space-y-6"
        >
          {step === 1 && (
            <div className="">
              <label className="block mb-2 font-medium text-gray-600">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Введите email"
                  {...register("email", {
                    required: "Email обязателен",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Некорректный email",
                    },
                  })}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none transition ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          )}

          {step === 2 && (
            <>
              <div className="mb-3 relative">
                <label className="block mb-2 font-medium text-gray-600">
                  Код подтверждения
                </label>
                <input
                  type="text"
                  placeholder="Введите код"
                  {...register("reset_code", { required: "Код обязателен" })}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none transition border-gray-300  `}
                />
                {errors.reset_code && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.reset_code.message}
                  </p>
                )}
              </div>

              <div className="">
                <label className="block mb-2 font-medium text-gray-600">
                  Введите новый пароль
                </label>
                <div className=" relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Введите новый пароль"
                    {...register("new_password", {
                      required: "Пароль обязателен",
                      minLength: { value: 5, message: "Минимум 5 символов" },
                    })}
                    className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none ${
                      errors.new_password ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPass((prev) => !prev)}
                  >
                    {showPass ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
                {errors.new_password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.new_password.message}
                  </p>
                )}
              </div>
            </>
          )}

          {error && <p className="text-red-500 text-center">{error}</p>}

          <Button
            type="submit"
            variant="primary"
            disabled={!isValid || loading}
            className="w-full py-3"
          >
            {loading
              ? "Загрузка..."
              : step === 1
              ? "Отправить код"
              : "Сбросить пароль"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
