const express = require('express');
const router = new express.Router();
router.use(express.json());

const User = require('../DB/models/users');

//@router :post ->/login
//description : login the user
router.post('/login',async (req,res)=>
    {console.log('**********************************************Login*******************************************\n')
        //console.log(req.body)
            try {
                const user = await User.findUserByCredentials(req.body.email,req.body.password);
                const token = await user.generateAuthToken();
                //console.log(user)
                res.status(200).send({user,token})
            }
            catch(error)
            {  console.log('issue \n'+error)
        
                res.status(400).send({error})
            }
    }
);

router.get('/login',function(req, res) {
    res.send('Hello World login' )
  });

module.exports = router;