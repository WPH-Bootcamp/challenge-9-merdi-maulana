import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/features/store";
import Shopbag from "../../assets/Bag.svg";
import HomeIcon from "../../assets/Logo (1).svg";
import { AvatarDropdown } from "../uiCustom/Avatar";
import { Button } from "@/components/ui/button";
import { FaBagShopping } from "react-icons/fa6";

export function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 md:px-30 h-16 flex justify-between items-center bg-white">
      <div>
        <Link to="/" className="flex items-center gap-2">
          <img src={HomeIcon} alt="Foody Logo" />
          <p className="text-2xl hidden md:block font-extrabold text-black">
            Foody
          </p>
        </Link>
      </div>

      {isAuthenticated ? (
        // Logged in - Show cart and avatar
        <div className="flex gap-4 items-center">
          <Link to="/myCart">
            <FaBagShopping size={24} className="text-black mr-4" />
          </Link>
          <AvatarDropdown />
        </div>
      ) : (
        // Logged out - Show Sign In and Sign Up buttons
        <div className="flex gap-3 items-center">
          <Button
            variant="outline"
            onClick={() => navigate("/login")}
            className="rounded-full px-6 h-10 border-gray-300 hover:bg-gray-50"
          >
            Sign In
          </Button>
          <Button
            onClick={() => navigate("/login")}
            className="rounded-full px-6 h-10 bg-[#C12116] hover:bg-[#a01812]"
          >
            Sign Up
          </Button>
        </div>
      )}
    </header>
  );
}
