import React from "react";
import { FaBell, FaCog, FaSadCry, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router";

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="h-16 bg-white border-b flex items-center justify-end px-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="p-2 rounded hover:bg-gray-100 text-gray-600"
          aria-label="Notifications"
        >
          <FaBell size={18} />
        </button>

        <button
          type="button"
          className="p-2 rounded hover:bg-gray-100 text-gray-600"
          aria-label="Setting"
          onClick={() => navigate("/admin-setting")}
        >
          <FaCog size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
