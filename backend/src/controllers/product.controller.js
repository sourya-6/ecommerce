import {Product} from "../models/product.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";

//images as an array
//name of the array
//

const createProduct=asyncHandler(async(req,res) =>{
    const {name,price,description,category,brand,images,stock}=req.body;

    if(!name||!price||!description||!category||!brand||!images||!stock){
        throw new ApiError(400,"All fields are mandatory");
    }
    if(!req.files==0 || !req.files.length==0){
        throw new ApiError(400,"Atleast upload one image");
    }

    

    const product = new Product({
        name:name,
        description:description,
        price:price,
        images:images,
        stock:stock,
        brand:brand,
    })

    await product.save()
    if(!product){
        throw new ApiError(400,"Error while creating product")
    }
    
    res.status(200)
    .json(
         new ApiResponse(200,product,"Product created successfully")
    )
})
export  default createProduct






export {

};
