import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { getProductById } from '../store/slices/productSlice';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { ShoppingCart, ArrowRight, Star, Truck } from "lucide-react";
import { addToCart } from '../store/slices/cartSlice';

function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedProduct: product, loading, error } = useSelector((state) => state.product);
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    dispatch(getProductById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (product?.images?.length > 0) {
      setActiveImage(product.images[0]);
    }
  }, [product]);

  const handleBuyNow = (product) => {
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
    navigate("/cart");
  };

  if (loading) return <div className="text-center py-10 text-lg font-medium">Loading product...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  if (!product) return <div className="text-center py-10 text-gray-500">Product not found</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto bg-white rounded-2xl shadow-md">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Left: Product Images */}
        <div className="w-full">
          <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm mb-4">
            <img 
              src={activeImage} 
              alt={product.name} 
              className="w-full h-[450px] object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          {/* Thumbnail Preview */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.images.map((img, idx) => (
              <img 
                key={idx}
                src={img} 
                alt={`thumb-${idx}`} 
                onClick={() => setActiveImage(img)}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-all duration-200 
                  ${activeImage === img ? 'border-blue-500 scale-105' : 'border-gray-200 hover:border-gray-400'}`}
              />
            ))}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col justify-between sticky top-10 h-fit">
          <div>
            {/* Name & Ratings */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} className="text-yellow-400 fill-yellow-400" />
              ))}
              <span className="text-sm text-gray-500">(120 reviews)</span>
            </div>

            {/* Price & Stock */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-extrabold text-green-700">₹{product.price}</span>
              {product.stock > 0 ? (
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium">
                  In Stock ({product.stock})
                </span>
              ) : (
                <span className="px-3 py-1 bg-red-100 text-red-600 text-sm rounded-full font-medium">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Extra info */}
            <p className="text-gray-600 text-base leading-relaxed mb-4">{product.description}</p>
            <div className="space-y-2 text-sm text-gray-600 mb-6">
              <p><span className="font-semibold">Brand:</span> {product.brand}</p>
              <p><span className="font-semibold">Category:</span> {product.category}</p>
            </div>

            {/* Delivery Info */}
            <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-lg text-blue-700 mb-6">
              <Truck size={20} />
              <span className="text-sm font-medium">Free delivery within 3-5 days</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => dispatch(addToCart({ productId: product._id, quantity: 1 }))}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <ShoppingCart size={18} /> Add to Cart
            </button>
            <button
              onClick={() => handleBuyNow(product)}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Buy Now <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
