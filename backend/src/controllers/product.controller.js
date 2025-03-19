import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/apiError.js";
import {ApiResponse} from "../utils/apiResponse.js";
//images as an array
//name of the array
//

const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, category, brand, stock } = req.body;
  
  
  if (
    !name.trim() ||
    !price.trim() ||
    !description ||
    !category ||
    !brand ||
    !stock
  ) {
    throw new ApiError(400, "All fields are mandatory");
  }
  const customer_role=req.user.role;
  console.log(customer_role)
  if(customer_role === "customer"){
    throw new ApiError(403,"You are not authorized to create a product")
  }
  let imageUrls=[];
  const product_img=req?.files;
  if(Array.isArray(product_img) && product_img.length > 0){
    for(const file of product_img){
      const localpath=file.path;
      const result=await uploadOnCloudinary(localpath);
      console.log(result)
      imageUrls.push(result.secure_url)
    }
  }

  const product = new Product({
    name: name,
    description: description,
    price: price,
    images: imageUrls,
    stock: stock,
    brand: brand,
    owner:req.user._id,
  });

  await product.save();
  if (!product) {
    throw new ApiError(400, "Error while creating product");
  }

  res
    .status(200)
    .json(new ApiResponse(200, product, "Product created successfully"));
});
const test=asyncHandler(async (req,res)=>{
  res.status(200).json({
    success:true,
    message:"test"
  })
})

export { createProduct,test };
