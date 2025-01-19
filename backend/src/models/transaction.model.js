import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment", required: true },
    amount: { type: Number, required: true },
    transactionType: { type: String, enum: ["payment", "refund", "chargeback"], required: true },
    paymentGateway: { type: String, required: true }, // e.g., Stripe, PayPal, Razorpay
    transactionDate: { type: Date, default: Date.now },
    status: { type: String, enum: ["success", "failed", "pending"], required: true },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
