const axios = require("axios")
const queryString = require('querystring')


exports.error500 = (req, res) => {
   res.render('500Error')
}

exports.homeRoutes = (req, res, next) => {
   delete req.session.checkOutPageVerification
   delete req.session.OrderSuccessPageManage
   const userId = req.session.userId
   axios.all([
      axios.get(`http://localhost:${process.env.PORT}/homeproductaxios`),
      axios.get(`http://localhost:${process.env.PORT}/homecateogaryaxios`),
      axios.get(`http://localhost:${process.env.PORT}/homeWishlistaxios?userId=${userId}`),
      axios.get(`http://localhost:${process.env.PORT}/homecoupenaxios`)
   ])
      .then(axios.spread((data1, data2, data3, data4) => {
         res.render("homepage", { Product: data1.data, cateogary: data2.data, isLogged: req.session.authentication, wishlist: data3.data, coupen: data4.data })
      })).catch(err => {
         console.log(err)
         next(err)
      })

}


exports.loginRoutes = (req, res) => {

   res.render("login", { message: req.session.message, emailvalidation: req.session.emailvalidation, emailvalue: req.session.emalevalue, passwordValue: req.session.passwordValue }, (err, html) => {
      if (err) {
         console.log('render err', err);
         return res.send('Internal server  err');
      }
      delete req.session.password;
      delete req.session.message;
      delete req.session.email;
      delete req.session.emailvalidation;
      delete req.session.emalevalue;
      delete req.session.passwordValue;

      res.send(html);

   })

}

exports.otpRoutes = (req, res) => {

   res.render("registration1", { message: req.session.Otpeerrmessage, findEmail: req.session.findEmail }, (err, html) => {
      if (err) {
         res.send(err)
      }
      delete req.session.Otpeerrmessage;
      delete req.session.findEmail;
      res.send(html)
   })
}

exports.otp2Routes = (req, res) => {

   res.render("registration2", { err: req.session.otpValidation }, (err, html) => {
      if (err) {
         res.send(err)
      }
      delete req.session.otpValidation;
      res.send(html)
   })
}

exports.registrationRoutes = async(req, res) => {

var data;
if(req.query.referralCode){

   const referralCode = req.query.referralCode
  
    data=  await axios.get(`http://localhost:${process.env.PORT}/verifyreferralCode?referralCode=${referralCode}`);

}
    



   res.render("registration3", { bodyMessage: req.session.body, confimPasswordErr: req.session.chekingPassword, requiredPassword: req.session.requiredPassword, requiredConfirmPassword: req.session.requiredConfirmPassword, emailValidation: req.session.passwordValidation, emailunique: req.session.emailunique,err:data?.data }, (err, html) => {
      if (err) {
         console.log('render err', err);
         return res.send('Internal server  err');
      }

      delete req.session.body;
      delete req.session.chekingPassword;
      delete req.session.requiredPassword;
      delete req.session.requiredConfirmPassword;
      delete req.session.passwordValidation;
      delete req.session.emailunique

      res.send(html);
   })
}

exports.forgot1Routes = (req, res) => {
   res.render("forgotpassword1")
}

exports.forgot2Routes = (req, res) => {

   res.render("forgotpassword2")

}
exports.forgot3Routes = (req, res) => {

   res.render("forgotpassword3")

}

exports.logout = (req, res, next) => {
   const useremail = req.session.logoutemail
   axios.get(`http://localhost:${process.env.PORT}/findUseraxios?user=${useremail}`)
   
      .then((response) => {

         res.render("logout", { user: response.data.user,referralOffer:response.data.referralOffer })

      }).catch(err => {
         console.log(err);
         next(err)
      })
}


exports.singleproductpage = (req, res, next) => {
   const productId = req.query.id
   const userId = req.session.userId


   axios.get(`http://localhost:${process.env.PORT}/singleproductaxios?id=${productId}&userId=${userId}`)

      .then((response) => {
         res.render("singleproductpage", { product: response.data.product, isCart: response.data.productCart })
      }).catch(err => {
         console.log(err)
         // res.render('500Error')
         // res.send(err)   
         next(err)
      })

}
exports.cateogaryproductpage = (req, res, next) => {



   if (req.query.category && !req.query.Min && !req.query.Max && !req.query.sort) {
      console.log('hhhh', req.query)
      const category = req.query.category
      axios.get(`http://localhost:${process.env.PORT}/cateogaryproductpageaxios?category=${category}`)

         .then((response) => {
            console.log(response.data.CateogaryName);
            res.render("categaryProduct", { product: response.data.product, category: response.data.categoary, categoryName: response.data.CateogaryName, isLogged: req.session.authentication })
         }).catch(err => {
            // res.send(err)   
            console.log(err)
            next(err)
         })
   } else if (req.query.key) {
      console.log('ziyad');
      axios.get(`http://localhost:${process.env.PORT}/api/search?key=${req.query.key}`)
         .then((response) => {
            console.log('shubham', response.data);
            res.render("categaryProduct", { product: response.data.product, categoryName: response.data.CateogaryName, category: response.data.categoary, isLogged: req.session.authentication })
            console.log('end');
         }).catch(err => {
            console.log(err)
            next(err)
            // res.render('500Error')
         })
   } else {

      const category = req.query.category
      const Min = req.query.Min
      const Max = req.query.Max
      const sort = req.query.sort

      axios.get(`http://localhost:${process.env.PORT}/cateogaryproductpageaxios?category=${category}&Min=${Min}&Max=${Max}&sort=${sort}`)

         .then((response) => {
            console.log(response.data.CateogaryName);
            res.render("categaryProduct", { product: response.data.product, category: response.data.categoary, categoryName: response.data.CateogaryName, isLogged: req.session.authentication })
         }).catch(err => {
            // res.send(err)   
            console.log(err)
            next(err)
         })

   }

}


exports.cartPage = (req, res, next) => {

   const userid = req.session.userId

   axios.get(`http://localhost:${process.env.PORT}/findCartaxios?id=${userid}`)
      .then((response) => {
         res.render("cartPage", { userCart: response.data, outOfStockERR: req.session.outOfStock }, (err, html) => {
            if (err) {
               res.send(err)
            }
            delete req.session.outOfStock
            res.send(html)

         })
      }).catch(err => {
         console.log(err)
         next(err)
      })
}


exports.updateUser = (req, res, next) => {
   const usereId = req.query.id
   axios.get(`http://localhost:${process.env.PORT}/updateUseraxios?updateUser=${usereId}`)
      .then((response) => {
         res.render("updateUser", { user: response.data })
      }).catch(err => {
         console.log(err)
         next(er)
      })
}

exports.updateUserPassword = (req, res) => {
   console.log("kil");
   res.render("userPasswordUpdate", { err: req.session.updatePasswordValidation, oldPasswordErr: req.session.oldPasswordValidation, confirmPasswordErr: req.session.confirmPasswordValidation, validation: req.session.passwordValidation }, (err, html) => {
      if (err) {
         res.send(err)
      }
      delete req.session.updatePasswordValidation;
      delete req.session.oldPasswordValidation;
      delete req.session.confirmPasswordValidation;
      delete req.session.passwordValidation;
      res.send(html)
   })

}

exports.address = (req, res) => {
   const userid = req.session.userId
   axios.get(`http://localhost:${process.env.PORT}/addressaxios?id=${userid}`)
      .then((response) => {
         res.render('userAddress', { addresData: response.data })
      }).catch(err => {
         // res.send(err)  
         console.log(err)
         res.render('500Error')
      })
}

exports.addAddress = (req, res) => {

   res.render('addAddress', { err: req.session.addressErr }, (err, html) => {
      if (err) {
         console.log(err)
      }

      delete req.session.addressErr;

      res.send(html)
   })

}

exports.editAddress = (req, res, next) => {

   const userid = req.session.userId
   const addressid = req.query.id
   console.log(addressid);
   axios.get(`http://localhost:${process.env.PORT}/editAddressaxios?id=${addressid}&userId=${userid}`)
      .then((response) => {
         res.render("userEditAddress", { address: response.data })
      }).catch(err => {
         console.log(err);
         next(err)
      })


}


exports.checkout = (req, res, next) => {

   const userid = req.session.userId
   axios.all([
      axios.get(`http://localhost:${process.env.PORT}/checkoutCartAxios?id=${userid}`),
      axios.get(`http://localhost:${process.env.PORT}/checkoutaxios?id=${userid}`),
      axios.get(`http://localhost:${process.env.PORT}/Walletcheckoutaxios?id=${userid}`)
   ])

      //    .then(axios.spread((data1,data2))=>{      
      //       res.render('checkout',{address:response.data})
      //       console.log(response.data);
      //   }).catch(err=>{  
      //       res.send(err)   
      //   })


      .then(axios.spread((data1, data2, data3) => {
         res.render("checkout", { userCart: data1.data, address: data2.data, onclickONPayment: req.session.paymentSelection, wallet: data3.data }, (err, html) => {
            if (err) {
               res.send(err)
            }
            delete req.session.paymentSelection,
               delete req.session.coupen,
               delete req.session.coupenId,
               delete req.session.wallateUsed,
               delete req.session.incrementWalletAmount,
               delete req.session.WalletproductPrice
            res.send(html)

         })
      })).catch(err => {
         // res.send(err)
         console.log(err);
         next(err)
      })



}


exports.checkoutAddAddress = (req, res) => {

   res.render("checkoutAddAddress")

}

exports.buyNowPage = (req, res) => {

   const productId = req.query.id
   console.log(productId);

   axios.get(`http://localhost:${process.env.PORT}/findBuyNowAxios?id=${productId}`)

      .then((response) => {
         res.render('buyNowPage', { buyNowProduct: response.data })
      }).catch(err => {
         console.log(err);
         next(err)
      })



}

exports.orderSuccssessPage = (req, res) => {

   res.render("orderSuccseesPage")
}

exports.userOrderPage = (req, res, next) => {

   const userid = req.session.userId
   delete req.session.checkOutPageVerification
   delete req.session.OrderSuccessPageManage
   axios.get(`http://localhost:${process.env.PORT}/findOrdersAxios?id=${userid}`)

      .then((response) => {
         res.render('userOrder', { orders: response.data })
      }).catch(err => {
         // res.send(err)
         console.log(err);
         next(err)
      })


}

exports.userOrderDetailPage = (req, res, next) => {
   const id = req.query.id
   axios.get(`http://localhost:${process.env.PORT}/findOrdersDetailAxios?id=${id}`)

      .then((response) => {
         res.render("userOrderDetail", { orders: response.data })
      }).catch(err => {
         // res.send(err)
         console.log(err);
         next(err)
      })

}


exports.wishlist = (req, res, next) => {
   const userId = req.session.userId
   axios.get(`http://localhost:${process.env.PORT}/wishlistaxios?userId=${userId}`)

      .then((response) => {
         res.render("wishlist", { whishlistProducts: response.data })
      }).catch(err => {
         console.log(err);
         next(err)
      })
}


exports.wallet = (req, res, next) => {
   const userId = req.session.userId

   axios.get(`http://localhost:${process.env.PORT}/Walletcheckoutaxios?id=${userId}`)

      .then((response) => {
         res.render("wallet", { wallet: response.data })
      }).catch(err => {
         // res.send(err) 
         console.log(err);
         next(err)
      })

}

exports.showCoupon = (req, res, next) => {
   axios.get(`http://localhost:${process.env.PORT}/homecoupenaxios`)

      .then((response) => {
         res.render('userShowCoupon', { coupon: response.data })
      }).catch((err) => {
         console.log(err);
         next(err)
      })

}