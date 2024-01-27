const Product = require("../../model/product.schema")

const Cateogary = require("../../model/cateogary.schema")
const CoupenManagment = require('../../model/coupenManagmentSchema')
const Offer = require('../../model/offer.schema')
const Userdb = require("../../model/User schema")
const Order = require('../../model/order.schema')
const CsvParser = require('json2csv').Parser
const { default: mongoose } = require("mongoose")
const referralOfferDb=require('../../model/refferal.schema')
exports.verification = (req, res) => {


  const a = {
    adminName: "shaham",
    adminPassword: "9995589030"
  }
  const { adminName, adminPassword } = a

  console.log(a.adminName)


  const b = {
    name: req.body.name,
    password: req.body.password

  }

  const { name, password } = b

  if (name == adminName && password == adminPassword) {
    req.session.admin = true
    res.redirect("/admin/")
  } else {
    req.session.adminerrmessage = "pass"
  }

}

// exports.addproduct = (req, res) => {

//   //  if(!req.body.pname){
//   //   req.session.pname="the pname is required"
//   //  }
//   //  if(!req.body.bname){
//   //   req.session.bname="the bname is required"
//   //  }
//   //  if(!req.body.category){
//   //   req.session.category="the category is required"
//   //  }
//   //  if(!req.body.subtitle){
//   //   req.session.subtitle="the subtitle is required"
//   //  }
//   //  if(!req.body.descriptionheading){
//   //   req.session.descriptionheading="the descriptionheading is required"
//   //  }
//   //  if(!req.body.description){
//   //   req.session.description="the description is required"
//   //  }
//   //  if(!req.body.firstprice){
//   //   req.session.firstprice="the firstprice is required"
//   //  }
//   //  if(!req.body.lastprice){
//   //   req.session.lastprice="the lastprice is required"
//   //  }
//   //  if(!req.body.discount){
//   //   req.session.discount="the discount is required"
//   //  }
//   //  if(!req.body.color){
//   //   req.session.color="the color is required"
//   //  }
//   //  if(!req.body.instock){
//   //   req.session.instock="the instock is required"
//   //  }
//   //  if(!req.body.images){
//   //   req.session.images="the images is required"
//   //  }

//   // if(req.session.pname||req.session.bname|| req.session.category||req.session.subtitle||req.session.descriptionheading|| req.session.description||req.session.firstprice|| req.session.lastprice||
//   //   req.session.discount||req.session.color||req.session.instock||req.session.images){
//   //     res.redirect("/admin/addproduct")  
//   //  }

//   console.log(req.body.pname + "this is body")

//   const file = req.files
//   const images = file.map((values) => `/img/${values.filename}`);
//   console.log(file);






//   // save in db 

//   const product = new Product({
//     pname: req.body.pname,
//     bname: req.body.bname,
//     cateogary: req.body.category,
//     subtitle: req.body.subtitle,
//     descriptionheading: req.body.descriptionheading,
//     description: req.body.description,
//     firstprice: req.body.firstprice,
//     lastprice: req.body.lastprice,
//     discount: req.body.discount,
//     color: req.body.color,
//     instock: req.body.instock,
//     image: images
//   })

//   product
//     .save(product)
//     .then(data => {
//       console.log("correct")
//       res.redirect("/admin/productManagment")
//     }).catch(err => {
//       console.log("heloo")
//       res.status(400).send({
//         message: err.message || "some error occured while creating option "
//       });
//     });

// }


const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const { log } = require("console")
const { resolveSoa } = require("dns")

exports.addproduct = async (req, res) => {


  const product = new Product({
    pname: req.body.pname,
    bname: req.body.bname,
    cateogary: req.body.category,
    subtitle: req.body.subtitle,
    descriptionheading: req.body.descriptionheading,
    description: req.body.description,
    firstprice: req.body.firstprice,
    lastprice: req.body.lastprice,
    discount: req.body.discount,
    color: req.body.color,
    instock: req.body.instock,
    image: []
  });

  try {

    await fs.mkdir(path.join(__dirname, 'public', 'img'), { recursive: true });

    // Process and save each image using Sharp
    await Promise.all(
      req.files.map(async (file) => {
        const imagePath = `/img/${file.filename}`;

        // Crop image to 300x300 pixels (example size)
        await sharp(file.path)
          .resize(200, 200)
          .toFile(path.join(__dirname, 'public', imagePath));

        product.image.push(imagePath);
      })
    );

    // Save the product in the database
    await product.save();

    console.log('Product saved successfully');
    res.redirect('/admin/productManagment');
  } catch (err) {
    console.log('Error saving product:', err.message);
    res.status(400).send({
      message: err.message || 'Some error occurred while creating product.',
    });
  }
};



exports.deleteproduct = async (req, res) => {

  const deleteid = req.query.id
  console.log(deleteid);
  const d = await Product.updateOne({ _id: deleteid }, { $set: { status: false } })
  res.redirect("/admin/productManagment")
}



exports.findunlistproductaxios = async (req, res) => {
  await Product.find({ status: false })
    .then(product => {
      res.send(product)
    }).catch(err => {
      res.status(500).send({ message: err.message })
    })
}

exports.recycleproduct = async (req, res) => {
  const recycleid = req.query.id
  console.log(recycleid);
  await Product.updateOne({ _id: recycleid }, { $set: { status: true } })
  res.redirect("/admin/unlistproduct")
}



// axios  

exports.findproduct = async (req, res) => {

  const page = req.query.page;
  const perPage = 4;
  const skip = parseInt(Math.ceil((page - 1) * Number(perPage)));
  console.log(skip, page, perPage);


  const product = await Product.find({ status: true }).skip(skip).limit(perPage);
  let countDoc = await Product.find({ status: true }).count();

  countDoc = Math.ceil(Number(countDoc) / perPage);

  console.log(product);
  const result = {
    product,
    countDoc
  }
  res.send(result)


}

exports.findeditproduct = async (req, res) => {

  req.session.editid = req.query.id

  const data = await Product.findOne({ _id: req.session.editid })
    .then(data => {
      if (!data) {
        res.status(404).send({ message: `dcannot  user with ${id}.may be not user found` })
      } else {
        res.send(data)
      }
    }).catch(err => {
      res.status(500).send({ message: err.message })
    })

}


exports.editproduct = async (req, res) => {
  const editid = req.query.id
  const file = req.files
  console.log('arjun', req.body);
  console.log(file);
  const images = file.map((values) => `/img/${values.filename}`);

  const dd = await Product.updateOne({ _id: editid }, {
    $set: {
      pname: req.body.pname,
      bname: req.body.bname,
      cateogary: req.body.category,
      subtitle: req.body.subtitle,
      descriptionheading: req.body.descriptionheading,
      description: req.body.description,
      firstprice: req.body.firstprice,
      lastprice: req.body.lastprice,
      discount: req.body.discount,
      color: req.body.color,
      instock: req.body.instock,

    }
  })

  if (file.length == 0) {

    return res.redirect("/admin/productManagment")

  }

  await Product.updateOne({ _id: editid }, { $push: { image: images } })

  res.redirect("/admin/productManagment")

}


exports.editProductDeleteImg = async (req, res) => {


  try {

    const imgName = req.query.name
    let id = req.query.id
    console.log(imgName, id);
    const data = await Product.updateOne({ _id: id }, { $pull: { image: imgName } })
    console.log(data);
    res.redirect(`/admin/editproduct?id=${id}`)

  } catch (err) {
    res.send(err)
  }


}


// cateogary managment  

exports.addcateogary = async (req, res) => {

  if (!req.body) {
    res.status(400).send({ message: "hi you entered any thing" })
    return
  }

  const categoryName = req.body.Category.toLowerCase();

  const cateogaryData = await Cateogary.findOne({ categary: categoryName })
  console.log("dhub");
  if (cateogaryData !== null) {
    req.session.cateogaryerr = "already use this cateogary"
    return res.redirect("/admin/addCateogaryManagment")
  }
  const file = req.files
  const images = file.map((values) => `/img/${values.filename}`);
  console.log(file);



  // save in db       
  const cateogary = new Cateogary({
    categary: req.body.Category,
    image: images
  })
  cateogary
    .save(cateogary)
    .then(data => {
      console.log("correct")
      res.redirect("/admin/cateogaryManagment")
    }).catch(err => {
      console.log("heloo")
      res.status(400).send({
        message: err.message || "some error occured while creating option "
      });
    });

}


exports.findCateogary = async(req, res,next) => {

try{


  const page = req.query.page;
  const perPage =5;
  const skip = parseInt(Math.ceil((page - 1) * Number(perPage)));
  console.log(skip,page,perPage);  

  const category=  await Cateogary.find({ status: true }).skip(skip).limit(perPage)
  let countDoc= await Cateogary.find({ status: true }).count()

  countDoc=Math.ceil(Number(countDoc) / perPage);
  
  const data={category,countDoc}

  res.send(data) 

  
  // .then(catrogary => {
  //   console.log(catrogary)
    
  // }).catch(err => {
  //   res.status(500).send({ message: err.message })
  // })




}catch(err){

  console.log(err);
  next()

}

 



 

}

exports.editcateogary = async (req, res) => {

  const editid = req.query.id
  const file = req.files
  console.log(file);
  const images = file.map((values) => `/img/${values.filename}`);
  try {
    const dd = await Cateogary.updateOne({ _id: editid }, { $set: { categary: req.body.Category } })

    if (file.length == 0) {

      return res.redirect("/admin/cateogaryManagment")
    }

    if (!file) {
      console.log("hii")
    } else {
      await Cateogary.updateOne({ _id: editid }, { $push: { image: images } })
    }


    res.redirect("/admin/cateogaryManagment")
  } catch (err) {
    res.send("internal error")
  }



}

exports.admindeleteImgcateogary = async (req, res) => {

  try {

    const imgName = req.query.name
    let id = req.query.id
    console.log(imgName, id);
    const data = await Cateogary.updateOne({ _id: id }, { $pull: { image: imgName } })
    console.log(data);
    res.redirect(`/admin/editcateogary?id=${req.query.id}`)
  } catch (err) {
    res.send(err)
    console.log(err);
  }
}






exports.unlistcateogary = async (req, res) => {

  const deleteid = req.query.id
  console.log(deleteid);
  const d = await Cateogary.updateOne({ _id: deleteid }, { $set: { status: false } })
  console.log(d)
  res.redirect("/admin/cateogaryManagment")
}

exports.findUnlistCateogary = (req, res) => {

  Cateogary.find({ status: false })
    .then(catrogary => {
      res.send(catrogary)
    }).catch(err => {
      res.status(500).send({ message: err.message })
    })

}

exports.unlistrecyclecateogary = async (req, res) => {

  const recycleid = req.query.id
  const d = await Cateogary.updateOne({ _id: recycleid }, { $set: { status: true } })
  res.redirect("/admin/unlistCateogaryManagment")

}

exports.findeditCateogary = async (req, res) => {

  const cateogaryeditid = req.query.id
  console.log(cateogaryeditid)
  const data = await Cateogary.findOne({ _id: cateogaryeditid })
    .then(data => {

      if (!data) {
        res.status(404).send({ message: `dcannot  user with ${id}.may be not user found` })
      } else {
        res.send(data)
      }
    }).catch(err => {
      res.status(500).send({ message: err.message })
    })


}

exports.findaddProductCateogary=(req, res) => {



  Cateogary.find({ status: true })
    .then(catrogary => {
      console.log(catrogary)
      res.send(catrogary)
    }).catch(err => {
      res.status(500).send({ message: err.message })
    })

}



// axios user


exports.finduser = async (req, res,next) => {

  try {

    const page = req.query.page;
    const perPage = 7;
    const skip = parseInt(Math.ceil((page - 1) * Number(perPage)));
    console.log(skip, page, perPage);


    const userData = await Userdb.find().skip(skip).limit(perPage)
    let countDoc = await Userdb.find().count();
    countDoc = Math.ceil(Number(countDoc) / perPage);
    console.log('shuvam',countDoc);

   const data={userData,countDoc} 
    res.send(data)

  } catch (err) {
    console.log(err);
    next()
  }


  // .then(user => {
  //   console.log(user)
  //   res.send(user)
  // }).catch(err => {
  //   res.status(500).send({ message: err.message })
  // })

}

// blocked user

exports.blockeduser = async (req, res) => {
  const blockedid = req.query.id
  try {
    req.session.blokedAuth = true
    await Userdb.updateOne({ _id: blockedid }, { $set: { blocked: true } })


    res.redirect("/admin/UserManagment")
  } catch (err) {
    res.send(err)
  }

}

//unblocked user 

exports.unblockUser = async (req, res) => {
  const unblockid = req.query.id
  try {
    await Userdb.updateOne({ _id: unblockid }, { $set: { blocked: false } })
    req.session.blokedAuth = false
    res.redirect("/admin/UserManagment")
  } catch (err) {
    res.send(err)
  }
}

exports.logout = (req, res) => {
  req.session.admin = true
  res.redirect("/adminlogin")
}

// order managment 

exports.updateOrderStatus = async (req, res) => {
  const id = req.query.id
  console.log(id);

  try {
    const status = req.body.status
    console.log(status);
    await Order.updateOne({ "orderItems._id": id }, { $set: { "orderItems.$.orderStatus": status } })
    res.redirect('/admin/orderManagment')
  } catch (err) {
    res.status(500).send(err)
  }
}

//axioss  

exports.findOrders = async (req, res,next) => {
  console.log("hiiilkl,m");
//   console.log(req.query,'klkooko');
//  if(req.query.status){
//   const status=req.query.status
//   const data = await Order.aggregate(
//     [
     
//       {
//         '$unwind': {
//           'path': '$orderItems'
//         }
//       },
//       {
//         '$match': {
//             'orderItems.orderstatus':'delivere'
//         }
//       },
//       {
//         '$lookup': {
//           'from': 'userdbs',
//           'localField': 'userId',
//           'foreignField': '_id',
//           'as': 'userDetails'
//         }
//       },
//     ]
//   )

//   console.log('njd');
//   res.send(data)

//  }
  try {

    const data = await Order.aggregate(
      [
        {
          '$match': {

          }
        },
        {
          '$unwind': {
            'path': '$orderItems'
          }
        },
        {
          '$lookup': {
            'from': 'userdbs',
            'localField': 'userId',
            'foreignField': '_id',
            'as': 'userDetails'
          }
        },
      ]
    )
    console.log(data);
    res.send(data)


  } catch (err) {
    console.log(err);
    next(err)
    // res.send(err)

  }

}

exports.findorderDetail = async (req, res) => {

  try {

    const id = req.query.id
    console.log('hhhh', id);
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



//coupen Managment  


exports.adminAddCoupenManagmentForm = async (req, res) => {
  console.log('hiii');
  console.log(req.body);


  const { CoupenCode, discount, expiredDate, minPurchaseAmt, maxRedimabelAmount } = req.body

  const now = new Date();

  console.log(now);



  if (CoupenCode) {
    try {
      const foundCoupenCode = await CoupenManagment.findOne({ coupenCode: CoupenCode })
      if (foundCoupenCode) {
        req.session.Coupenerrmsg = 'Coupon code already exists. Please choose a different one.'
        return res.redirect('/admin/addCoupenManagment')
      }
    } catch (err) {
      res.send(err)
    }
  }



  const data = new CoupenManagment({

    coupenCode: CoupenCode,
    discountPercentage: discount,
    expiredDate: expiredDate,
    minPurchaseAmt: minPurchaseAmt,
    maxRedimabelAmount: maxRedimabelAmount

  })

  data
    .save(data)
    .then(data => {
      res.redirect("/admin/coupenManagment")
    })
    .catch(err => {
      res.status(400).send({
        message: err.message || "some error occured while creating option "
      });
    });



}


exports.admindeleteCoupenManagment = async (req, res) => {

  console.log('delteed');

  const id = req.query.deletId

  try {

    const D = await CoupenManagment.updateOne({ _id: id }, { $set: { status: false } })
    console.log(D);
    res.redirect('/admin/coupenManagment')

  } catch (err) {

    res.send(err)

  }



}

exports.adminEditCoupenManagmentPut = async (req, res) => {
  console.log('hiiiiShaham', req.body);
  const id = req.query.id
  const CoupenCode = req.body.CoupenCode
  const discount = Number(req.body.discount)
  const expiredDate = req.expiredDate
  const minPurchaseAmt = Number(req.body.minPurchaseAmt)
  const maxRedimabelAmount = Number(req.body.maxRedimabelAmount)
  console.log(typeof (minPurchaseAmt));
  try {

    const d = await CoupenManagment.updateOne({ _id: id }, {
      $set: {
        coupenCode: CoupenCode,
        discountPercentage: discount,
        expiredDate: expiredDate,
        minPurchaseAmt: minPurchaseAmt,
        maxRedimabelAmount: maxRedimabelAmount
      }
    })
    console.log("shaham", d);
    res.send({ url: '/admin/coupenManagment' })

  } catch (error) {
    console.error(error)
    res.send(error)
  }

}


// Axioss//

exports.findCoupen = async (req, res) => {



  try {

    await CoupenManagment.updateMany({ expiredDate: { $lt: Date.now() } }, { $set: { status: false } });


    const coupeData = await CoupenManagment.find({ status: true })
    res.send(coupeData)

  } catch (err) {

    res.send(err)

  }


}


exports.findDeleteCoupen = async (req, res) => {



  try {


    const coupeData = await CoupenManagment.find({ status: false })
    res.send(coupeData)

  } catch (err) {

    res.send(err)

  }


}

exports.findEditCoupon = async (req, res) => {
  const name = req.query.CouponCode
  try {

    const coupon = await CoupenManagment.find({ coupenCode: name })
    console.log('ci', coupon);
    res.send(coupon)

  } catch (error) {
    res.send(error)
  }
}



// sales report  



exports.salesReport = async (req, res, next) => {
  try {

    let order = [];
    const data = await Order.aggregate([
      {
        $match: {

        },
      },
      {
        $unwind: "$orderItems",
      },
    ]);



    data.forEach((orders) => {

      const { _id, paymentMethod, orderDate } = orders;
      const { productId, quantity, pName, price } = orders.orderItems;
      order.push({ _id, productId, pName, price, quantity, paymentMethod }
      );
    })
    const TotalPrice = data.reduce((total, values) => total += values.orderItems.price * values.orderItems.quantity, 0)
    console.log('total', TotalPrice);
    order.push({ TotalPrice })

    const csvFields = ['Orders ID', 'Orders Date', 'Product Name', 'Price of a unit ', 'Qty', 'Payment method', 'Total Amount']
    // const csvParser = new CsvParser({ csvFields })
    // const csvData = csvParser.parse(order)

    const csvParser = new CsvParser({ csvFields });
    const csvData = csvParser.parse(order);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attatchment: filename=salesReport.csv");

    res.status(200).end(csvData);
    // console.log(data);
    // res.send(data)

  } catch (error) {
    // res.send(error) 
    console.log(error);
    next(error)
  }


}


exports.chart = async (req, res) => {

  try {
    console.log('hiiii', req.body.value);

    let labelObj = {};
    let salesCount;
    let findQuerry;
    let currentYear;
    let currentMonth;
    let index;
    console.log(req.body.value);

    switch (req.body.value) {
      case "Monthly":
        console.log('hiiii');
        currentYear = new Date().getFullYear();
        labelObj = {
          "Jan": 0,
          "Feb": 1,
          "Mar": 2,
          "Apr": 3,
          "May": 4,
          "Jun": 5,
          "Jul": 6,
          "Aug": 7,
          "Sep": 8,
          "Oct": 9,
          "Nov": 10,
          "Dec": 11,
        }

        salesCount = new Array(12).fill(0);

        findQuerry = {
          orderDate: {
            $gte: new Date(currentYear, 0, 1),
            $lte: new Date(currentYear, 11, 31, 23, 59, 59),
          }
        }
        index = 1;
        break;
      case 'Weekly':
        console.log('here');
        currentYear = new Date().getFullYear();
        currentMonth = new Date().getMonth() + 1;
        labelObj = {
          "Sun": 0,
          "Mon": 1,
          "Tue": 2,
          "Wed": 3,
          "Thu": 4,
          "Fri": 5,
          "Sat": 6,
        };

        salesCount = new Array(7).fill(0);
        findQuerry = {
          orderDate: {
            $gte: new Date(currentYear, currentMonth - 1, 1),
            $lte: new Date(currentYear, currentMonth, 0, 23, 59, 59),
          }
        }
        index = 0;
        break;
      case "Yearly":
        findQuerry = {}

        const ord = await Order.find().sort({ orderDate: 1 });
        const stDate = ord[0].orderDate.getFullYear();
        const endDate = ord[ord.length - 1].orderDate.getFullYear();
        index = 3


        for (let i = 0; i <= (Number(endDate) - Number(stDate)); i++) {
          labelObj[`${stDate + i}`] = i;
        }

        salesCount = new Array(Object.keys(labelObj).length).fill(0);
        break;
      case "Daily":
        currentYear = new Date().getFullYear();
        currentMonth = new Date().getMonth() + 1;
        let end = new Date(currentYear, currentMonth, 0, 23, 59, 59);
        end = String(end).split(' ')[2];
        end = Number(end);

        for (let i = 0; i < end; i++) {
          labelObj[`${i + 1}`] = i;
        }

        salesCount = new Array(end).fill(0);

        findQuerry = {
          orderDate: {
            $gt: new Date(currentYear, currentMonth - 1, 1),
            $lte: new Date(currentYear, currentMonth, 0, 23, 59, 59),
          }
        };

        index = 2;



    }

    const orders = await Order.find(findQuerry);
    orders.forEach(order => {
      if (index === 2) {
        salesCount[labelObj[Number(String(order.orderDate).split(' ')[index])]] += 1;
      } else {
        salesCount[labelObj[String(order.orderDate).split(' ')[index]]] += 1;
      }
    });

    res.json({
      label: Object.keys(labelObj),
      salesCount
    });

  } catch (error) {
    res.send(error)
  }

}


//find Offer 


exports.findOffer = async (req, res) => {

  try {

    const currentDate = new Date();

    await Offer.deleteMany({ expiredate: { $lt: currentDate } });


    const offer = await Offer.find()



    res.send(offer)

  } catch (err) {
    console.log(err);
    res.send(err)
  }


}

exports.AddOffer = async (req, res) => {
  try {
    console.log(req.body);
    const { category, discount, expiredDate } = req.body
    let data = new Offer({
      cateogary: category,
      discount: discount,
      expiredate: expiredDate
    })


    await data.save()
    console.log('shaham');
    const offerId = data._id
    console.log('shaha', offerId);

    //  if(data.Pname==null){
    //   console.log('hiiiiiishubham');
    //   const d= await Product.updateMany({$set:{offer:data._id}})
    //  }else{

    // const d= await Product.updateMany({pname:data.Pname},{$set:{offer:data._id}})
    //  }

    if (data.cateogary == 'all') {
      console.log('hiii');
      const d = await Product.updateMany({}, { $set: { offer: data._id } })
      console.log(d);
    } else {
      await Product.updateMany({ cateogary: data.cateogary }, { $set: { offer: data._id } })
    }
    res.redirect('/admin/offermanagment')


  } catch (err) {
    res.send(err)
  }
}

exports.AddproductOffer = async (req, res) => {
  try {

    console.log(req.body);
    const { pname, discount, expiredDate } = req.body

    let data = new Offer({
      Pname: pname,
      discount: discount,
      expiredate: expiredDate
    })


    await data.save()
    console.log('shaham');
    const offerId = data._id
    console.log('shaha', offerId);


    const d = await Product.updateMany({ pname: data.Pname }, { $set: { offer: data._id } })
    console.log(d);
    res.redirect('/admin/offermanagment')


  } catch (err) {
    res.send(err)
  }
}

exports.deleteoffer = async (req, res) => {


  console.log('shubhammmm');

  try {
    const id = req.query.id

    await Offer.deleteOne({ _id: id })
    res.redirect('/admin/offermanagment')

  } catch (err) {
    res.send(err)
  }

}


exports.findProductoffer = async (req, res) => {

  try {

    const product = await Product.find({ status: true })
    res.send(product)
  } catch (error) {
    res.send(error)
  }

}


exports.findOrdersFilter=async(req,res,next)=>{

  console.log('kllkkklkl');
  try{

  const status= req.query.status

  const data = await Order.aggregate([
    {
      '$match': {
        'orderStatus': 'pending'
      }
    },
    {
      '$unwind': {
        'path': '$orderItems'
      }
    },
    {
      '$lookup': {
        'from': 'userdbs',
        'localField': 'userId',
        'foreignField': '_id',
        'as': 'userDetails'
      }
    },
  ]);

  console.log(status,data);
   
  }catch(err){
   console.log(err)
    next()

  }
}


exports.addReferaloffer=async(req,res)=>{

 try{


  const data=new referralOfferDb({

    referralRewards:req.body.referralAmount,
    referralUserRewards:req.body.referredAmount,
    expiredate:req.body.expiredDate,

  })

  await data.save()
  console.log(data);
  res.redirect('/admin/referralOffer')
 }catch(err){
  res.send(err)
 } 
 
}


exports.findreferral=async(req,res,next)=>{
  try{
  console.log("shubahmm baiii");
  const data=  await referralOfferDb.find({  })
  console.log(data);
  res.send(data)
  }catch(err){
    next(err)
    console.log(err);
  }
}


exports.deleteReferalOffer=async(req,res,next)=>{

try{

console.log(req.query.id);
const d=  await referralOfferDb.deleteOne({_id:req.query.id})
console.log(d);
res.send({url:`/admin/referralOffer`})

}catch(err){
  console.log(err);
  next(err)
}

}


exports.findOfferCateogary=async(req,res,next)=>{

  try{

  
  
    const category=  await Cateogary.find({ status: true })

    res.send(category) 

  }catch(err){
    res.send(err)
  }

}