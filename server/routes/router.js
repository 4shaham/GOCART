
const express=require("express")
const route=express.Router()


const services=require('../services/render')
const controller=require('../controller/userside/controller')
const adressController=require("../controller/userside/address")
const checkoutController=require("../controller/userside/checkout")
const buyNowControoller=require('../controller/userside/buyNow')
const orderController=require('../controller/userside/orderController')
const middleware=require("../../middeleware/middeleware")
const coupenController=require('../controller/userside/coupenController')
const wishlistController=require('../controller/userside/wishlist')
const walletController=require('../controller/userside/wallet')

route.get('/500',services.error500)

route.get("/",middleware.userBlockedAuth,services.homeRoutes)

route.get("/login",middleware.checking,middleware.userBlockedAuth,services.loginRoutes)  
 
route.get("/register1",services.otpRoutes)  
 
route.get("/register2",services.otp2Routes)   

route.get("/register3",services.registrationRoutes)  
  
route.get("/forgotpassword1",services.forgot1Routes) 
  
route.get("/forgotpassword2",services.forgot2Routes)

route.get("/forgotpassword3",services.forgot3Routes)

route.get("/logout",middleware.userBlockedAuth,middleware.pageValidation,services.logout)

route.get('/updateUser',middleware.pageValidation,services.updateUser)

route.get('/updateUserPassword',middleware.pageValidation,services.updateUserPassword)

route.get('/productpage',middleware.userBlockedAuth,services.singleproductpage)

route.get('/cateogarypage',middleware.userBlockedAuth,services.cateogaryproductpage)

route.get('/cart',middleware.userBlockedAuth,middleware.pageValidation,services.cartPage)

route.get('/address',middleware.userBlockedAuth,middleware.pageValidation,services.address)

route.get('/addAddress',middleware.userBlockedAuth,middleware.pageValidation,services.addAddress)

route.get('/editAddress',middleware.userBlockedAuth,middleware.pageValidation,services.editAddress)

route.get('/checkoutPage',middleware.userBlockedAuth,middleware.pageValidation,middleware.checkOutPageVerification,services.checkout)

route.get('/checkoutAddAddress',middleware.userBlockedAuth,middleware.pageValidation,services.checkoutAddAddress)

route.get('/buyNowPage',middleware.userBlockedAuth,middleware.pageValidation,services.buyNowPage)

route.get('/orderSuccssessPage',middleware.userBlockedAuth,middleware.pageValidation,middleware.OrderSuccessPageManage,services.orderSuccssessPage)

route.get('/userOrderPage',middleware.userBlockedAuth,middleware.pageValidation,services.userOrderPage)

route.get('/userorderDetailPage',middleware.userBlockedAuth,middleware.pageValidation,services.userOrderDetailPage)

route.get('/wishlist',middleware.userBlockedAuth,middleware.pageValidation,services.wishlist)

route.get('/wallet',middleware.userBlockedAuth,middleware.pageValidation,services.wallet)

route.get('/showCoupen',middleware.pageValidation,services.showCoupon)



   
// api create 
route.post('/api/p',walletController.wallet)
 


route.post('/api/register',controller.create);

route.post('/api/login',controller.validation) 

route.get('/api/logout',controller.logout)





// registration otp

 
route.post('/api/otp',controller.otp)

route.post('/api/otpverification',controller.otpverification)

route.get('/api/resendOtp',controller.resendOtp) 
 
//forgot otp  

route.post('/api/forgototp',controller.forgototp)

route.post('/api/forgototpverification',controller.forgototp2)

route.post('/api/updateforgototp',controller.updatepassword)

// cart 
  
route.get('/api/addtocart',controller.addtoCart)

route.get('/api/removeCart',controller.removeCart)

route.post('/api/updateCartQuantity',controller.updateQuantity)



// adress 

route.post('/api/addAddress',adressController.addAddress)

route.get('/api/deleteAddress',adressController.deleteAddress)

route.post('/api/makeDefault',adressController.makeDefault) 

// route.put('/api/editAddress',adressController.userEditAddress)
route.post('/api/editAddress',adressController.userEditAddress)



// checkout  

// route.post('/api/checkoutAddressChange',adressController.checkoutChangeAddress)

route.post('/api/checkoutAddressChange',adressController.checkoutChangeAddress) 

route.post('/api/checkoutAddAddress',adressController.checkoutAddAddress)


route.post('/api/payment',orderController.ckeckoutPayment)
    
route.post('/api/rayzorPayment-verification',orderController.paymentVerification)



// updateUser
  
route.post('/api/updateUser',controller.userUpdate)

route.post('/api/updateUserPassword',controller.updateUserPassword)


//orders api 

route.post('/api/updateOrderStatusReturn',orderController.ordersStatusReturn)

route.post('/api/updateOrderStatusCancel',orderController.ordersStatusCanceled)


//coupenManagment 

route.post('/api/coupenManagment',coupenController.coupenMangament)





//search  

route.get('/api/search',controller.search)


// wislist 

route.post('/api/wishlist',wishlistController.wishlist)

route.post('/api/deletewishlist',wishlistController.deletewishlist)

route.get('/api/wishlistDeleteWhisListPage',wishlistController.delteWishlistpageItems)


//wallet 

route.post('/api/addWalletAmt',walletController.addWallet)

route.post('/api/WalletrayzorPayment-verification',walletController.addPaymentVerification)



//invoice 

route.post('/api/downloadInvoice',orderController.invoice)

// axios  

route.get('/homeproductaxios',controller.findproduct)

route.get('/homecateogaryaxios',controller.findcateogary)

route.get('/homecoupenaxios',coupenController.findcoupen)


  
route.get('/singleproductaxios',controller.singleproductpageaxios)

route.get('/cateogaryproductpageaxios',controller.cateogaryproductpage)

route.get('/findUseraxios',controller.findUser)

route.get('/findCartaxios',controller.findCart)

route.get('/updateUseraxios',controller.updateUser)

route.get('/addressaxios',adressController.address)

route.get('/editAddressaxios',adressController.editAddress)

route.get('/checkoutaxios',checkoutController.ckeckout)
  
route.get('/checkoutCartAxios',checkoutController.ckeckoutCart)

route.get('/findBuyNowAxios',buyNowControoller.buyNow)

route.get('/findOrdersAxios',orderController.findOrders)

route.get('/findOrdersDetailAxios',orderController.findOrdersDetail)

route.get('/homeWishlistaxios',wishlistController.findWishlistDetail)

route.get('/wishlistaxios',wishlistController.findWishlist)

route.get('/Walletcheckoutaxios',orderController.findWalletDetails)

route.get('/verifyreferralCode',controller.verifyReferral)















module.exports=route;

  