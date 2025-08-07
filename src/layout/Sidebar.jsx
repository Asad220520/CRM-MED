import { NavLink, useNavigate } from "react-router-dom";
import { getCurrentUserRole } from "../lib/auth";
import { sidebarConfig } from "./sidebarConfig";

function Sidebar() {
  const role = getCurrentUserRole();
  const links = sidebarConfig[role] || [];
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login"); // или "/"
  };

  const topLinks = links.filter((link) => !link.isBottom);
  const bottomLinks = links.filter((link) => link.isBottom);

  const renderLink = ({ path, label, icon: Icon, action }) => {
    if (action === "logout") {
      return (
        <button
          key="logout"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-2 rounded hover:text-blue-500 hover:bg-blue-50 transition-colors text-gray-700"
        >
          {Icon && <Icon size={20} />}
          <span>{label}</span>
        </button>
      );
    }

    return (
      <li key={path}>
        <NavLink
          to={path}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded hover:text-blue-500 hover:bg-blue-50 transition-colors ${
              isActive
                ? "bg-blue-100 font-semibold text-blue-600"
                : "text-gray-700"
            }`
          }
        >
          {Icon && <Icon size={20} />}
          <span>{label}</span>
        </NavLink>
      </li>
    );
  };

  return (
    <aside className="w-64 sticky top-0 left-0 h-screen border-r border-gray-300 bg-white text-black p-6 flex flex-col justify-between">
      <div>
        <div className="flex flex-col items-center space-y-4 mb-6">
          <h2 className="text-2xl text-[#4B9CFB] font-bold">CRM - MED</h2>
        </div>

        <nav>
          <ul className="space-y-4">{topLinks.map(renderLink)}</ul>
        </nav>
      </div>

      {bottomLinks.length > 0 && (
        <nav className="border-t pt-4 mt-6">
          <ul className="space-y-4">{bottomLinks.map(renderLink)}</ul>
        </nav>
      )}
    </aside>
  );
}

export default Sidebar;
