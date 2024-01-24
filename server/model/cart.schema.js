

const mongoose = require('mongoose');

// // Define the product schema
const schema = new mongoose.Schema({
  userId:{  
    type: mongoose.SchemaTypes.ObjectId,
    required:true
  },
  cartItems:[         
    {
    productId:{
        type:mongoose.SchemaTypes.ObjectId,
        required:true
    },
    quantity:{
        type:Number,
        default:1
    }
  },
  ]
});

// // Create a mongoose model using the product schema
const cartdb = mongoose.model('cartdb',schema);

// // Export the Product model
module.exports = cartdb;