import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/features/store";
import { MapPin, FileText, LogOut, User } from "lucide-react";
import { logoutUser } from "@/features/auth/authSlice";

interface ProfileSidebarProps {
  activePage: "profile" | "my-orders";
  user?: {
    name?: string;
    avatar?: string;
  } | null;
}

export default function ProfileSidebar({
  activePage,
  user,
}: ProfileSidebarProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const menuItems = [
    {
      icon: <MapPin size={20} />,
      label: "Delivery Address",
      onClick: () => alert("Fitur Delivery Address akan segera hadir!"),
      active: false,
    },
    {
      icon: <FileText size={20} />,
      label: "My Orders",
      onClick: () => navigate("/my-order"),
      active: activePage === "my-orders",
    },
    {
      icon: <LogOut size={20} />,
      label: "Logout",
      onClick: handleLogout,
      active: false,
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-3 pb-6 mb-6 border-b">
        <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user?.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={28} className="text-gray-400" />
          )}
        </div>
        <div>
          <p className="font-bold">{user?.name || "Loading..."}</p>
        </div>
      </div>

      <div className="space-y-2">
        {menuItems.map((menu, index) => (
          <button
            key={index}
            onClick={menu.onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              menu.active
                ? "bg-orange-50 text-[#C12116]"
                : "hover:bg-gray-50 text-gray-700"
            }`}
          >
            {menu.icon}
            <span className="font-medium">{menu.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
