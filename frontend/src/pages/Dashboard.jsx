// src/pages/Dashboard.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold">Welcome to SnapBuy Dashboard</h1>
      <p className="mt-4 text-gray-600">Manage your account and explore features.</p>
      <button
        className="mt-6 p-2 text-white bg-red-600 rounded hover:bg-red-700"
        onClick={() => {
          localStorage.removeItem("user");
          navigate("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
