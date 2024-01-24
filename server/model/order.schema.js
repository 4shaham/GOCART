
const mongoose = require('mongoose');

// Define the product schema

const schema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    orderItems: [{
        productId: {
            type: mongoose.SchemaTypes.ObjectId,
            required: true,
        },
        quantity: {
            type: Number,
            required: true
        },
        pName: {
            type: String,
            required: true
        },
        bName: {
            type: String,
            required: true
        },
        cateogary: {
            type: String,
            required: true
        },
        subTitle: {
            type: String,
            required: true
        },
        descriptionHead: {
            type: String,
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,

        },
        mrp: {
            type: Number,
            required: true
        },
        discount: {
            type: Number,
            required: true
        },
        colour: {
            type: String,
            required: true
        },
        image: [
            {
                type: String,
                required: true

            }
        ],
        orderStatus: {
            type: String,
            default: "ordered",
            required: true
        },
        returnReason: {
            type: String,
        },
        cancelReason: {
            type: String,
        }
    }],
    paymentMethod: {
        type: String,
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now()
    },
    address: {
        name: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        phone: {
            type: Number,
            required: true,
        },
        city: {
            type: String,
            required: true
        },
        postalCode: {
            type: Number,
            required: true,
        }

    },
    totalAmount: {
        type: Number
    },
    //  coupenAmount:{
    //     type:Number
    //  }
    coupenId: {
        type: mongoose.SchemaTypes.ObjectId
    }

});

// Create a mongoose model using the product schema

const order = mongoose.model('order', schema);

// Export the Product model
module.exports = order;