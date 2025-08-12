import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cartItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CartItem",
      },
    ],
    totalActualPrice: {
      type: Number,
      default: 0,
    },
    totalDiscountedPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// ✅ Virtual for total saved
cartSchema.virtual("totalSaved").get(function () {
  return this.totalActualPrice - this.totalDiscountedPrice;
});

// ✅ Pre-save hook to recalculate totals
cartSchema.pre("save", async function (next) {
  if (!this.cartItems || this.cartItems.length === 0) return next();

  const cartItems = await mongoose.model("CartItem").find({
    _id: { $in: this.cartItems },
  });

  this.totalActualPrice = cartItems.reduce(
    (sum, item) => sum + item.actualPrice * item.quantity,
    0
  );

  this.totalDiscountedPrice = cartItems.reduce(
    (sum, item) => sum + item.subtotal,
    0
  );

  next();
});

export default mongoose.model("Cart", cartSchema);
