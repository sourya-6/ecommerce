import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { resetPassword } from "../store/slices/userSlice";
import { useNavigate, useLocation } from "react-router-dom";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    resetOTP: "",
    newPassword: "",
    confirmPassword: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from query params or location state
  const email =
    new URLSearchParams(location.search).get("email") ||
    location.state?.email ||
    "";

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const payload = {
      email,
      resetOTP: formData.resetOTP,
      newPassword: formData.newPassword,
    };

    const res = await dispatch(resetPassword(payload));
    if (res?.payload?.status === 200) {
      navigate("/login");
    }
  };

  return (
    <div className="flex justify-center mt-20 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-xl shadow-md space-y-4"
      >
        <h2 className="text-xl font-semibold text-center">Reset Password</h2>

        <input
          type="text"
          name="resetOTP"
          placeholder="Enter OTP"
          value={formData.resetOTP}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded-lg"
        />

        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={formData.newPassword}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded-lg"
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm New Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded-lg"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
