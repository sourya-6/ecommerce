// src/pages/Dashboard.jsx
import { useDispatch } from "react-redux";

import { Link } from "react-router-dom";

import { useSelector } from "react-redux";
import {  useEffect } from "react";
import { getAllProducts } from "../store/slices/productSlice";

// import { logoutUser } from "../store/slices/userSlice"; // Adjust path as needed

const Dashboard = () => {
  const dispatch = useDispatch();
  
  const { products: productData,  loading, error } = useSelector((state) => state.product);
  console.log(productData, "productData");
  // const {addToCart} = useSelector((state) => state.cart);
  const products = productData.products || [];
  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  // const handleLogout = async () => {
  //   try {
  //     await dispatch(logoutUser()).unwrap(); // Triggers backend + Redux state update
  //     navigate("/login");
  //   } catch (err) {
  //     console.error("Logout failed:", err);
  //   }
  // };

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
        <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Featured Products
        </h3>

        {loading && (
          <p className="text-center text-blue-500 text-lg">Loading products...</p>
        )}

        {error && (
          <p className="text-center text-red-500 text-lg">Error: {error}</p>
        )}

        {!loading && !error && products?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <Link key={product._id} to={`/product/${product._id}`}>
              <div
                
                className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden group"
              >
                <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-sm group-hover:scale-105 transition-transform">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4 text-center">
                  <h4 className="text-lg font-semibold text-gray-800">
                    {product.name}
                  </h4>
                  <p className="text-blue-600 font-medium mt-1">
                    ₹{product.price}
                  </p>
                 
                </div>
                
              </div>
              </Link>
            ))}
            
          </div>
        ) : (
          !loading &&
          !error && (
            <p className="text-center text-gray-500">No products found.</p>
          )
        )}
      </section>
  );
};

export default Dashboard;
