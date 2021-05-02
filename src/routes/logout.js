const User = require('../DB/models/users');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.post('/logout', auth, async (req, res) => {
    try {
        console.log('***************************Logout*************************************************\n',req.user)
        req.user.tokens = []
        await req.user.save()
        res.send({
            'status': 'Loged out from all devices '
        })
    } catch (e) {
        req.status(500).send()
    }
});

module.exports = router;