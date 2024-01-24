
const Address = require('../../model/address.schema')
const cartdb = require('../../model/cart.schema');
const { default: mongoose } = require("mongoose");
const Order = require('../../model/order.schema')
const Product = require("../../model/product.schema")
const Razorpay = require('razorpay')
const crypto = require('crypto')
const wallet = require('../../model/walletSchema');
const Wallet = require('../../model/walletSchema');
const { log } = require('console');


var razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_ID_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY
});



exports.ckeckoutPayment = async (req, res) => {
  const userId = req.session.userId

  console.log(req.session.coupen);

  const address = await Address.aggregate([{
    $unwind: "$address"
  }, { $match: { userId: new mongoose.Types.ObjectId(userId), 'address.defaultAddress': true } }])

  if (address.length == 0) {
    return res.status(405).send('Add Address')
  }






  if (!req.body.paymentMethod) {

    return res.status(404).send('Choose Any Payment Method')
  }

  const data1 = await cartdb.findOne({
    userId: userId
  })

  console.log(data1);

  for (const product of data1.cartItems) {

    const qty = Number(product.quantity);
    const products = await Product.findOne(
      { _id: product.productId }
    )
    if (products.instock < qty) {
      console.log('hiiii');
      return res.status(400).send('out of Stock')
      // return res.send("ordered failed No stock")  
    }

  }


  req.session.totalAmount = Number(req.body.totalPrice)

  if (req.body.paymentMethod == "online Payment") {

    req.session.totalAmount = Number(req.body.totalPrice)
    console.log("hiiiii", typeof req.body.totalPrice);
    console.log(req.session.totalAmount);
    const amount = Number(req.body.totalPrice) * 100
    console.log(amount, typeof amount);
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
      console.log(err)
    }


  }

  // ordersDbDataCreations


  let userCart = await cartdb.aggregate([
    {
      $match: { userId: new mongoose.Types.ObjectId(userId) }
    },
    {
      $unwind: "$cartItems"
    },
    {
      $lookup: {
        from: "products",
        localField: "cartItems.productId",
        foreignField: "_id",
        as: "productDetails"

      }
    },
    {
      $lookup: {
        from: "offers",
        localField: "productDetails.offer",
        foreignField: "_id",
        as: "offer"

      }
    },
    // {
    //   $project: {
    //     userID: 1,
    //     cartItems: 1,
    //     productDetails: 1
    //   }
    // }
  ])

  let products = []

  console.log('kkk', userCart);

  userCart.forEach((data) => {

    console.log('sam');
    const t = data.offer.length != 0 ? data.offer[0].discount * data.productDetails[0].lastprice / 100 : 0
    console.log(t);
    products.push({
      productId: data.cartItems.productId,
      quantity: data.cartItems.quantity,
      pName: data.productDetails[0].pname,
      bName: data.productDetails[0].bname,
      cateogary: data.productDetails[0].cateogary,
      subTitle: data.productDetails[0].subtitle,
      descriptionHead: data.productDetails[0].descriptionheading,
      description: data.productDetails[0].description,
      price: data.productDetails[0].lastprice - t,
      mrp: data.productDetails[0].firstprice,
      discount: data.productDetails[0].discount,
      colour: data.productDetails[0].color,
      image: data.productDetails[0].image,
    })

  })



  const ValueAddress = {
    name: address[0].address.name,
    phone: address[0].address.phoneNumber,
    address: address[0].address.address,
    city: address[0].address.city,
    postalCode: address[0].address.postalCode,
  };

  let order
  if (req.session.coupen && req.session.coupenId) {
    console.log('hiii',req.session.totalAmount,'kshjshgc');
    // const TotalAmount=req.session.coupen*req.session.totalAmount/100-req.session.totalAmount
    console.log('total');
    order = new Order({
      userId: userId,
      orderItems: products,
      paymentMethod: req.body.paymentMethod,
      address: ValueAddress,
      coupenId: req.session.coupenId,
      totalAmount: req.session.totalAmount
    });

    await order.save()

  } else {

    order = new Order({
      userId: userId,
      orderItems: products,
      paymentMethod: req.body.paymentMethod,
      address: ValueAddress,
      totalAmount: req.session.totalAmount

    });

    await order.save()

  }



  if (req.session.wallateUsed) {
    const findAmount = await Wallet.findOne({ userId: userId })
    console.log('klkl', findAmount);
    if (req.session.incrementWalletAmount < 0) {

      await Wallet.updateOne({ userId: userId }, { $set: { walletAmount: 0 } })
      await Wallet.findOneAndUpdate(
        { userId: userId },
        {
          $push: {
            'transactionHistory': {
              amount: findAmount.walletAmount - 0,
              PaymentType: 'Debit'
            }
          }
        }
      )

    } else {

      await Wallet.updateOne({ userId: userId }, { $set: { walletAmount: req.session.incrementWalletAmount } })
      await Wallet.findOneAndUpdate(
        { userId: userId },
        {
          $push: {
            'transactionHistory': {
              amount: findAmount.walletAmount - req.session.incrementWalletAmount,
              PaymentType: 'Debit'
            }
          }
        }
      )
    }

  }
  // delete req.session.wallateUsed, 
  // delete req.session.incrementWalletAmount, 
  // delete req.session.WalletproductPrice 









  // stockManagment  

  const orderId = order._id
  const data = await Order.aggregate(
    [
      {
        '$match': {
          '_id': new mongoose.Types.ObjectId(orderId)
        }
      }
    ]
  )

  console.log(data, orderId);


  // for (const product of data[0].orderItems) {

  //   const qty = Number(product.quantity);
  //   const products = await Product.findOne(
  //     { _id: product.productId }
  //   )
  //   if (products.instock < qty) {

  //     return res.status(400).send('out of Stock')
  //     // return res.send("ordered failed No stock")  
  //   }

  // }


  // decreasing the stock in product Db

  for (const product of data[0].orderItems) {

    const update = Number(product.quantity);
    await Product.findOneAndUpdate(
      { _id: product.productId },
      { $inc: { instock: -update, popularProducts: update } }
    )

  }

  //cartDb clear

  await cartdb.updateMany({ userId: userId }, { $set: { cartItems: [] } })


  req.session.OrderSuccessPageManage = true
  req.session.checkOutPageVerification = true

  res.send({ url: '/orderSuccssessPage', Message: "cash on delivery" })


}

// orders return 

exports.ordersStatusReturn = async (req, res) => {
  try {

    const userId = req.session.userId
    const orderId = req.query.orderId
    const productId = req.query.productId


    const reason = req.body.reason
    await Order.findOneAndUpdate({ "_id": orderId, 'orderItems.productId': productId }, { $set: { 'orderItems.$.returnReason': reason } })



    const orderProduct = await Order.findOneAndUpdate({ "_id": orderId, 'orderItems.productId': productId }, { $set: { "orderItems.$.orderStatus": "returned" } })
    const validationUser = await wallet.findOne({ userId: userId })


    const walletPrice = orderProduct.orderItems[0].price
    if (validationUser) {
      await wallet.updateOne(
        { userId: userId },
        { $inc: { walletAmount: walletPrice } }
      );
      await Wallet.findOneAndUpdate(
        { userId: userId },
        {
          $push: {
            'transactionHistory': {
              amount: walletPrice,
              PaymentType: 'Credit'
            }
          }
        }
      )
      return res.redirect('/userOrderPage')
    }
    const walletDAta = new wallet(({
      userId: userId,
      walletAmount: walletPrice
    }))
    await walletDAta.save()
    res.redirect('/userOrderPage')

  } catch (err) {
    console.log(err.message)
    res.status(400).send(err)


  }


}

//order canceled 

exports.ordersStatusCanceled = async (req, res) => {
  try {
    const orderId = req.query.orderId
    const productId = req.query.productId
    const userId = req.session.userId
    console.log('id', req.query.productId)


    const reason = req.body.reason
    const o = await Order.findOneAndUpdate({ "_id": orderId, 'orderItems.productId': productId }, { $set: { 'orderItems.$.cancelReason': reason } })
    console.log(o);




    await Product.updateOne({ _id: productId }, { $inc: { instock: 1 } })

    const orderProduct = await Order.findOneAndUpdate({ "_id": orderId, 'orderItems.productId': productId }, { $set: { "orderItems.$.orderStatus": "canceled" } })

    console.log('shah', orderProduct, orderProduct.paymentMethod);

    if (orderProduct.paymentMethod == 'online payment') {
      const walletPrice = orderProduct.orderItems[0].price
      await wallet.updateOne(
        { userId: userId },
        { $inc: { walletAmount: walletPrice } }
      );
      await Wallet.findOneAndUpdate(
        { userId: userId },
        {
          $push: {
            'transactionHistory': {
              amount: walletPrice,
              PaymentType: 'Credit'
            }
          }
        }
      )
      return res.redirect('/userOrderPage')
    }
    res.redirect('/userOrderPage')
  } catch (err) {
    res.status(400).send(err)
    console.log(err)
  }


}


// online payment


exports.paymentVerification = async (req, res, next) => {


  try {



    const userId = req.session.userId
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body
    console.log(razorpay_payment_id);
    console.log("hiii", req.body);


    const generated_signature = razorpay_order_id + "|" + razorpay_payment_id

    const except = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
      .update(generated_signature).digest("hex")

    if (except == razorpay_signature) {


      let userCart = await cartdb.aggregate([
        {
          $match: { userId: new mongoose.Types.ObjectId(userId) }
        },
        {
          $unwind: "$cartItems"
        },
        {
          $lookup: {
            from: "products",
            localField: "cartItems.productId",
            foreignField: "_id",
            as: "productDetails"

          }
        },
        {
          $lookup: {
            from: "offers",
            localField: "productDetails.offer",
            foreignField: "_id",
            as: "offer"

          }
        },
        // {
        //   $project: {
        //     userID: 1,
        //     cartItems: 1,
        //     productDetails: 1
        //   }
        // }
      ])


      console.log(userCart)

      let products = []

      userCart.forEach((datas) => {
        // destructuring 
        const data = datas.cartItems
        const productData = datas.productDetails[0]

        const t = datas.offer.length != 0 ? datas.offer[0].discount * datas.productDetails[0].lastprice / 100 : 0


        console.log('discount');

        products.push({
          productId: data.productId,
          quantity: data.quantity,
          pName: productData.pname,
          bName: productData.bname,
          cateogary: productData.cateogary,
          subTitle: productData.subtitle,
          descriptionHead: productData.descriptionheading,
          description: productData.description,
          price: productData.lastprice - t,
          mrp: productData.firstprice,
          discount: productData.discount,
          colour: productData.color,
          image: productData.image,
        })
      })


      const address = await Address.aggregate([{
        $unwind: "$address"
      }, { $match: { userId: new mongoose.Types.ObjectId(userId), 'address.defaultAddress': true } }])

      if (address.length == 0) {

        return res.redirect("/checkoutPage")

      }
      console.log(address[0].address.name);
      const ValueAddress = {
        name: address[0].address.name,
        phone: address[0].address.phoneNumber,
        address: address[0].address.address,
        city: address[0].address.city,
        postalCode: address[0].address.postalCode,
      };






      const order = new Order({
        userId: userId,
        orderItems: products,
        paymentMethod: "online payment",
        address: ValueAddress,
        totalAmount:req.session.totalAmount
      });

      await order.save()


      if (req.session.wallateUsed) {
        const findAmount = await Wallet.findOne({ userId: userId })
        console.log('klkl', findAmount);
        if (req.session.incrementWalletAmount < 0) {

          await Wallet.updateOne({ userId: userId }, { $set: { walletAmount: 0 } })
          await Wallet.findOneAndUpdate(
            { userId: userId },
            {
              $push: {
                'transactionHistory': {
                  amount: findAmount.walletAmount - 0,
                  PaymentType: 'Debit'
                }
              }
            }
          )

        } else {

          await Wallet.updateOne({ userId: userId }, { $set: { walletAmount: req.session.incrementWalletAmount } })
          await Wallet.findOneAndUpdate(
            { userId: userId },
            {
              $push: {
                'transactionHistory': {
                  amount: findAmount.walletAmount - req.session.incrementWalletAmount,
                  PaymentType: 'Debit'
                }
              }
            }
          )
        }

      }

      const orderId = order._id


      await cartdb.updateMany({ userId: userId }, { $set: { cartItems: [] } })


      if (req.session.wallateUsed) {

        if (req.session.incrementWalletAmount < 0) {

          await Wallet.updateOne({ userId: userId }, { $set: { walletAmount: 0 } })

        } else {

          await Wallet.updateOne({ userId: userId }, { $set: { walletAmount: req.session.incrementWalletAmount } })
        }

      }


      // stockManagment  

      const data = await Order.aggregate(
        [
          {
            '$match': {
              '_id': new mongoose.Types.ObjectId(orderId)
            }
          }

        ]
      )


      // for (const product of data[0].orderItems) {
      //   const qty = Number(product.quantity);
      //   const products = await Product.findOne(
      //     { _id: product.productId }
      //   )
      //   if (products.instock < qty) {
      //     return res.send("ordered failed No stock")
      //   }
      // }


      for (const product of data[0].orderItems) {
        const update = Number(product.quantity);
        await Product.findOneAndUpdate(
          { _id: product.productId },
          { $inc: { instock: -update } }
        )
      }

      // stockManagment 

      req.session.OrderSuccessPageManage = true

      req.session.checkOutPageVerification = true

      res.redirect('/orderSuccssessPage')


    } else {

      res.send("ordered failed")

    }

  } catch (err) {
    console.log(err)
    next(err)
    // res.send(err)
  }

}


exports.invoice = async (req, res, next) => {
  const id = req.query.id
  console.log('hiiiii', id);
  try {

    const order = await Order.findOne({ _id: id })
    // console.log(order);
    const d = order.orderItems
    const products = d.map((values) => {
      return {
        quantity: values.quantity,
        description: values.pName,
        'tax-rate': 0,
        price: values.price
      }
    })
    console.log('loll', products);
    console.log(d);
    res.json(
      {
        order,
        products
      }
    );

  } catch (error) {
    console.log(error);
    next(error)
  }

}



//axios 

exports.findOrders = async (req, res) => {
  const userId = req.query.id
  console.log(userId);
  console.log("hiii");
  try {


    const data = await Order.aggregate(
      [
        {
          '$match': {
            'userId': new mongoose.Types.ObjectId(userId)
          }
        },
        {
          '$unwind': {
            'path': '$orderItems'
          }
        },

      ]
    )
    // const data= await Order.find({userId:userId})
    console.log(data);
    res.send(data)
  } catch (err) {
    res.send(err)
  }

}


exports.findOrdersDetail = async (req, res) => {
  const id = req.query.id
  console.log(id);
  try {

    const data = await Order.aggregate(
      [
        {
          '$match': {
            '_id': new mongoose.Types.ObjectId(id)
          }
        },
        {
          '$unwind': {
            'path': '$orderItems'
          }
        },

      ]
    )
    console.log(data);

    res.send(data)
  } catch (err) {

    res.send(err)

  }
}



exports.findWalletDetails = async (req, res) => {

  const userId = req.query.id
  try {

    const data = await wallet.findOne({ userId: userId })
    console.log(data);
    res.send(data)

  } catch (err) {
    res.send(err)
  }


}