const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorHander");
const catchAsycError = require("../middleware/catchAsycError");
const ApiFeatures = require("../utils/apifeatures");


// firstly create Products -- admin

exports.createProduct = catchAsycError( async (req, res, next) => {
 
 req.body.user= req.user.id;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});  
// get all products
exports.getAllProducts =catchAsycError( async (req, res) => {
   const resultPerPage =4;
   const productCount = await Product.countDocuments();

  const apifeature = new ApiFeatures(Product.find(), req.query)
  .search()
  .filter()
  .pagination(resultPerPage)
  const products = await apifeature.query;

  res.status(200).json({
    success: true,
    products,
    productCount,
  });
});


// get product details

exports.getProductDetails = catchAsycError(async (req,res,next) =>{

  const product = await Product.findById(req.params.id)

  if(!product){
    return next (new ErrorHander("Product not Found",404));
  }
 // OR
/*
 if (!product) {
    return res.status(200).json ({
      success: false,
      message: "product not found",

     } );
  }

 */

  res.status(200).json({
    success:true,
    product
  })

});



//update Products --admin

exports.updateProduct =catchAsycError( async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if(!product){
    return next (new ErrorHander("Product not Found",404));
  }

 /* if (!product) {
    return res.status(500).json ({
      success: false,
      message: "product not found",

     } );
  }
  */
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success:true,
    product,
  })
});

//delete Product--admin

exports.deleteProduct =catchAsycError( async (req,res,next)=>{

  const product = await Product.findById(req.params.id)
  
  if(!product){
    return next (new ErrorHander("Product not Found",404));
  }

  /*
  if(!product){
    return res.status(500).json({
      success:false,
      message:"Product Not Found,Please enter correct ID"
    })
  }
  */
  await product.remove();

  res.status(200).json({
    success:true,
    message:"Product Deleted SuccessFully."
  })

});

// create review and update review

exports.createPraductReview = catchAsycError(async(req,res,next)=>{

  const {rating,comment,productId}= req.body
  const review ={
    user : req.user.id,
    name : req.user.name,
   rating:Number(rating),
   comment,

  }

  const product = await Product.findById(productId);

  const isReviewed =product.reviews.find(rev=> rev.user.toString()===req.user._id.toString())
  
  if(isReviewed){
 product.reviews.forEach(rev=>{

  if(rev.user.toString()===req.user._id.toString())
  rev.rating=rating,
  rev.comment=comment

 });
  }
  else{
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length
  }
  let avg =0;

  product.reviews.forEach(rev=>{
    avg+=rev.rating;
  })
  product.ratings= avg/ product.reviews.length ;

  product.save({validateBeforeSave:false});

  res.status(200).json({
    success:true,

  })

});

//get all reviews of single Product
exports.getProductReviews = catchAsycError(async(req,res,next)=>{

  const product = await Product.findById(req.query.id);

  if(!product){
    return next(new ErrorHander("Prodct Not Found",404));
  }

  

  res.status(200).json({
    success : true,
    reviews :product.reviews,
  })

  
});

//delete reveiws
exports.deleteReviews = catchAsycError(async(req,res,next)=>{

  const product = await Product.findById(req.query.productId);

  if(!product){
    return next(new ErrorHander("Prodct Not Found",404));
  }

  const reviews= product.reviews.filter(
    (rev)=> rev._id.toString() !== req.query.id.toString());

    let avg =0;

    reviews.forEach(rev=>{
      avg+=rev.rating;
    })

    const ratings= avg/ reviews.length ;

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId,
      {reviews,
       ratings
       ,numOfReviews },
      { new:true,
        runValidators :true,
        useFindAndModify :false},
        )

  res.status(200).json({
    success : true,

  })

  
})

