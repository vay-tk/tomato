

import Stripe from "stripe"
import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// placing user order for frontend
const placeOrder = async (req,res)=>{
    const frontend_url = process.env.FRONTEND_URL;
    try {
        const newOrder = new orderModel({
            userId:req.body.userId,
            items:req.body.items,
            amount:req.body.amount,
            address:req.body.address
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});

        const line_item = req.body.items.map((item)=>({
            price_data:{
                currency:"inr",
                product_data:{
                    name:item.name
                },
                unit_amount:item.price*100*80
            },
            quantity:item.quantity
        }))

        line_item.push({
            price_data:{
                currency:"inr",
                product_data:{
                    name:"Delivery Charges"
                },
                unit_amount:2*100*80
            },
            quantity:1
        })

        const session = await stripe.checkout.sessions.create({
            line_items:line_item,
            mode:'payment',
            success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        })
        res.json({
            success:true,
            session_url:session.url
        })
    } catch (error) {
        console.log(error.message)
        res.json({
            success:true,
            message:error.message
        })
    }
}

// best way to verify payment is true using webhooks but it is time consuming so we dont use
// this temporary way to verify payment is true or false 
const verifyOrder = async (req,res)=>{
    const { orderId,success } = req.body;
    try {
        if(success==="true"){
            await orderModel.findByIdAndUpdate(orderId,{payment:true})
            res.json({
                success:true,
                message:"paid"
            })
        }
        else{
            await orderModel.findByIdAndDelete(orderId)
            res.json({
                success:false,
                message:"Not Paid"
            })
        }
    } catch (error) {
        console.log(error.message)
        res.json({
            success:false,
            message:error.message
        })
    }
}

// user orders for frontend
const userOrders = async (req,res)=>{
    try {
        const orders = await orderModel.find({userId:req.body.userId})
        res.json({
            success:true,
            data:orders
        })
    } catch (error) {
        console.log(error.message)
        res.json({
            success:false,
            message:error.message
        })
    }
}

// listing order for admin panel 
const listOrders = async (req,res)=>{
    try {
        const orders = await orderModel.find({})
        res.json({
            success:true,
            data:orders
        })
    } catch (error) {
        console.log(error.message)
        res.json({
            success:false,
            message:error.message
        })
    }
}


// api for updating order status
const updateStatus = async (req,res)=>{
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
        res.json({
            success:true,
            message:"Status Updated"
        })
    } catch (error) {
        console.log(error)
        res.json({
            success:false,
            message:error.message
        })
    }
}


export {placeOrder, verifyOrder, userOrders,listOrders, updateStatus }