import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import ProfileMenu from "./Profile";

function Header() {
  return (
    <nav className="bg-white shadow-md flex items-center px-6 justify-between border-b border-gray-200" style={{ height: "7vh" }}>
      {/* Logo Section */}
      <div className="w-[10%] text-2xl font-bold text-blue-600 hover:text-blue-700 transition-all">
        <Link to="/">SnapBuy</Link>
      </div>

      {/* Search Bar Section */}
      <div className="w-[30%] md:w-[50%]">
        <SearchBar />
      </div>

      {/* Profile & Orders Section */}
      <div className="w-[20%] flex items-center justify-end space-x-6">
        <Link to="/orders" className="text-gray-700 font-semibold hover:text-blue-600 transition-all">
          Orders
        </Link>
        <ProfileMenu />
      </div>
    </nav>
  );
}

export default Header;
