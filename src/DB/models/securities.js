const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const validator = require('validator');
// import User from './users'
// const User = require('./users')
const scrSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        require:true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    portfolio: [{
        
        ticker: {
            type: String,
            required: true,
            trim: true,
            
        },
        shares: {
            type: Number,
            require: true,
        }, 
        avgBuyPrice: {
            type: Number,
            require: true,
            default: 0
        }
    }],
    history:[{
        type:{
            type: String,
            required: true,
            trim: true,
        },
        ticker: {
            type: String,
            required: true,
            trim: true,
        },
        shares: {
            type: Number,
            require: true,
        }, 
        avgBuyPrice: {
            type: Number,
            require: true,
            default: 0
        }
    }],
});
scrSchema.static.findUserById = async (id)=>{
    const user = await Scr.findOne({
        owner: id,
    });
    if (!user) {
        throw new Error("NO SUCH ID",id)
    }
}

const Scr = mongoose.model('Scr', scrSchema);
module.exports = Scr;
