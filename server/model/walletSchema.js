





const mongoose = require('mongoose');


const schema = new mongoose.Schema({
    userId:{
        type:mongoose.SchemaTypes.ObjectId,
        required:true
    },
    walletAmount:{
        type:Number,
        default:0,
    },
    transactionHistory:[{
      amount:{
        type:Number,
        default:0
      },
      PaymentType:{ 
        type:String,
        default:null
      },
      date:{
        type:Date,
        default:Date.now
      }

    }]
    
});


const Wallet = mongoose.model('wallet',schema);

// Export the Product model
module.exports =Wallet;  