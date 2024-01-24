const Product = require("../../model/product.schema")
var Userdb = require("../../model/User schema")



exports.buyNow= async(req,res)=>{
    console.log('hii');
    const productId=req.query.id
    console.log(productId);

    try{

     const buyNowProduct=await Product.findOne({_id:productId})
     console.log(buyNowProduct);
     res.send(buyNowProduct)

    }catch(err){

        res.send(err)
        
    }


}