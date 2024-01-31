const express=require("express")
const app=express()  
const dotenv=require("dotenv")
const morgan=require("morgan")
const session=require("express-session")
const path=require("path")
const connectDB=require('./server/database/connection')
const bodyParser = require("body-parser")
const errorMiddleware=require('./middeleware/errorHandlingMiddeleware')

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());



 dotenv.config({path:'config.env'})
 const PORT=process.env.PORT||4500


app.use(session({
  secret: 'sessionSecrect',
  resave: false,
  saveUninitialized: true

}));

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); 
  res.setHeader("Pragma", "no-cache"); 
  res.setHeader("Expires", "0"); 
  next()
});
 

  //login request

 app.use(morgan('dev'))





  //bodyparser 

 app.use(express.urlencoded({extended:true}))





 //mongo db connection 

 connectDB()    
 

 
 // view engin set
 
 

 app.set("view engine","ejs") 
  
 
 

    


 //load assets 

  app.use('/css',express.static(path.join(__dirname,"Assets/css")))
  app.use('/img',express.static(path.join(__dirname,"Assets/img")))  
  app.use('/js',express.static(path.join(__dirname,"Assets/js")))
 


  
//load router 

app.use("/",require('./server/routes/router')) 

app.use("/",require('./server/routes/adminrouter'))   
  
app.use(errorMiddleware)

app.all('*',(req,res)=>{
  res.render('404Error')
})
     
app.listen(PORT,()=>console.log(`http://localhost:${PORT}`))  
 
     