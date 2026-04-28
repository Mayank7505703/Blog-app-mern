const express = require("express")
require("dotenv").config()
const path = require("path")
const userRoutes = require("./routes/user")
const multer = require("multer")
const cookieParser = require("cookie-parser");
const connection= require("./db/db")
const authMiddleware = require("./middlewares/auth")
const User = require("./models/user")
const blogRoutes = require("./routes/blog")
const app = express()
const PORT= 8000

connection()


app.use(cookieParser())
app.set("view engine","ejs")
app.set("views",path.resolve("./views"))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use("/user",userRoutes)
app.use("/",blogRoutes)
app.use("/upload", express.static("upload"));

app.listen(PORT,()=>{
  console.log("App is listening to the port : ",PORT)
})
