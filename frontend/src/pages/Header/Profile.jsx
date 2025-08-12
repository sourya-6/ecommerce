import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { User, LogOut, LogIn, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../store/slices/userSlice";
// import defaultAvatar from "../../assets/defaultAvatar.png"; // Add a default image in assets

function ProfileMenu() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loadingAuth } = useSelector((state) => state.user);
  console.log("User Details",user)
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center space-x-2 rounded-full border px-2 py-1 hover:shadow-md transition-all">
          <img
            src={user?.avatar}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
          {!loadingAuth && isAuthenticated && (
            <span className="text-sm font-medium text-gray-700">{user.name}</span>
          )}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        className="min-w-[100px] bg-white shadow-xl rounded-md p-2 z-50 border border-gray-100"
        sideOffset={5}
      >
        {!loadingAuth && isAuthenticated && user ? (
          <>
            <div className="px-3 py-2 text-sm text-gray-600">
              <div className="font-medium">{user.name}</div>
              <div className="text-xs text-gray-500">{user.email}</div>
            </div>

            <DropdownMenu.Separator className="my-1 h-px bg-gray-200" />

            <DropdownMenu.Item asChild>
              <Link
                to="/account"
                className="flex items-center px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded space-x-2"
              >
                <Settings size={16} />
                <span>My Account</span>
              </Link>
            </DropdownMenu.Item>

            <DropdownMenu.Item
              onSelect={handleLogout}
              className="flex items-center px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded space-x-2 cursor-pointer"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </DropdownMenu.Item>
          </>
        ) : (
          <DropdownMenu.Item asChild>
            <Link
              to="/login"
              className="flex items-center px-2 py-1 text-sm text-blue-600 hover:underline space-x-2"
            >
              <LogIn size={16} />
              <span>Login</span>
            </Link>
          </DropdownMenu.Item>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

export default ProfileMenu;
