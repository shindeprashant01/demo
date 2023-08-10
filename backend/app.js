const express = require("express");
const app = express();
const errorMiddleware = require("./middleware/error");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

//routes list
const product = require("./routes/productRoute");
const users = require("./routes/userRoute");
const order = require("./routes/orderRoute");

app.use("/api/v1",product);
app.use("/api/v1",users );
app.use("/api/v1",order);


//middleware for error
app.use(errorMiddleware);

module.exports =app