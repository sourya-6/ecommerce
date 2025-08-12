import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

function CartIcon() {
  const navigate = useNavigate();

  return (
    <div className="cursor-pointer relative" onClick={() => navigate("/cart")}>
      <ShoppingCart className="text-gray-700 hover:text-blue-600" size={28} />
      {/* Optional: badge for item count */}
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
        3 {/* replace with dynamic cart item count */}
      </span>
    </div>
  );
}

export default CartIcon;
