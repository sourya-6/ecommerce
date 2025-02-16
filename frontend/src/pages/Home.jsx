
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">SnapBuy</h1>
        <div>
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">Login</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-20 bg-blue-600 text-white">
        <h2 className="text-5xl font-bold">The Best Deals, Just a Click Away!</h2>
        <p className="mt-4 text-lg">Shop the latest trends at unbeatable prices.</p>
        <Link to="/login" className="mt-6 inline-block bg-white text-blue-600 px-6 py-3 rounded-lg shadow-md hover:bg-gray-200 transition-all font-semibold">
          Get Started
        </Link>
      </section>

      {/* Product Showcase */}
      <section className="max-w-6xl mx-auto py-16 px-6">
        <h3 className="text-3xl font-semibold text-gray-800 text-center">Featured Products</h3>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md text-center">
              <div className="h-40 bg-gray-300 flex items-center justify-center text-gray-500">
                Product Image
              </div>
              <h4 className="mt-4 text-lg font-semibold">Product Name</h4>
              <p className="text-gray-600">$XX.XX</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 bg-gray-800 text-white">
        <p>&copy; 2025 SnapBuy. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
