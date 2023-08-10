const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true,"Please Enter Products Name"],
        trim:true
    },
    description:{
        type :String,
        required :[true,"Please Enter Product Description"]
    },
    price:{
            type :Number,
            required :[true,"Please Enter Product Price"],
            maxLength:[8,"Price can't exceed than 8 characters"]
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[ 
        {               //take array instead of object bcoz we have more images in that
        public_id:{               //bcoz we are appling image from cloudnary
         type:String,
         required:true,
        },
        url:{
            type:String,
           required:true
        }
    }
    ],
    category:{
        type:String,
        required:[true,"Please Enter Product Category"]
    },
    stock:{
        type:Number,
        required :[true," Please Enter Product Stocks"],
        maxLength:[4,"Stocks Can't Exceed than 4 Characters"],
        default:1
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type: mongoose.Schema.ObjectId,
                ref:"User",
                required : true,
            },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true,
            },
            comment:{
              type: String,
              required:true
            }
         }
    ],

    user:{
        type: mongoose.Schema.ObjectId,
        ref:"User",
        required : true,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("Product",productSchema)