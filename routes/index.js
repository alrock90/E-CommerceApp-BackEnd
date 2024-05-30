const express = require('express');
const userRouter = require('./users');
const productRouter = require('./products');
const orderRouter = require('./orders');
const authRouter = require('./auth');
const cartRouter = require('./carts');


const router = express.Router();





  module.exports =  {
    userRouter,
    productRouter,
    orderRouter,
    authRouter,
    cartRouter
  }
