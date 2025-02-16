import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ProfileMenu() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/v1/user/profile", {
          method: "GET",
          credentials: "include", // Important for cookies/session-based auth
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }

        const data = await response.json();
        setUser(data.user); // Assuming response structure is { user: { name: "John Doe", email: "john@example.com" } }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="relative group">
      <button className="text-gray-700 font-semibold hover:underline">Profile</button>
      <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-4 hidden group-hover:block">
        {user ? (
          <p className="text-gray-800">Welcome, {user.name}</p>
        ) : (
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        )}
      </div>
    </div>
  );
}

export default ProfileMenu;
