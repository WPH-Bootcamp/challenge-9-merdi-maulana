import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/features/store";
import { logoutUser } from "@/features/auth/authSlice";
import defaultAvatar from "@/assets/defaultAvatar.png";

export function AvatarDropdown() {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full flex gap-2">
          <Avatar>
            <AvatarImage src={user?.avatar || defaultAvatar} alt={user?.name} />
            <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="font-medium text-sm">{user?.name || "Tamu"}</p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-49 p-4 gap-1.5 flex flex-col mr-3">
        <DropdownMenuGroup
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Avatar>
            <AvatarImage src={user?.avatar || defaultAvatar} />
            <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{user?.name || "Tamu"}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Delivery Address</DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/my-order")}>
            My Orders
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
