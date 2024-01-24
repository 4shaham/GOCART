

const mongoose = require('mongoose');

// Define the product schema

const schema = new mongoose.Schema({
 coupenCode :{  
    type:String,
    required:true,
    unique:true
  },
  status:{
    type:Boolean,
    default:true
  },
  discountPercentage:{
    type:Number,
    required:true
  },
  expiredDate:{
    type: Date,
    required: true,
  },
  createdDate:{
    type: Date,
    required: true,
    default:Date.now()
  },
  minPurchaseAmt:{
    type:Number,
    required:true
  },
  maxRedimabelAmount:{
    type:Number,
    required:true
  }
});

// Create a mongoose model using the product schema
const CoupenManagment = mongoose.model('CoupenManagment',schema);

// Export the Product model
module.exports = CoupenManagment;