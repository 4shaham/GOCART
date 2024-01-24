

const errorMiddleware =(err,req,res,next)=>{

    const status=err.status
    // const message=err.message
    // const extraDetails=err.extraDetails
    console.log('hii');
    if(status==404){
        res.render('404Error')
    }else{
        res.render('500Error')
    }



} 



module.exports=errorMiddleware