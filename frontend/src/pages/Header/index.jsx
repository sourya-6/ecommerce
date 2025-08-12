import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import ProfileMenu from "./Profile";
import { ShoppingCart, PackageCheck } from "lucide-react";
import CartIcon from "./Cart";


function Header() {
  return (
    <nav className="bg-white shadow-md px-6 py-3 border-b border-gray-200">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between space-x-6">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <Link
            to="/"
            className="text-3xl font-extrabold text-blue-600 hover:text-blue-700 tracking-wide"
          >
            {/* SnapBuy */}
            <img src="/logo.svg" alt="SnapBuy Logo" className="h-15 w-auto object-contain"/>
          </Link>
        </div>

        {/* Center: Search */}
        <div className="flex-grow mx-6">
          <SearchBar />
        </div>

        {/* Right: Cart, Orders, Profile */}
        <div className="flex items-center space-x-6">
          <CartIcon />
          <Link
            to="/orders"
            className="text-gray-700 hover:text-blue-600 font-medium flex items-center space-x-1"
          >
            <PackageCheck size={20} />
            <span>Orders</span>
          </Link>
          <ProfileMenu />
        </div>
      </div>
    </nav>
  );
}

export default Header;
