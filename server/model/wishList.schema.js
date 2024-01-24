

const mongoose = require('mongoose');

// Define the product schema
const schema = new mongoose.Schema({
    userId:{
        type:mongoose.SchemaTypes.ObjectId,
        required:true
    },
    wishlstItems:[         
        {
            type:mongoose.SchemaTypes.ObjectId,
            required:true
        },  
         
      ]
});

// Create a mongoose model using the product schema
const Wishlist = mongoose.model('Wishlist',schema);

// Export the Product model
module.exports =Wishlist;