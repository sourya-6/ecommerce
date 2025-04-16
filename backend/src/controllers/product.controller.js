import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/apiError.js";
import {ApiResponse} from "../utils/apiResponse.js";
import XLSX from "xlsx";

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


const multipleProductUpload = asyncHandler(async (req, res) => {
  const customer_role = req.user.role;
  if (customer_role === "customer") {
    throw new ApiError(403, "You are not authorized to create a product");
  }

  if (!req.files || !req.files.images || !req.files.excel) {
    throw new ApiError(400, "Missing required files. Upload images and an Excel file.");
  }

  const excelFile = req.files.excel[0].path;
  const workbook = XLSX.readFile(excelFile);
  const sheetName = workbook.SheetNames[0];

  if (!sheetName) {
    throw new ApiError(401, "No sheets found in the Excel file");
  }

  const productsData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

  if (!productsData || productsData.length === 0) {
    throw new ApiError(401, "No data found in the Excel file");
  }

  const totalImages = req.files.images.length;
  const numProducts = productsData.length;

  if (totalImages !== numProducts * 5) {
    throw new ApiError(
      400,
      `Each product must have exactly 5 images. Expected ${numProducts * 5} images, but got ${totalImages}.`
    );
  }

  let imageUrls = [];
  const product_img = req.files.images; // ✅ Correctly getting image array
  console.log("Uploaded Images:", product_img.length);

  for (const file of product_img) {
    const localpath = file.path;
    const result = await uploadOnCloudinary(localpath);
    console.log("Cloudinary Upload:", result);
    imageUrls.push(result.secure_url);
  }

  console.log("Total Cloudinary Images:", imageUrls.length);

  // ✅ Assign 5 images to each product correctly
  productsData.forEach((product, index) => {
    const images = imageUrls.slice(index * 5, (index + 1) * 5);
    if (images.length !== 5) {
      throw new ApiError(
        400,
        `Product ${product.name} is missing images. Each product requires exactly 5 images.`
      );
    }
    product.images = images;
  });

  await Product.insertMany(productsData);

  res.status(201).json(new ApiResponse(201, "Products uploaded successfully"));
});


// 📝 Get All Products
const getAllProducts = asyncHandler(async (req, res) => {
  const { category, brand, minPrice, maxPrice, sort, page, limit } = req.query;
  const query = {};

  if (category) query.category = category;
  if (brand) query.brand = brand;
  if (minPrice) query.price = { $gte: minPrice };
  if (maxPrice) query.price = { ...query.price, $lte: maxPrice };

  const sortOption = sort === "price-asc" ? { price: 1 } : sort === "price-desc" ? { price: -1 } : { createdAt: -1 };

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const products = await Product.find(query).sort(sortOption).skip(skip).limit(limitNumber);
  const total = await Product.countDocuments(query);

  res.status(200).json(new ApiResponse(200, { products, total }, "Products fetched successfully"));
});





export { createProduct,multipleProductUpload,getAllProducts};
