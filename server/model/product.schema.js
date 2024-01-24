
const mongoose = require('mongoose');

// Define the product schema
const schema = new mongoose.Schema({
    pname: {
        type: String,
        required: true
    },
    bname: {
        type: String,
        required: true
    },
    cateogary: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: true
    },
    descriptionheading: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    firstprice: {
        type: Number,
        required: true
    },
    lastprice: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    instock: {
        type: Number,
        required: true
    },
    image: [{
        type: String,
        required: true
    }],
    status: {
        type: Boolean,
        default: true
    },
    offer: {
        type: mongoose.Types.ObjectId,
        default: null,
        ref: 'Offer'
    },
    popularProducts:{
        type:Number,
        default:0,
    }
});

// Create a mongoose model using the product schema
const Product = mongoose.model('Product', schema);

// Export the Product model
module.exports = Product;