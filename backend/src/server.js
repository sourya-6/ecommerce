import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app=express()
//initializing cors
app.use(cors({
    origin:process.env.CORS_ORIGIN,//can meantion any domain if need we can give like ["https://snapbuy.com", "http://localhost:3000"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",//by default allows only get method and post
    credentials:true//allows cookies
}))

app.use(express.json({limit:"16kb"}))//shows the how much space is needed
app.use(express.urlencoded({extended:true,limit:"16kb"}))//used to deal with the form data
app.use(express.static("public"))
app.use(cookieParser())//recent activities



export{ app }