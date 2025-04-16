import {ApiError} from "../utils/apiError.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import Category from "../models/category.model.js";
import XLSX from "xlsx";
import { ApiResponse } from "../utils/apiResponse.js";

import fs from "fs";

//✅Create Category
const createCategory = asyncHandler(async (req , res)=>{
    try {
      const customer_role=req.user.role;
      if(customer_role === "customer"){
        throw new ApiError(403,"You are not authorized to create a product")
      }
      
        if(!req.file){
            throw new ApiError(400,"File is not uploaded")
           }
           const filepath = req.file.path
           const workbook = XLSX.readFile(filepath);
           
            const sheetName = workbook.SheetNames[0];//may contain multiple sheets like "prodcut6s","categories"
            //but we are assuming that there is only one sheet
            //that to category one
           
            if (!sheetName) throw new ApiError(401,"No sheets found in the Excel file");

             const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
             //converts to the json
           
            // Validate data
            if (!data || data.length === 0) {
                throw new ApiError(400, "No data found in the Excel file");
            }
        
            // Convert Excel data to Category format
            const categories = data.map((row) => ({
              name: row.Name,
              description: row.Description || "No description provided", // Default value if empty
            }));
        
            // Bulk insert categories
            await Category.insertMany(categories);

            fs.unlink(filepath, (err) => {
              if (err) console.error("Error deleting file:", err);
              else console.log("✅ Excel file deleted after processing");
            });

            res.status(201)
            .json(
              new ApiResponse(201,categories,"Categories uploaded successfully!")
            )
              
        
    }catch (error) {
        throw new ApiError(500,error.message)
    
}
})

//✅Delete Category
const deleteCategory = asyncHandler(async (req , res)=>{
  const {name}=req.body;
  const customer_role=req.user.role;
  if(customer_role === "customer"){
    throw new ApiError(403,"You are not authorized to create a product") 
  }

  if(!name.trim()===""){
    throw new ApiError(400,"Category name is required")
  }
  const category = await Category.findOneAndDelete({name});
  if(!category){
    throw new ApiError(404,"Category not found")
  }
})

export {
    createCategory,deleteCategory
}