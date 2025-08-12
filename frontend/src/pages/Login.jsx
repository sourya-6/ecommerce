import React, { useState, useEffect } from "react";
import { Mail, Lock, User, Eye, EyeOff, RefreshCcw } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../store/slices/userSlice";
import { useNavigate } from "react-router-dom";

// Reusable Input Component
const InputWithIcon = ({ Icon, type, name, placeholder, value, onChange, disabled }) => (
  <div className="relative">
    <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="pl-12 pr-4 py-3 w-full border border-gray-300 rounded-xl placeholder-gray-400 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
      required
    />
  </div>
);

// Reusable Password Input Component
const PasswordInput = ({ name, value, onChange, disabled, show, toggleShow }) => (
  <div className="relative">
    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
    <input
      type={show ? "text" : "password"}
      name={name}
      placeholder="Password"
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="pl-12 pr-12 py-3 w-full border border-gray-300 rounded-xl placeholder-gray-400 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
      required
    />
    <button
      type="button"
      onClick={toggleShow}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
      tabIndex={-1}
      aria-label={show ? "Hide password" : "Show password"}
    >
      {show ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  </div>
);

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  const handleLoginChange = (e) =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const handleRegisterChange = (e) =>
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(loginData));
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(registerData));
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    // Reset form data on flip
    setLoginData({ email: "", password: "" });
    setRegisterData({ name: "", username: "", email: "", password: "" });
    setShowPassword(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 font-inter">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden transform transition-all duration-500 hover:scale-105">
        {/* Left Branding Panel (Desktop Only) */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-blue-700 to-purple-800 p-10 text-white relative">
          <h1 className="text-4xl font-extrabold mb-4 tracking-wide drop-shadow-lg">
            Welcome to SnapBuy
          </h1>
          <p className="text-lg opacity-90 max-w-sm text-center">
            {isLogin
              ? "Log in to your account and discover amazing products."
              : "Create your account and unlock a world of shopping!"}
          </p>
          <div className="w-64 h-64 mt-8">
            <svg
              className="w-full h-full text-white opacity-70 drop-shadow-xl"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
        </div>

        {/* Right Form Container with Flip Animation */}
        <div className="p-8 md:p-12 relative h-full">
          <div className="absolute inset-0 transform transition-transform duration-700" style={{ transform: isLogin ? 'rotateY(0deg)' : 'rotateY(180deg)', transformStyle: 'preserve-3d' }}>
            
            {/* Login Form (Front) */}
            <div className="absolute inset-0 backface-hidden flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-center text-blue-600 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-500 text-center mb-8">
                Sign in to your account
              </p>
              {error && <p className="mb-6 text-center text-red-600 font-semibold">{error}</p>}
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <InputWithIcon
                  Icon={Mail}
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  disabled={loading}
                />
                <PasswordInput
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  disabled={loading}
                  show={showPassword}
                  toggleShow={() => setShowPassword(!showPassword)}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-xl text-white font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg ${
                    loading
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <RefreshCcw className="mr-2 h-5 w-5 animate-spin" />
                      Logging in...
                    </span>
                  ) : (
                    "Login"
                  )}
                </button>
              </form>
              <div className="mt-8 text-center text-gray-500">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={toggleForm}
                  className="text-blue-600 font-medium hover:underline transition-colors"
                >
                  Sign up
                </button>
              </div>
            </div>

            {/* Register Form (Back) */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-center text-purple-600 mb-2">
                Join SnapBuy
              </h2>
              <p className="text-gray-500 text-center mb-8">
                Create your new account
              </p>
              {error && <p className="mb-6 text-center text-red-600 font-semibold">{error}</p>}
              <form onSubmit={handleRegisterSubmit} className="space-y-6">
                <InputWithIcon
                  Icon={User}
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={registerData.name}
                  onChange={handleRegisterChange}
                  disabled={loading}
                />
                <InputWithIcon
                  Icon={Mail}
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  disabled={loading}
                />
                <PasswordInput
                  name="password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  disabled={loading}
                  show={showPassword}
                  toggleShow={() => setShowPassword(!showPassword)}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-xl text-white font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg ${
                    loading
                      ? "bg-purple-300 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <RefreshCcw className="mr-2 h-5 w-5 animate-spin" />
                      Registering...
                    </span>
                  ) : (
                    "Register"
                  )}
                </button>
              </form>
              <div className="mt-8 text-center text-gray-500">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={toggleForm}
                  className="text-purple-600 font-medium hover:underline transition-colors"
                >
                  Log in
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
