// src/pages/WelcomePage.jsx
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";

function WelcomePage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="text-5xl font-bold mb-4 text-[#267CDC]">
        Онлайн CRM система
      </h1>
      <p className="text-2xl text-gray-600 mb-6">Для учета клиентов и сделок</p>
      <Button className="w-100" onClick={handleLogin}>Войти</Button>
    </div>
  );
}

export default WelcomePage;
