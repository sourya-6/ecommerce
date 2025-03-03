import mongoose,{Schema} from "mongoose";

const productSchema = new Schema(
  {
    name: { 
        type: String,
        required: true,
    
    },
    description: { 
      type: String, 
      required: true
    },
    price: {
       type: Number, 
       required: true
       },
      brand:{
        type:String,
        required:true

    },
    discountedPrice: { 
      type: Number 
    },
    stock: { type: Number, required: true },
    category: { 
      type: mongoose.Schema.Types.ObjectId,
       ref: "Category"
    },
    images:[ { 
      type: String
    }],
    reviews:[{
      type:Schema.Types.ObjectId,
      ref:"Review"
    }],
    seller:{
      type:Schema.Types.ObjectId,
      ref:"User"
    },
    snapXDiscount:{
      type:Schema.Types.ObjectId,
      ref:"SnapX"
    }



  },
  { timestamps: true }
);

// Hook for updating discounted price if the discount is applied
productSchema.pre("save", function (next) {
  if (this.isModified("price") || this.isModified("discountedPrice")) {
    this.discountedPrice = this.price - (this.price * (this.discount / 100));
  }
  next();
});

const Product = mongoose.model("Product", productSchema);
export default Product;
