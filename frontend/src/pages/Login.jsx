// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const response = await fetch("http://localhost:4000/api/v1/user/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include", // Send cookies with request
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();
//       console.log(data)
//       if (!response.ok) {
//         throw new Error(data.message || "Login failed");
//       }

//       // Store user details in localStorage
//       localStorage.setItem("user", JSON.stringify(data.user));

//       // Redirect to dashboard
//       navigate("/dashboard");
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <h2 className="text-2xl font-bold mb-4">Login to SnapBuy</h2>
//       {error && <p className="text-red-500 mb-4">{error}</p>}
//       <form className="bg-white p-6 rounded-lg shadow-md w-80" onSubmit={handleLogin}>
//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full p-2 border mb-2 rounded"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full p-2 border mb-4 rounded"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
//           Login
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser }  from "../store/slices/userSlice.js";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get data from redux store: user, error, loading
  const { user, error, loading, isAuthenticated } = useSelector((state) => state.user);

  // Redirect when logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Login to SnapBuy</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form className="bg-white p-6 rounded-lg shadow-md w-80" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border mb-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
