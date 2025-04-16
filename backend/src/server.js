import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import session from "express-session";
import passport from "./config/passport.js";
import dotenv from "dotenv"
const app=express()
//initializing cors
app.use(cors({
    origin:function (origin, callback) {
        if (!origin || origin.startsWith("http://localhost")) {
          callback(null, true); // ✅ Allow all localhost origins
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },//can meantion any domain if need we can give like ["https://snapbuy.com", "http://localhost:3000"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",//by default allows only get method and post
    credentials:true//allows cookies
}))

app.use(express.json({limit:"16kb"}))//shows the how much space is needed
app.use(express.urlencoded({extended:true,limit:"16kb"}))//used to deal with the form data
app.use(express.static("public"))
app.use(cookieParser())//recent activities


//for goole
// app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());


import userRouter from "./routes/user.routes.js"
import productRouter from "./routes/product.routes.js"
import categoryRouter from "./routes/category.routes.js"
app.use("/api/v1/user",userRouter)

app.use("/api/v1/product",productRouter)
app.use("/api/v1/category",categoryRouter)
app.get("/api/v1/user/dashboard",(req,res)=>{
  res.send("hellow world")
});

export{ app }