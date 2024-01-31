
const axios=require("axios")


exports.myMiddleware = (req, res, next) => {
  // Your middleware logic here
  console.log('Middleware executed');
  next(); // Call next() to pass control to the next middleware in the chain
};



exports.checking = (req, res, next) => {
  if (req.session.authentication == true) {
    res.redirect("/logout")
  } else {
    next()
  }


}

exports.adminchecking = (req, res,next) => {
  if (! req.session.admin==true) {
    res.redirect("/adminlogin")
  }else {
    next()
  }
}

exports.userBlockedAuth=(req,res,next)=>{
  if( req.session.blokedAuth==true&&req.session.userId ){
    delete req.session.authentication
    delete req.session.userId
    res.redirect('/')
  }else{
    next()
  }
}
 

exports.pageValidation=(req,res,next)=>{

  if(!req.session.userId){
    res.redirect('/')
  }else{
    next()
  }

}

exports.checkOutPageVerification=(req,res,next)=>{

  if( req.session.checkOutPageVerification ){

    res.redirect('/')
    
  }else{

    next()

  }

 
}


exports.OrderSuccessPageManage=(req,res,next)=>{

  if(req.session.OrderSuccessPageManage==true){

    next()

  }else{
    
    res.redirect('/')

  }




}














