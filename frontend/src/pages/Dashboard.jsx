// src/pages/Dashboard.jsx
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user"); // Optional if you're storing auth state in Redux
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold">Welcome to SnapBuy Dashboard</h1>
      <p className="mt-4 text-gray-600">Manage your account and explore features.</p>
      <button
        className="mt-6 p-2 text-white bg-red-600 rounded hover:bg-red-700"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
