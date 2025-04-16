import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    brand: { type: String, required: true },
    discount: { type: Number, default: 0 }, // 🔥 Added discount field
    discountedPrice: { type: Number },
    stock: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    images: [{ type: String }],
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    owner: [{ type: Schema.Types.ObjectId, ref: "User" }],
    snapXDiscount: { type: Schema.Types.ObjectId, ref: "SnapX" },
  },
  { timestamps: true }
);

// 🔥 Fix: Ensure `discount` exists before using it
productSchema.pre("save", function (next) {
  if (this.isModified("price") || this.isModified("discount")) {
    this.discountedPrice = this.discount
      ? this.price - (this.price * this.discount) / 100
      : this.price;
  }
  next();
});

export const Product = mongoose.model("Product", productSchema);
