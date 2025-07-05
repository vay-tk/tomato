import express from "express";
import cors from "cors"
import connectDB from "./config/db.js";
import "dotenv/config"
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import path from "path"


//app config
const app = express();
const port = 4000;
const _dirname = path.resolve();

// middleware
app.use(express.json())
app.use(cors())

// api endpoints
app.use("/api/food",foodRouter)
app.use("/images",express.static('uploads'))  //localhost:4000/images/filename in uploads folder
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)

// serve static files from frontend
app.use(express.static(path.join(_dirname,"/frontend/dist")))

// API health check route
app.get("/api",(req,res)=>{
    res.send("API is working");
})

// catch-all handler for SPA routing (must be last)
app.get('*',(req,res)=>{
  res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"))
})

//db connection
connectDB();

app.listen(port,()=>{
    console.log("server is running on port",port)
})

