const express = require('express');
const router = express.Router();
const todo = require('../models/Todo');
const user = require('../models/Users');
const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config();


router.post('/order',async (req, res)=>{
    try {
        let razorpay = new Razorpay({ key_id: process.env.RAZORPAY_key_id, key_secret: process.env.RAZORPAY_key_secret });
        let options = req.body;
        let order= await razorpay.orders.create(options);
        if(!order){
            return res.status(500).send("Error");
        }
        res.json(order);
    } catch (err) {
        res.status(500).json({msg: "something went wrong", err: err})
    }
})

router.post('/order/validate', (req, res)=>{
    const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;
    const sha = crypto.createHmac("sha256", process.env.RAZORPAY_key_secret);
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const genrated_signature = sha.digest("hex");
    if(genrated_signature!==razorpay_signature){
        return res.status(400).json({msg: "Transaction is not legit!"})
    }
    res.status(200).json({
        msg: "success",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id
    })
})

module.exports=router;