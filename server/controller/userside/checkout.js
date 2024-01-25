const Address = require("../../model/address.schema");
const cartdb = require("../../model/cart.schema");
const { default: mongoose } = require("mongoose");

exports.ckeckout = async (req, res) => {
  const userId = req.query.id;
  console.log(userId);
  try {
    const addressData = await Address.find({ userId: userId });
    // const addresses = await Address.find({ userId: userId, 'address.defaultAddress': false });

    console.log(addressData);

    var address = addressData[0].address;

    res.send(address);
  } catch (err) {
    res.send(err);
  }
};

exports.ckeckoutCart = async (req, res) => {
  const userId = req.query.id;
  console.log(userId);
  try {
    console.log("lol");
    let userCart = await cartdb.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) },
      },
      {
        $unwind: "$cartItems",
      },
      {
        $lookup: {
          from: "products",
          localField: "cartItems.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $lookup: {
          from: "offers",
          localField: "productDetails.offer",
          foreignField: "_id",
          as: "offers",
        },
      },
      // {
      //   $project:{
      //     userID:1,
      //     cartItems:1,
      //     productDetails:1
      //   }
      // }
    ]);
    console.log(userCart);
    console.log("lolkl");
    res.send(userCart);
  } catch (err) {
    res.send(err);
  }
};
