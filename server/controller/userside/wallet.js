
const Razorpay = require('razorpay')
const crypto = require('crypto')
const wallet = require('../../model/walletSchema');
const Wallet = require('../../model/walletSchema');



var razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_ID_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY
});



exports.addWallet = async (req, res) => {
  req.session.walletAddAmount = req.body.amount
  const amount = Number(req.body.amount) * 100
  console.log(amount);  
  const options = {
    amount: amount,
    currency: 'INR',
    receipt: 'order_rcptid_11'
  }



  try {
    const orders = await razorpayInstance.orders.create(options)
    console.log(orders);
    return res.status(200).send({
      success: true,
      msg: 'Order Created',
      key_id: process.env.RAZORPAY_ID_KEY,
      order: orders
    })

  } catch (err) {
    res.send(err)
  }

}


exports.addPaymentVerification = async (req, res) => {


  try {

    const userId = req.session.userId
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body
    console.log(razorpay_payment_id);
    console.log("hiii", req.body);


    const generated_signature = razorpay_order_id + "|" + razorpay_payment_id

    const except = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
      .update(generated_signature).digest("hex")

    if (except == razorpay_signature) {

      await wallet.updateOne({ userId: userId }, { $inc: { walletAmount: req.session.walletAddAmount } })
      //  await wallet.updateOne(
      //        {userId:userId},
      //        {$push:{'transactionHisrory.amount':req.session.walletAddAmount,
      //                'transactionHisrory.PaymentType':'Credit',
      //              }})
      const d = await wallet.findOneAndUpdate(
        { userId: userId },
        {
            $push: {
                'transactionHistory': {
                    amount: req.session.walletAddAmount,
                    PaymentType: 'Credit'
                }
            }
        }
    );
    console.log('Update successful:', d);

    console.log(d);
     

    

      res.redirect('/wallet')
    }  

  } catch (error) {
    res.send(error)
  }

}



exports.wallet = async (req, res) => {

  const userId = req.session.userId
  try {

    console.log("hiii");
    console.log(req.body);
    req.session.wallateUsed = true
    req.session.WalletproductPrice = req.body.productPrice

    const userWallet = await Wallet.findOne({ userId: userId })
    console.log(userWallet);
    const amount = userWallet.walletAmount - req.body.productPrice
    req.session.incrementWalletAmount = amount
    console.log('aMMM',amount);
    res.send()


  } catch (err) {
    res.send(err)
  }


}