import { Link } from "react-router-dom";
import { ArrowRight} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {  useEffect } from "react";
import { getAllProducts } from "../store/slices/productSlice";
import { useNavigate } from "react-router-dom";

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';


function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products: productData, selectedProduct, loading, error } = useSelector((state) => state.product);
  console.log(productData, "productData");
  // const {addToCart} = useSelector((state) => state.cart);
  const products = productData.products || [];
  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);


 

  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <section
        className="relative bg-cover bg-center h-[70vh] flex items-center justify-center text-white"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1606813904474-79c2d632d60b?auto=format&fit=crop&w=1920&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative text-center max-w-2xl">
          <h2 className="text-5xl font-extrabold mb-4 drop-shadow-md">
            Big Deals, Small Prices
          </h2>
          <p className="text-lg mb-6 drop-shadow-md">
            Find your perfect product with SnapBuy
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-6 py-3 rounded-full hover:bg-blue-100 transition-all shadow-md"
          >
            Shop Now <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Featured Products */}
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
    <Swiper
      modules={[Autoplay]}
      autoplay={{ delay: 2000, disableOnInteraction: false }}
      spaceBetween={20}
      slidesPerView={4}
      loop={true}
      breakpoints={{
        0: { slidesPerView: 1 },
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 4 },
      }}
    >
      {products.map((product) => (
        <SwiperSlide key={product._id}>
          <Link to={`/product/${product._id}`}>
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden group">
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
        </SwiperSlide>
      ))}
    </Swiper>
  ) : (
    !loading && !error && (
      <p className="text-center text-gray-500">No products found.</p>
    )
  )}
</section>


      {/* Promo CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16 text-center">
        <h3 className="text-3xl font-bold mb-3">
          Get 30% Off on First Purchase
        </h3>
        <p className="mb-5">
          Use code <span className="font-semibold">SNAP30</span> at checkout
        </p>
        <Link
          to="/login"
          className="inline-block bg-white text-purple-700 font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition"
        >
          Grab Offer
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16 text-center">
        <p className="text-sm mb-2">&copy; 2025 SnapBuy. All rights reserved.</p>
        <div className="space-x-4 text-sm text-gray-400">
          <Link to="/about" className="hover:underline">
            About
          </Link>
          <Link to="/contact" className="hover:underline">
            Contact
          </Link>
          <Link to="/privacy" className="hover:underline">
            Privacy
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default Home;
