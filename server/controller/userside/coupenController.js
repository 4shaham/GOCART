
const { default: mongoose } = require('mongoose');
const CoupenManagment = require('../../model/coupenManagmentSchema')
const Order = require('../../model/order.schema')


exports.coupenMangament = async (req, res) => {

  userId = req.session.userId
  console.log('llllllll', req.body);
  const { totalPrice2, coupenCode } = req.body
  console.log(coupenCode);
  try {
    const data = await CoupenManagment.findOne({ coupenCode: coupenCode, status: true })
    console.log(data)

      // const ordersCoupenValidation = await Order.find({ userId: userId })
      // console.log('kll', ordersCoupenValidation[0].coupenId);
      // const id = ordersCoupenValidation[0].coupenId
      // console.log(data,id, data._id)
      // console.log('llooooooooooooooo');


      // if (id.equals(data._id)) {
      //   console.log('hiiii');
      //   return res.status(400).send('agiain')
      // }
    

    if (data !== null && data.minPurchaseAmt > totalPrice2) {

      res.status(400).send('above')

    }
    else if (data !== null) {
      req.session.coupen = data.discountPercentage
      req.session.coupenId = data._id
      res.send(data)
    } else {
      res.status(404).send('Enter correct coupon code')
    }
  } catch (err) {
    res.send(err)
  }

}


exports.findcoupen = async (req, res) => {

  try {

  

    const coupen = await CoupenManagment.find({ status: true })
    console.log('co',coupen);
    



    res.send(coupen)  

  } catch (err) {

    res.status(500).send(err)

  }


}





