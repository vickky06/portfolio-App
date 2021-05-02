const express = require('express');
const app = express();
require ("./DB/db")
const auth = require('../src/middleware/auth');

const Scr = require('../src/DB/models/securities')
app.use(express.urlencoded({extended:false}));   //for body parser

const 
    logIN = require('./routes/login'),
    logout = require('./routes/logout'),
    signUp = require('./routes/signup'),
    addStock = require('./routes/addTicker')
app.use(logIN);
app.use(logout);
app.use(signUp);
app.use(addStock)

app.get('/', function(req, res) {
    res.send('Hello World')
  })
// app.post('/src',auth,async (req,res)=>{
//   console.log(req.user.email,"REQ")
//   let resr = await Scr.findOne({
//     email : req.user.email
//   });
//   if(!resr){
//     await Scr.insertMany({
//       email:req.user.email,
//       portfolio: [{...req.body}]
//     })
//   }else{
//     await Scr.findOneAndUpdate({

//     })
//     res.send(resr)
//   }
//   console.log(resr,"ERESET")
//   res.send('ok')
// })
app.listen(3000, function() {
    console.log('listening on 3000')
  })