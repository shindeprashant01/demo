const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorHander");
const catchAsycError = require("../middleware/catchAsycError");

//create new Order
exports.newOrder = catchAsycError(async(req,res,next)=>{

const{shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice}= req.body;

 const order = await Order.create({
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paidAt:Date.now(),
            user:req.user._id,
        });

 res.status(201).json({
      success:true,
      order,
});
});

// get Single Orders-- admin
exports.getSingleOrder = catchAsycError(async(req,res,next)=>{
   
       const order = await Order.findById(req.params.id).populate(
            "user",
            "name email"
       );
       if(!order){
            return next(new ErrorHander("Order not found with this Id",404));
       }
     
       res.status(200).json({
            success:true,
            order,
       });
     });

// get logged in user order
exports.myOrders= catchAsycError(async(req,res,next)=>{
   
       const orders = await Order.find({user:req.user._id})
     
       res.status(200).json({
            success:true,
            orders,
       })
     })
// get All orders-- admin
exports.getALLOrders= catchAsycError(async(req,res,next)=>{
   
  const orders = await Order.find();

  let totalAmount =0;

  orders.forEach((order)=>{
       totalAmount+= order.totalPrice;
  })

     
res.status(200).json({
        success:true,
        totalAmount,
       orders,
       })
     })   ;

// update Order-- Admin
exports.updateOrder= catchAsycError(async(req,res,next)=>{
   
 const order = await Order.findById(req.params.id);
  
 if(!order){
     return next(new ErrorHander("Order not found with this Id",404));
}

 if(order.orderStatus === "Delivered"){
       return next(new ErrorHander("You have already Delivered this Order",400));
 }

 order.orderItems.forEach(async(o)=>{
       await updateStock(o.product,o.quntity);
 })
 
 order.orderStatus = req.body.status;

if(req.body.status === "Delivered"){
  order.deliveredAt = Date.now();
}
  await order.save({validateBeforeSave:false});     
  res.status(200).json({
   success:true,
  })
 })   

 async function updateStock(id,quntity){

  const product = await Product.findById(id);
  
  product.stock -= quntity;

  await product.save({validateBeforeSave:false});
 }
     
//delete order -- Admin
exports.deleteOrder = catchAsycError(async(req,res,next)=>{
  
 const order = await Order.findById(req.params.id)

 if(!order){
     return next(new ErrorHander("Order not found with this Id",404));
}
  await order.remove();

  res.status(200).json({
     success:true,
     message:"order deleted Successfully",
  })

})     
     
     
     