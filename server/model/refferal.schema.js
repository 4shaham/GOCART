
const mongoose = require('mongoose');

// Define the product schema
const schema = new mongoose.Schema({
    referralRewards:{
        type:Number,
        required:true
        
    },
    referralUserRewards:{
        type:Number,
        required:true
       
    },
    expiredate:{  
        type:Date,
        required:true
    }
  
});

// Create a mongoose model using the product schema
const referralOffer = mongoose.model('referralOffer',schema);

// Export the Product model
module.exports =referralOffer;