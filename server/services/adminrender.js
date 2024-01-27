
const axios=require("axios")


exports.adminloginRoutes=(req,res)=>{
    res.render("adminlogin")
}   

exports.admindashRoutes=(req,res)=>{       
    res.render("admindashboard")
}
   
exports.adminProductManagment=(req,res)=>{
    const pagination=Number(req.query.page);
    axios.get(`http://localhost:${process.env.PORT}/admin/findproduct?page=${pagination}`)   
    .then((response)=>{      
        res.render("adminProductManagment",{Product:response.data.product, count: response.data.countDoc,cN: pagination});
    }).catch(err=>{  
        res.send(err)   
    })        
}
 
exports.adminaddproduct=(req,res)=>{

    axios.get(`http://localhost:${process.env.PORT}/admin/addProductCateogaryAxios`)   
    .then((response)=>{         
        res.render("adminaddproduct",{Cateogary:response.data}) 
    }).catch(err=>{ 
        res.send(err)   
    }) 
}
  
  
exports.admineditproduct=(req,res)=>{

   const id=req.query.id
   axios.all([
    axios.get(`http://localhost:${process.env.PORT}/admin/editproductAxios?id=${id}`) ,
    axios.get(`http://localhost:${process.env.PORT}/admin/addProductCateogaryAxios`) 
 ])
 .then(axios.spread((data1,data2)=>{
    res.render("admineditproduct",{Product:data1.data,cateogary:data2.data}) 
 })).catch(err=>{
    res.send(err)
 })
 
}   


exports.adminunllistproduct=(req,res)=>{
    axios.get(`http://localhost:${process.env.PORT}/admin/unlistProductaxios`)   
    .then((response)=>{      
        console.log("pppp");
        res.render("adminunlistproduct",{Product:response.data}) 
    }).catch(err=>{
        console.log("hii")    
        res.send(err)   
    })      
    
}

  
exports.admincateogarymanagment=(req,res)=>{

    const pagination=Number(req.query.page);
    
    axios.get(`http://localhost:${process.env.PORT}/admin/findCateogary?page=${pagination}`)   
    .then((response)=>{      
        console.log("pppp");
        res.render("adminCateogaryManagment",{Cateogary:response.data.category,count:response.data.countDoc,cn:pagination})
    }).catch(err=>{
        console.log("hii")    
        res.send(err)   
    }) 
    
}

exports.adminAddCateogarymanagment=(req,res)=>{

    res.render("adminaddCateogary",{message: req.session.cateogaryerr},(err,html)=>{
        if(err){
            console.log('render err',err);
            return res.send('Internal server  err');
        }
        delete req.session.cateogaryerr;
        res.send(html);
    })
}

exports.adminUnlistCateogarymanagment=(req,res)=>{
    axios.get(`http://localhost:${process.env.PORT}/admin/findUnlistCateogary`) 
    .then((response)=>{      
        res.render("adminunlistCateogary",{Cateogary:response.data}) 
    }).catch(err=>{  
        res.send(err)   
    }) 
}


exports.admineditcateogary=(req,res)=>{
    const id=req.query.id
    axios.get(`http://localhost:${process.env.PORT}/admin/editcateogaryAxios?id=${id}`) 

    .then((response)=>{      
        res.render("admineditcateogary",{Cateogary:response.data}) 
    }).catch(err=>{  

        res.send(err)

    }) 
}





//  usermanagment    

exports.adminUserManagment=(req,res)=>{

    const pagination=Number(req.query.page) 
    console.log(pagination);
    axios.get(`http://localhost:${process.env.PORT}/admin/usermanagmentAxios?page=${pagination}`) 
    .then((response)=>{      
        res.render("adminUsermanagment",{Userdb:response.data.userData,count:response.data.countDoc,cn:pagination}) 
    }).catch(err=>{  
        res.send(err)   
    }) 

}

// order managment 

exports.orderManagment=(req,res)=>{
    console.log("hiiilk");
    axios.get(`http://localhost:${process.env.PORT}/admin/findOrdersAxios`) 
    .then((response)=>{      
        res.render('adminOrderManagment',{orders:response.data})
    }).catch(err=>{  
        res.send(err)   
    }) 

}

exports.ordersDetail=(req,res,next)=>{

    const id=req.query.id
    console.log(id);
    axios.get(`http://localhost:${process.env.PORT}/admin/findOrdersdetailAxios?id=${id}`) 


    .then((response)=>{      
        res.render('adminOrderSummary',{ orders: response.data })
    }).catch(err=>{  
       console.log(err);
        next(err)
    }) 



    
}



// coupen managment 

exports.adminCoupenManagment=(req,res)=>{

    axios.get(`http://localhost:${process.env.PORT}/admin/findCoupenAxios`) 
    .then((response)=>{      
        res.render('adminCoupenManagment',{coupen:response.data})
    }).catch(err=>{  
        res.send(err)   
    }) 

   
}

exports.adminAddCoupenManagment=(req,res)=>{
    res.render('adminAddCoupenManagment',{errMsg:req.session.Coupenerrmsg},(err,html)=>{
        if(err){
            res.send(err)
        }

        delete req.session.Coupenerrmsg;

        res.send(html)
    })
}


exports.admindeleteCoupenManagment=(req,res)=>{

    axios.get(`http://localhost:${process.env.PORT}/admin/findDeleteCoupenAxios`) 
    .then((response)=>{      
        res.render('adminDeletedCoupenManagment',{coupen:response.data})
    }).catch(err=>{  
        res.send(err)   
    }) 

   
}

exports.adminEditCouponManagment=(req,res)=>{
    
    const CouponCode=req.query.CouponCode

    axios.get(`http://localhost:${process.env.PORT}/admin/findEditCoupenAxios?CouponCode=${CouponCode}`) 


    .then((response)=>{      
        console.log('shaham',response.data);
        res.render('adminEditCouponManagment',{coupen:response.data})
    }).catch(err=>{  
        res.send(err)   
    }) 
}


exports.adminOffer=(req,res,next)=>{
   axios.get(`http://localhost:${process.env.PORT}/admin/findOffer`) 
   .then((response)=>{      
       
    res.render('adminOffer',{offer:response.data})
     
}).catch(err=>{ 
    console.log(err);   
    next(err)
}) 
    
}

exports.addoffer=(req,res)=>{

    axios.get(`http://localhost:${process.env.PORT}/admin/findOfferCateogary`)   
    .then((response)=>{      
       
        res.render("adminAddOffer",{Cateogary:response.data}) 
         
    }).catch(err=>{ 
   
        res.send(err)   
    }) 

  
}


exports.addProductOffer=(req,res)=>{

    axios.get(`http://localhost:${process.env.PORT}/admin/findProductoffer`) 


    .then((response)=>{      
       
        res.render("adminProductOffer",{product:response.data}) 
         
    }).catch(err=>{ 
   
        res.send(err)   
    }) 

}


exports.referralOffer=(req,res)=>{

    axios.get(`http://localhost:${process.env.PORT}/admin/findreferralOffer`) 


    .then((response)=>{      
        
        res.render('adminReferralOffer',{data:response.data})
         
    }).catch(err=>{ 
        console.log(err);
        next(err)
       
    }) 

  


}

exports.addReferralOffer=(req,res)=>{
    res.render('adminAddReferralOffer')
}