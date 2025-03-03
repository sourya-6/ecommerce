import {Product} from "../models/product.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";

//images as an array
//name of the array
//

const createProduct=asyncHandler(async(req,res) =>{
    const {name,price,description,category,brand,images,stock}=req.body;

    const product = new Product({
        name:name,
        description:description,
        price:price,
        images:images,
        stock:stock,
        brand:brand,
    })
    
})






export {

};
