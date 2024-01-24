
// Import the mongoose library
const mongoose = require('mongoose');

// Define the product schema
const schema = new mongoose.Schema({
    userId:{  
        type: mongoose.SchemaTypes.ObjectId,
        required:true
      },
    address:[{
        name:{
            type:String,
            required:true
        },
        postalCode: {
            type: Number,
            required: true,
        },
        address:{
            type:String,
            required:true
        },
        phoneNumber:{
            type:Number,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        defaultAddress:{
            type:Boolean,
            required:true,
            default:false
        }

}]  
    // You can add more fields as needed for your e-commerce project
});

// Create a mongoose model using the product schema
const Address = mongoose.model('Address',schema);

// Export the Product model

module.exports = Address;