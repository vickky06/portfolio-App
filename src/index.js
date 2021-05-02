const express = require('express');
const app = express();
require ("./DB/db")
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
app.listen(3000, function() {
    console.log('listening on 3000')
  })