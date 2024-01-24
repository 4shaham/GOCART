
const mongoose = require('mongoose');

// Define the product schema
const schema = new mongoose.Schema({
  categary: {
    type: String,
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
  // offer: {
  //   type:mongoose.Types.ObjectId,
  //   default:null,
  //   ref:'Offer'
  // }
});

// Create a mongoose model using the product schema
const Cateogary = mongoose.model('Cateogary', schema);

// Export the Product model
module.exports = Cateogary;