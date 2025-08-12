import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, User, Star, Edit } from "lucide-react";

const Account = () => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const handleResetPassword = () => {
    navigate("/reset-password");
  };

  const handleEditProfile = () => {
    // This could navigate to an edit profile page or open a modal
    alert("This feature is not yet implemented.");
  };

  // Modern Skeleton Loader for a smooth loading experience
  if (!user) {
    return (
      <div className="flex justify-center mt-10 px-4">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border p-8 animate-pulse">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-4 text-center md:text-left mt-4 md:mt-0">
              <div className="h-8 bg-gray-200 rounded-lg w-3/4 mx-auto md:mx-0" />
              <div className="h-6 bg-gray-200 rounded-lg w-1/2 mx-auto md:mx-0" />
              <div className="mt-8 space-y-3">
                <div className="h-4 bg-gray-200 rounded-lg w-full" />
                <div className="h-4 bg-gray-200 rounded-lg w-full" />
                <div className="h-4 bg-gray-200 rounded-lg w-full" />
                <div className="h-4 bg-gray-200 rounded-lg w-full" />
              </div>
            </div>
          </div>
          <div className="mt-8 h-12 bg-gray-200 rounded-lg w-full" />
        </div>
      </div>
    );
  }

  // Helper for status badges
  const renderStatusBadge = (text, isPositive) => (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
        ${isPositive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
      `}
    >
      {isPositive && <Star size={14} className="mr-1" />}
      {text}
    </span>
  );

  return (
    <div className="flex justify-center mt-10 px-4">
      <div className="w-full max-w-2xl bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200 p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* User Avatar Section */}
          <div className="relative flex-shrink-0 group">
            <img
              src={user.avatar}
              alt="User Avatar"
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-gray-100 shadow-lg transition-transform duration-300 group-hover:scale-105"
            />
            <div
              onClick={handleEditProfile}
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
            >
              <Edit size={32} className="text-white" />
            </div>
          </div>

          {/* User Info Section */}
          <div className="flex-1 space-y-4 text-center md:text-left mt-4 md:mt-0">
            <div className="flex flex-col items-center md:items-start">
              <h2 className="text-3xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-lg text-gray-500 font-medium">@{user.username}</p>
              <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                {renderStatusBadge(user.role, user.role === "ADMIN")}
                {renderStatusBadge(
                  `SnapX Member: ${user.isSnapXMember ? "Yes" : "No"}`,
                  user.isSnapXMember
                )}
              </div>
            </div>

            <div className="space-y-4 mt-6">
              <a href={`mailto:${user.email}`} className="flex items-center space-x-4 text-gray-700 hover:text-blue-600 transition-colors">
                <Mail size={22} className="text-gray-400" />
                <p className="text-lg">{user.email}</p>
              </a>
              <a href={`tel:${user.phoneNumber}`} className="flex items-center space-x-4 text-gray-700 hover:text-blue-600 transition-colors">
                <Phone size={22} className="text-gray-400" />
                <p className="text-lg">{user.phoneNumber}</p>
              </a>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
          <button
            onClick={handleEditProfile}
            className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-xl font-semibold text-lg hover:bg-gray-300 transition-all duration-300 transform hover:-translate-y-1"
          >
            Edit Profile
          </button>
          <button
            onClick={handleResetPassword}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1"
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;