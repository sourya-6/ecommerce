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
    totalSaved: {
      type: Number,
      default: function () {
        return this.totalActualPrice - this.totalDiscountedPrice;
      },
    },
  },
  { timestamps: true }
);

// Pre-save hook to calculate totals from cart items
cartSchema.pre("save", async function (next) {
  if (!this.cartItems || this.cartItems.length === 0) return next();

  const cartItems = await mongoose.model("CartItem").find({
    _id: {
      $in: this.cartItems,
    },
  });

  this.totalActualPrice = cartItems.reduce(
    (sum, item) => sum + item.actualPrice * item.quantity,
    0
  );

  this.totalDiscountedPrice = cartItems.reduce(
    (sum, item) => sum + item.discountedPrice * item.quantity,
    0
  );

  this.totalSaved = this.totalActualPrice - this.totalDiscountedPrice;

  next();
});

export default mongoose.model("Cart", cartSchema);
