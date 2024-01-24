
// Import the mongoose library
const mongoose = require('mongoose');

// Define the product schema
const schema = new mongoose.Schema({
    name: { 
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"Inactive"
    },
    blocked:{
        type:Boolean,
        default:false
    },
    referralCode:{
        type:String,
        unique:true,
        required:true
    },
    referredBy:{
        type:String
    },
    referralCount:{
        type:Number,
        default:0
    }
   
    // You can add more fields as needed for your e-commerce project
});

// Create a mongoose model using the product schema
const Userdb = mongoose.model('userdb',schema);

// Export the Product model
module.exports = Userdb;


// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     phone: {
//         type: String,
//         required: true,
//     },
//     cart: [
//         {
//             productid: {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: 'Product', // Assuming there's a Product model
//                 required: true,
//             },
//             quantity: {
//                 type: Number,
//                 required: true,
//                 default: 1, // Default quantity if not specified
//             },
//         }
//     ],
//     myorders: [
//         {
//             orderid: {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: 'Order', // Assuming there's an Order model
//                 required: true,
//             },
//         }
//     ],
//     isBlocked: {
//         type: Boolean,
//         default: false,
//     },
//     address: [
//         {
//             name: {
//                 type: String,
//                 required: true,
//             },
//             contact: {
//                 type: String,
//                 required: true,
//             },
//             city: {
//                 type: String,
//                 required: true,
//             },
//         }
//     ],
// });

// const User = mongoose.model('User', userSchema);

// module.exports = User;