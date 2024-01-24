

var Userdb = require("../../model/User schema")
var otpdb = require("../../model/otp.schema")
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer")
const Mailgen = require("mailgen")
const Product = require("../../model/product.schema")
const Cateogary = require("../../model/cateogary.schema")
const cartdb = require('../../model/cart.schema');
const { default: mongoose } = require("mongoose");
const Wallet = require("../../model/walletSchema");
const { referralOffer } = require("../../services/adminrender");
const referralOfferDb = require('../../model/refferal.schema')
const shortid = require('shortid');
function deleteOtpFromdb() {
  otpdb.deleteOne({ _id: req.session.otpId });
};

const otpGenrator = () => {
  return `${Math.floor(1000 + Math.random() * 9000)}`;
};

const sendOtpMail = async (req, res) => {
  console.log("kloll");
  const otp = otpGenrator();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
  });

  const MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Gocart",
      link: "https://mailgen.js/"
    },
  });

  const response = {
    body: {
      name: req.session.user,
      intro: "Your OTP for Gocart verification is:",
      table: {
        data: [
          {
            OTP: otp,
          },
        ],
      },
      outro: "Looking forward to doing more business",
    },
  };

  const mail = MailGenerator.generate(response);

  const message = {
    from: process.env.AUTH_EMAIL,
    to: req.session.user,
    subject: "Gocart OTP Verification",
    html: mail,
  };

  try {
    const newOtp = new otpdb({
      email: req.session.user,
      otp: otp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 60000,
    });
    const data = await newOtp.save();
    console.log(data);

    req.session.otpId = data._id;
    console.log(req.session.otpId);

    // res.status(200).redirect("/register2");
    await transporter.sendMail(message);
  } catch (error) {
    console.log(error);
  }
};


// resend otp  


const ResendotpGenrator = () => {
  return `${Math.floor(1000 + Math.random() * 9000)}`;
};

const ResendsendOtpMail = async (req, res) => {
  console.log("kloll");
  const otp = ResendotpGenrator();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
  });

  const MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Gocart",
      link: "https://mailgen.js/"
    },
  });

  const response = {
    body: {
      name: req.session.user,
      intro: "Your OTP for Gocart verification is:",
      table: {
        data: [
          {
            OTP: otp,
          },
        ],
      },
      outro: "Looking forward to doing more business",
    },
  };

  const mail = MailGenerator.generate(response);

  const message = {
    from: process.env.AUTH_EMAIL,
    to: req.session.user,
    subject: "Gocart OTP Verification",
    html: mail,
  };

  try {
    const newOtp = new otpdb({
      email: req.session.user,
      otp: otp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 60000,
    });
    const data = await newOtp.save();
    console.log(data);

    req.session.otpId = data._id;
    console.log(req.session.otpId);
    res.status(200).redirect("/register2");
    await transporter.sendMail(message);
  } catch (error) {
    console.log(error);
  }
};


//create and save new user  signup


exports.create = async (req, res) => {

  try {

    console.log(req.body);







    if (req.body.Email) {
      const existingUser = await Userdb.findOne({ email: req.body.Email });

      if (existingUser) {
        req.session.emailunique = "Email is already taken"
        // res.status(400).send({ message: "Email is already taken" });

        if (req.query.referralCode) {
          return res.redirect(`/register3?referralCode=${req.query.referralCode}`);
        }
        return res.redirect('/register3');
      }
    }

    let code = req.query.referralCode
    console.log(req.query.referralCode);
    if (req.query.referralCode) {

      const userReferral = await Userdb.findOne({ referralCode: code })
      console.log(userReferral);

      if (!userReferral) {

        return res.redirect('/register3')

      }
      const referral = await referralOfferDb.findOne({ expiredate: { $gte: Date.now() } })

      console.log(referral);
      if (!referral) {

        return res.redirect('/register3')

      }



      req.session.user = req.body.Email

      console.log(req.session.user);

      req.session.userData = req.body
      console.log(code, 'lolppjhgf');
      req.session.referralCode = code

      await sendOtpMail(req, res);

      return res.redirect('/register2')

    }

    req.session.user = req.body.Email

    console.log(req.session.user);

    req.session.userData = req.body

    await sendOtpMail(req, res);

    res.redirect('/register2')

  } catch (err) {

    res.send(err)

  }

}



// login verification  

exports.validation = async (req, res) => {


  //  const userhashedPassword = await bcrypt.hash(req.body.password, 10);
  // req.session.emalevalue = req.body.email
  // req.session.passwordValue = req.body.password
  const a = {
    email: req.body.email,
    password: req.body.password
  }

  const foundUser = await Userdb.findOne({ email: a.email });

  if (!foundUser) {
    req.session.message = "User is not found";
    return res.redirect("/login")
  }


  if (foundUser.email === a.email && foundUser.password == a.password) {
    if (await Userdb.findOne({ email: a.email, blocked: true })) {
      res.send("user is blocked")
      return
    }
    const l = await Userdb.updateOne({ email: foundUser.email }, { $set: { status: "Active" } })

    req.session.authentication = true
    req.session.logoutemail = foundUser.email
    req.session.userId = foundUser._id
    req.session.message = ''

    res.redirect("/")
  } else {

    req.session.message = "password is incoreect"
    res.redirect("/login")

  }

}





exports.logout = async (req, res) => {
  console.log("hi")
  try {
    await Userdb.updateOne({ email: req.session.logoutemail }, { $set: { status: "Inactive" } })
    delete req.session.authentication
    delete req.session.userId
    res.redirect("/")
  } catch (err) {
    console.log(err)

    res.status(500)
  }

}



//registraion otp



exports.otp = async (req, res) => {

  if (!req.body.email) {

    req.session.Otpeerrmessage = "This field is required"
    // res.status(400).send({ message: "hi you entered any thing" })
    return res.redirect('/register1')
  }

  const usermail = await Userdb.findOne({ email: req.body.email })

  if (usermail) {
    req.session.findEmail = "This Email is allready use"
    return res.redirect('/register1')
  }

  req.session.user = req.body.email

  sendOtpMail(req, res);



}




//authentication

exports.otpverification = async (req, res) => {

  try {

    console.log("lklklk");
    console.log(req.session.otpId);
    if (!req.body) {
      return res.status(400).send({ message: "hi you entered any thing" })

    }
    const otpUser = await otpdb.findOne({ _id: req.session.otpId });
    console.log(otpUser);
    const otp = req.body.otp

    if (otp == otpUser.otp) {
      console.log("kerrr");
      const userData = req.session.userData
      console.log(userData, 'lo;mbg', req.session.referralCode);


      if (req.session.referralCode) {

        console.log("shahamPriyan");
        const user = new Userdb({
          name: userData.name,
          email: userData.Email,
          password: userData.password,
          referralCode: shortid.generate(),
          referredBy: req.session.referralCode
        })
        await user.save()

        console.log(user._id, req.session.referralCode, 'lll');

        const walletData = new Wallet({
          userId: user._id
        })

        await walletData.save()


        const referalAmount = await referralOfferDb.findOne({})

        console.log(referalAmount.referralUserRewards);

        await Wallet.findOneAndUpdate(
          { userId: user._id },
          {
            $inc: { walletAmount: referalAmount.referralUserRewards },
            $push: {
              'transactionHistory': {
                amount: referalAmount.referralUserRewards,
                PaymentType: 'Credit'
              }
            }
          }
        );

        const referalUser = await Userdb.findOneAndUpdate({ referralCode: req.session.referralCode },{$inc:{referralCount:1}})
        console.log(referalUser)
        await Wallet.updateOne(
          { userId: referalUser._id },
          {
            $inc: { walletAmount: referalAmount.referralRewards },
            $push: {
              'transactionHistory': {
                amount: referalAmount.referralRewards,
                PaymentType: 'Credit'
              }
            }
          }
        );

        return res.redirect("/login")


      }



      const user = new Userdb({
        name: userData.name,
        email: userData.Email,
        password: userData.password,
        referralCode: shortid.generate()
      })

      await user.save()

      console.log(user._id);
      const walletData = new Wallet({
        userId: user._id
      })

      await walletData.save()

      res.redirect("/login")


      // user
      // .save(user)
      // .then(data => {
      //   res.redirect("/login")       
      // })
      // .catch(err => {
      //   res.status(400).send({
      //     message: err.message || "some error occured while creating option "
      //   });
      // });



    } else {
      req.session.otpValidation = "your otp ise error"
      res.redirect('/register2')
    }

  } catch (err) {
    res.send(err)
  }



}

exports.resendOtp = (req, res) => {

  // deleteOtpFromdb()
  ResendsendOtpMail(req, res);

}


// forgot otp mailer function 


const forgototpsendOtpMail = async (req, res) => {
  const otp = otpGenrator();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
  });

  const MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Gocart",
      link: "https://mailgen.js/"
    },
  });

  const response = {
    body: {
      name: req.session.forgotuser,
      intro: "Your OTP for Gocart verification is:",
      table: {
        data: [
          {
            OTP: otp,
          },
        ],
      },
      outro: "Looking forward to doing more business",
    },
  };

  const mail = MailGenerator.generate(response);

  const message = {
    from: process.env.AUTH_EMAIL,
    to: req.session.forgotuser,
    subject: "Gocart OTP Verification",
    html: mail,
  };

  try {
    const newOtp = new otpdb({
      email: req.session.forgotuser,
      otp: otp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 60000,
    });
    const data = await newOtp.save();
    req.session.forgototpTd = data._id;
    res.status(200).redirect("/forgotpassword2");
    await transporter.sendMail(message);
  } catch (error) {
    console.log(error);
  }
};



// forgot otp   



exports.forgototp = async (req, res) => {

  if (!req.body) {
    res.status(400).send({ message: "hi you entered any thing" })
    return
  }
  req.session.forgotuser = req.body.email

  const forgotuserb = await Userdb.findOne({ email: req.session.forgotuser });

  if (!forgotuserb) {
    console.log(" the mail")
    return
  }



  forgototpsendOtpMail(req, res);



}


// verification otp

exports.forgototp2 = async (req, res) => {

  if (!req.body) {
    return
  }

  const forgototpUser = await otpdb.findOne({ _id: req.session.forgototpTd });
  console.log(forgototpUser)

  if (forgototpUser.otp == req.body.otp) {
    res.redirect("/forgotpassword3")
  } else {
    res.send("error")
  }
}



//update password

exports.updatepassword = async (req, res) => {
  console.log("hi")


  //  if(!req.body){
  //   console.log("hi")
  //   return 
  //  }
  //  if(!req.body.password==req.body.confirmPassword){
  //   console.log("hill")
  //   return
  //  } 
  if (!req.body) {
    console.log("Error: Request body is missing");
    // You might want to send an error response to the client
    return res.status(400).json({ error: "Request body is missing" });
  }

  const { password, confirmPassword } = req.body;

  if (!(password === confirmPassword)) {
    console.log("Error: Passwords do not match");
    // You might want to send an error response to the client
    return res.status(400).json({ error: "Passwords do not match" });
  }

  //hased password 

  //  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  console.log(req.session.forgotuser)



  const updateuser = await Userdb.updateOne({ email: req.session.forgotuser }, { $set: { password: req.body.password } });
  console.log(updateuser)

  //  await Userdb.updateOne({ email:  req.session.forgotuser},{$set:{password:hashedPassword}})

  //  const uu= await Userdb.findOne({ email:  req.session.forgotuser})

  res.redirect("/login")


}


exports.singleproductpageaxios = async (req, res) => {
  const productId = req.query.id
  const userId = req.query.userId

  try {
    if (userId === "undefined") {
      console.log('hiii')
      const product = await Product.find({ _id: productId })
      const result = { product }
      return res.send(result)
    }

    const productCart = await cartdb.findOne(
      { userId: userId, "cartItems.productId": productId },
    );

    const product = await Product.find({ _id: productId })



    const result = { product, productCart }

    res.send(result)

  } catch (err) {

    res.status(500).send(err)

  }


}


exports.addtoCart = async (req, res) => {

  const productId = req.query.id
  const userId = req.session.userId


  if (typeof userId === "undefined") {
    console.log('hiii')
    return res.redirect('/login')

  }



  let checkCart = await cartdb.findOne({ userId: userId, })
  if (!checkCart) {
    checkCart = new cartdb({
      userId: userId,
      cartItems: [{
        productId: productId
      }]
    })
  } else {
    checkCart.cartItems.push({
      productId: productId
    })
  }
  // save user in db     
  console.log(checkCart)
  checkCart
    .save()
    .then(data => {
      res.redirect("/cart")
    })
    .catch(err => {
      res.status(400).send({
        message: err.message || "some error occured while creating option "
      });
    });
}

exports.removeCart = async (req, res) => {
  const userID = req.session.userId
  const productId = req.query.id
  try {

    const d = await cartdb.findOne({ userId: userID })
    console.log(d)
    const index = d.cartItems.findIndex((value) => {
      return value.productId.toString() === productId;
    });
    console.log(index)

    d.cartItems.splice(index, 1)
    await d.save()
    res.redirect('/cart')
  } catch (err) {
    res.status(500).send(err)
  }

}

exports.updateQuantity = async (req, res) => {
  console.log('klkl');
  const userId = req.session.userId
  const productId = req.query.pid
  const qty = req.query.qty
  console.log(qty);
  try {

    const product = await Product.findOne({ _id: productId })
    console.log(product.instock);

    if (product.instock < qty) {
      console.log('shahaa');
      const d = await cartdb.updateOne({ userId: userId, 'cartItems.productId': productId }, { $set: { 'cartItems.$.quantity': qty } })
      req.session.outOfStock = 'out of stock'
      return res.send({ url: '/cart', message: 'outOfStock' })

    }
    const d = await cartdb.updateOne({ userId: userId, 'cartItems.productId': productId }, { $set: { 'cartItems.$.quantity': qty } })
    console.log(d);
    res.send(true);
  } catch (err) {
    res.send(err)
  }



}



exports.userUpdate = async (req, res) => {
  console.log("hiii");
  const userId = req.session.userId
  console.log(req.body)
  try {
    const user = await Userdb.updateOne({ _id: userId }, { $set: { name: req.body.name, email: req.body.email } })
    console.log(user);
  } catch (err) {
    res.send(err)
  }


}

exports.updateUserPassword = async (req, res) => {
  const userId = req.session.userId

  if (!req.body.oldPassword & !req.body.newPassword & !req.body.confirmPassword) {
    req.session.updatePasswordValidation = "This Field is required"
    return res.redirect('/updateUserPassword')
  }
  console.log(userId);
  const userOldPassword = await Userdb.findOne({ _id: userId })

  if (req.body.oldPassword !== userOldPassword.password) {
    req.session.oldPasswordValidation = "The Password is not Match"
    return res.redirect('/updateUserPassword')
  }
  var minLength = 8;
  var maxLength = 12;
  // if (req.body.newPassword.length !<= minLength || req.body.newPassword.length !== maxLength) {

  //   req.session.passwordValidation = `Password must be between ${minLength} and ${maxLength} characters long.`;
  //   return res.redirect('/updateUserPassword');
  // }
  if (req.body.newPassword.length < minLength || req.body.newPassword.length > maxLength) {
    req.session.passwordValidation = `Password must be between ${minLength} and ${maxLength} characters long.`;
    return res.redirect('/updateUserPassword');
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    req.session.confirmPasswordValidation = "The Password is not Match"
    return res.redirect('/updateUserPassword')
  }
  try {


    const d = await Userdb.updateOne({ _id: userId }, { $set: { password: req.body.newPassword } })
    console.log(d);
    res.redirect("/logout")


  } catch (err) {

    res.send(err)

  }


}



// axios  

exports.findproduct = async (req, res) => {
  try {
    // const userId=req.session.userId
    // const user=await Userdb.find({_id:})  
    if (req.session.blokedAuth == true) {
      return res.redirect('/login')
    }

    const product = await Product.find({ status: true }).populate('offer').sort({ popularProducts: -1 })
    console.log('mmm', product);
    res.send(product)

  } catch (err) {

    res.status(500).send(err)

  }



}


exports.findcateogary = async (req, res) => {

  try {
    const product = await Cateogary.find({ status: true })
    res.send(product)

  } catch (err) {

    res.status(500).send(err)

  }


}


exports.cateogaryproductpage = async (req, res) => {
  let CateogaryName = req.query.category != 'All' ? req.query.category : '';
  console.log('ll', CateogaryName);
  const Max = Number(req.query.Max)
  const Min = Number(req.query.Min)
  const sort = req.query.sort
  console.log(req.query);
  console.log("shaham");
  console.log(Max);


  if (CateogaryName == '' || CateogaryName && !Min && !Max && !sort) {
    console.log("first");
    try {
      console.log(CateogaryName);
      const product = await Product.find({ cateogary: { $regex: CateogaryName, $options: 'i' }, status: true }).populate('offer')
      const categoary = await Cateogary.find({ status: true })
      const data = { product, categoary, CateogaryName }
      return res.send(data)
      console.log("Product:", product);

    } catch (err) {

      res.status(500).send(err)

    }

  }

  let product;

  if (CateogaryName && Min && Max && sort) {

    if (sort == 'low-to-high') {

      console.log('shahamSalam');

      product = await Product.find(
        {
          cateogary: CateogaryName, status: true,
          $and: [{ lastprice: { $gte: Min } }, { lastprice: { $lte: Max } }]
        }
      ).populate('offer').sort({ lastprice: 1 })
      console.log(';lll', product);
    } else {

      product = await Product.find(
        {
          cateogary: CateogaryName, status: true,
          $and: [{ lastprice: { $gte: Min } }, { lastprice: { $lte: Max } }]
        }

      ).populate('offer').sort({ lastprice: -1 })


    }




  } else if (CateogaryName && sort) {

    if (sort == 'low-to-high') {


      product = await Product.find(
        { cateogary: CateogaryName, status: true }).populate('offer').sort({ lastprice: 1 })


    } else {

      product = await Product.find(
        { cateogary: CateogaryName, status: true }).populate('offer').sort({ lastprice: -1 })

    }

  } else if (CateogaryName && Min && Max) {


    product = await Product.find(
      {
        cateogary: CateogaryName, status: true,
        $and: [{ lastprice: { $gte: Min } }, { lastprice: { $lte: Max } }]
      }

    ).populate('offer')



  }


  const categoary = await Cateogary.find({ status: true })
  const data = { product, categoary, CateogaryName }
  res.send(data)


}

exports.findUser = async (req, res) => {

  try {
    const user = await Userdb.findOne({ email: req.query.user });
    const referralOffer=await referralOfferDb.findOne({})

    const data={user,referralOffer} 
    console.log(req.query.user)
    res.send(data)

  } catch (err) {
    res.status(500).send(err)
  }

}

// show cart 

exports.findCart = async (req, res) => {
  const userId = req.query.id
  console.log(userId)
  console.log("hekkk")
  try {
    console.log("lll")

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
          as: "offers"

        },
      }
      // {
      //   $project: {
      //     userID: 1,
      //     cartItems: 1,
      //     productDetails: 1
      //   }
      // }
    ])
    console.log('shaham', userCart)
    res.send(userCart)
  } catch (err) {
    res.send(err)
  }
}

// show update user

exports.updateUser = async (req, res) => {

  const id = req.query.updateUser
  try {
    const data = await Userdb.findOne({ _id: id })
    res.send(data)
  } catch (err) {
    res.send(err)
  }

}


exports.data = (req, res) => {
  console.log('hiii');
}


// search  

exports.search = async (req, res) => {
  console.log('vishnu', req.query.key);
  const product = await Product.find({
    "$or": [
      { pname: { $regex: req.query.key }, status: true },
      { bname: { $regex: req.query.key }, status: true }
    ]
  }).populate('offer')

  const CateogaryName = 'All'
  const categoary = await Cateogary.find({ status: true })
  const data = { product, categoary, CateogaryName }

  console.log('dhaham', data);
  res.send(data)



}


exports.verifyReferral = async (req, res) => {

  try {
    console.log('j');
    const code = req.query.referralCode
    console.log(code);
    if (code == 'undefined') {
      return res.send({
        message: null
      })
    }

    const userReferral = await Userdb.findOne({ referralCode: code })

    if (!userReferral) {

      return res.send({
        message: 'invalid referalcode'
      })

    }
    const referral = await referralOfferDb.findOne({ expiredate: { $gte: Date.now() } })

    if (!referral) {
      return res.send({
        message: 'expired'
      })
    }

    return res.send({
      referralCodeStatus: true,
      referralCode: code
    })


  } catch {

    res.send(err)

  }

}

