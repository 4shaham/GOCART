
const express=require("express")
const route=express.Router()
const adminservices=require('../services/adminrender')
const controller=require('../controller/adminside/admincontroller')
const store=require('../controller/adminside/multer.js')
const middeleware=require("../../middeleware/middeleware.js")






 
route.get('/adminlogin',adminservices.adminloginRoutes)

route.get('/admin/',middeleware.adminchecking,adminservices.admindashRoutes)

// offer managment 


route.get('/admin/offermanagment',middeleware.adminchecking,adminservices.adminOffer)

route.get('/admin/addOfferManagment',middeleware.adminchecking,adminservices.addoffer)

route.get('/admin/addProductOffer',middeleware.adminchecking,adminservices.addProductOffer)

//referral offer

route.get('/admin/referralOffer',adminservices.referralOffer)

route.get('/admin/addReferralOffer',adminservices.addReferralOffer)



// coupen managment  

route.get('/admin/coupenManagment',middeleware.adminchecking,adminservices.adminCoupenManagment)
route.get('/admin/addCoupenManagment',middeleware.adminchecking,adminservices.adminAddCoupenManagment)
route.get('/admin/deleteCoupenManagment',middeleware.adminchecking,adminservices.admindeleteCoupenManagment)
route.get('/admin/editCouponManagment',middeleware.adminchecking,adminservices.adminEditCouponManagment)

// usermanagment  

route.get('/admin/UserManagment',middeleware.adminchecking,adminservices.adminUserManagment)



// product managment

route.get('/admin/productManagment',middeleware.adminchecking,adminservices.adminProductManagment)

route.get('/admin/addproduct',middeleware.adminchecking,adminservices.adminaddproduct)

route.get('/admin/editproduct',middeleware.adminchecking,adminservices.admineditproduct)

route.get('/admin/unlistproduct',middeleware.adminchecking,adminservices.adminunllistproduct)




// cateogarymanagment  


route.get('/admin/cateogaryManagment',middeleware.adminchecking,adminservices.admincateogarymanagment)

route.get('/admin/addCateogaryManagment',middeleware.adminchecking,adminservices.adminAddCateogarymanagment)

route.get('/admin/unlistCateogaryManagment',middeleware.adminchecking,adminservices.adminUnlistCateogarymanagment)

route.get('/admin/editcateogary',middeleware.adminchecking,adminservices.admineditcateogary)





//order Managment  

route.get('/admin/orderManagment',middeleware.adminchecking,adminservices.orderManagment)

route.get('/admin/ordersDetail',middeleware.adminchecking,adminservices.ordersDetail)

route.post('/api/updateOrderStatus',controller.updateOrderStatus)


   
// add catrogary

route.post('/admin/addCateogary',store.array('image',1),controller.addcateogary)

// delete cateogary

route.get('/admin/unlistCateogary',controller.unlistcateogary)


// add referral offer


route.post('/admin/addreferaloffer',controller.addReferaloffer)

route.delete('/admin/deleteReferralOffer',controller.deleteReferalOffer)


//recycle 

route.get('/admin/unlistrecycleCateogary',controller.unlistrecyclecateogary)

// edit cateogary  

route.post('/admin/editCateogary',store.array('image',1),controller.editcateogary)

route.get('/api/deleteImgCategory',controller.admindeleteImgcateogary)


//api  
   

route.post('/admin/login',controller.verification)

// add to product  

route.post('/admin/addproduct',store.array('image',12),controller.addproduct)

// delete product 

route.get('/admin/deleteproduct',controller.deleteproduct)

//recycle product

route.get('/admin/recycleproduct',controller.recycleproduct)

//editproduct 

route.post("/admin/editproduct",store.array('image',12),controller.editproduct)

route.get('/api/deleteImgEditProduct',controller.editProductDeleteImg)

//usermanagment blocked

route.get('/admin/blockeduser',controller.blockeduser)

// usermanagment unblock

route.get('/admin/unblockeduser',controller.unblockUser)


// addcoupenManagment 

route.post('/admin/addCoupenManagment',controller.adminAddCoupenManagmentForm)

route.get('/admin/deleteCouponManagment',controller.admindeleteCoupenManagment)

route.put('/admin/editCouponManagment',controller.adminEditCoupenManagmentPut)

// logout api 

route.get('/admin/logout',controller.logout)   


// sales report 

route.get('/admin/salesReport',controller.salesReport)

// chart 

route.post('/admin/chart',controller.chart)


//addOffer 

route.post('/api/addAdminoffer',controller.AddOffer)

route.post('/api/addAdminProductoffer',controller.AddproductOffer)

route.get('/admin/Deleteoffer',controller.deleteoffer)


//

route.post('/admin/findOrdersFilter',controller.findOrdersFilter)

// axios    


route.get('/admin/findproduct',controller.findproduct)

route.get('/admin/unlistProductaxios',controller.findunlistproductaxios)
           
route.get('/admin/editproductAxios',controller.findeditproduct)

route.get('/admin/findCateogary',controller.findCateogary)

route.get('/admin/findUnlistCateogary',controller.findUnlistCateogary)

route.get('/admin/usermanagmentAxios',controller.finduser)

route.get('/admin/editcateogaryAxios',controller.findeditCateogary)

route.get('/admin/addProductCateogaryAxios',controller.findaddProductCateogary)

route.get('/admin/findOrdersAxios',controller.findOrders)

route.get('/admin/findOrdersdetailAxios',controller.findorderDetail)

route.get('/admin/findCoupenAxios',controller.findCoupen)

route.get('/admin/findDeleteCoupenAxios',controller.findDeleteCoupen)

route.get('/admin/findEditCoupenAxios',controller.findEditCoupon)

route.get('/admin/findOffer',controller.findOffer)

route.get('/admin/findProductoffer',controller.findProductoffer)

route.get('/admin/findreferralOffer',controller.findreferral)




module.exports=route;
  