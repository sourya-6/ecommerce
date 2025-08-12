import { Facebook, Twitter, Instagram, Linkedin  } from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      // TODO: Add your subscription logic here
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between gap-12">
          {/* Logo & Description */}
          <div className="flex flex-col space-y-4 max-w-xs">
            <h2 className="text-2xl font-bold text-white cursor-pointer select-none">
              SnapBuy
            </h2>
            <p className="text-gray-400 text-sm">
              Your one-stop shop for the latest products at unbeatable prices.
            </p>
            <div className="flex space-x-4 mt-2">
              <a
                href="#"
                aria-label="Facebook"
                className="hover:text-white transition"
              >
                <Facebook size={24} />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="hover:text-white transition"
              >
                <Twitter size={24} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="hover:text-white transition"
              >
                <Instagram size={24} />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="hover:text-white transition"
              >
                <Linkedin size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="/" className="hover:text-white transition">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/products" className="hover:text-white transition">
                    Products
                  </a>
                </li>
                <li>
                  <a href="/about" className="hover:text-white transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="/faq" className="hover:text-white transition">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="/shipping" className="hover:text-white transition">
                    Shipping
                  </a>
                </li>
                <li>
                  <a href="/returns" className="hover:text-white transition">
                    Returns
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="hover:text-white transition">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Account</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="/login" className="hover:text-white transition">
                    Login
                  </a>
                </li>
                <li>
                  <a href="/register" className="hover:text-white transition">
                    Register
                  </a>
                </li>
                <li>
                  <a href="/orders" className="hover:text-white transition">
                    Orders
                  </a>
                </li>
                <li>
                  <a href="/wishlist" className="hover:text-white transition">
                    Wishlist
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-white font-semibold mb-4">Newsletter</h3>
              <p className="text-gray-400 text-sm mb-3">
                Subscribe to get the latest updates and offers.
              </p>
              {subscribed ? (
                <p className="text-green-400 font-semibold">
                  Thanks for subscribing!
                </p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col space-y-3">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-6 text-center text-gray-500 text-sm select-none">
          &copy; {new Date().getFullYear()} SnapBuy. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
