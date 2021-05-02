const express = require('express');
const User = require('../DB/models/users');
const router = new express.Router();
router.use(express.json());

//@router POST req->  /api/signUp
//@description : sign up for admin

router.post('/signup',async (req,res)=>{
    console.log('******************************************************************SIGN UP**************************************************\n')
    //create and save a New User
    // {
    //     "name": "Vivek01" ,
    //     "email": "vivek.singh.6967@gmail.com",
    //     "password": "Qwerty@456",
    //     "age" :"01"
    // }
    let body = req.body;
    const user = new User({
        name: body.name,
        email : body.email,
        password : body.password,
        age : body.age || 100
    })
    // console.log(user,"USER DETAILS")

    try{
    await user.save()
    console.log('USER SAVED')
   // sendWelcomeEmails(user.email, user.name)
    const token = await user.generateAuthToken()
    console.log('Sign Up successfull')
    res.status(201).send({user,token})
}
catch (e){
    console.log(' catch Block Found',e)
            res.status(400).send({error:e})
        }
    

});

module.exports = router;