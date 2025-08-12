import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders, fetchMyOrders } from "../store/slices/orderSlice";
import { format } from "date-fns";
import { Link } from "react-router-dom";

function Order() {
  const dispatch = useDispatch();
  const [adminView, setAdminView] = useState(false);

  const { myOrders, allOrders, loading, error } = useSelector(
    (state) => state.order
  );
  const { user } = useSelector((state) => state.user.user);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      dispatch(fetchAllOrders());
      setAdminView(true);
    } else {
      dispatch(fetchMyOrders());
      setAdminView(false);
    }
  }, [dispatch, user]);

  const orders = adminView ? allOrders : myOrders;

  const getBadgeClass = (status) => {
    const lower = status?.toLowerCase();
    if (lower === "success" || lower === "paid")
      return "bg-green-100 text-green-700";
    if (lower === "pending") return "bg-yellow-100 text-yellow-700";
    if (lower === "failed" || lower === "cancelled")
      return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-3xl font-semibold mb-6 text-center">
        {adminView ? "All Orders" : "My Orders"}
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-48 text-gray-500">
          Loading...
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : orders?.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16">
          <img
            src="/empty-orders.svg"
            alt="No orders"
            className="w-48 h-48 mb-6"
          />
          <p className="text-gray-500 mb-4">
            {adminView
              ? "No orders have been placed yet."
              : "You haven't placed any orders yet."}
          </p>
          {!adminView && (
            <Link
              to="/shop"
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Start Shopping
            </Link>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr className="text-sm text-gray-600 uppercase">
                <th className="px-4 py-3 text-left">Order ID</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Total Price</th>
                <th className="px-4 py-3 text-left">Payment</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order) => (
                <tr
                  key={order._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 font-medium text-blue-600">
                    #{order._id.slice(-6)}
                  </td>
                  <td className="px-4 py-3">
                    {format(new Date(order.createdAt), "dd/MM/yyyy")}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    ₹{order.totalPrice}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${getBadgeClass(
                        order.paymentStatus === "SUCCESS"
                          ? "Paid"
                          : order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus === "SUCCESS"
                        ? "Paid"
                        : order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${getBadgeClass(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/order/${order._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Order;
