import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import Iyzipay from "iyzipay";
import dotenv from "dotenv";
import Randomstring from "randomstring";

dotenv.config();

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZIPAY_API_KEY,
  secretKey: process.env.IYZIPAY_SECRET_KEY,
  uri: process.env.IYZIPAY_URI,
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private

export const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, totalPrice } = req.body;
  const user = await User.findById(req.userId);

  //TODO: I will cart info from user req.body.cart

  // TODO: I will generate order number

  // TODO: I will calculate total price

  //  TODO: Check if user has shipping address and order items
  if (!user?.hasShippingAddress) {
    res.status(400);
    throw new Error("No shipping address");
  }

  if (orderItems?.length <= 0) {
    res.status(400);
    throw new Error("No order items");
  }
  const orderNumber = Randomstring.generate(10).toLocaleUpperCase();

  const payment = {
    locale: Iyzipay.LOCALE.TR,
    conversationId: orderNumber,
    price: req.body.totalPrice,
    paidPrice: req.body.totalPrice,
    currency: Iyzipay.CURRENCY.TRY,
    installment: "1",
    basketId: orderNumber,
    paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
    paymentGroup: Iyzipay.PAYMENT_GROUP.LISTING,
    paymentCard: {
      cardHolderName: req.body.cardHolderName,
      cardNumber: req.body.cardNumber,
      expireMonth: req.body.expireMonth,
      expireYear: req.body.expireYear,
      cvc: req.body.cvc,
      registerCard: "0",
    },
    buyer: {
      id: req.userId,
      name: user.shippingAddress.firstname,
      surname: user.shippingAddress.lastname,
      gsmNumber: user.shippingAddress.phone,
      email: "email@email.com",
      identityNumber: user.identityNumber
        ? user.identityNumber
        : req.body.identityNumber,
      registrationAddress: user.shippingAddress.address,
      city: user.shippingAddress.city,
      country: user.shippingAddress.country,
      zipCode: user.shippingAddress.postalCode,
    },
    shippingAddress: {
      contactName:
        user.shippingAddress.firstname + " " + user.shippingAddress.lastname,
      city: user.shippingAddress.city,
      country: user.shippingAddress.country,
      address: user.shippingAddress.address,
      zipCode: user.shippingAddress.postalCode,
    },
    billingAddress: {
      contactName:
        user.shippingAddress.firstname + " " + user.shippingAddress.lastname,
      city: user.shippingAddress.city,
      country: user.shippingAddress.country,
      address: user.shippingAddress.address,
      zipCode: user.shippingAddress.postalCode,
    },
    basketItems: orderItems.map((item) => {
      return {
        id: item._id,
        name: item.name,
        category1: "Petshop",
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: item.price.toString(),
      };
    }),
  };

  iyzipay.payment.create(payment, async function (err, result) {
    if (result?.status === "success") {
      const order = new Order({
        user: req.userId,
        orderNumber: orderNumber,
        orderItems,
        shippingAddress: user.shippingAddress || shippingAddress,
        totalPrice,
        currency: "TRY",
      });

      user.orders.push(order._id);
      await user.save();

      const products = await Product.find({ _id: { $in: orderItems } });

      orderItems.map(async (order) => {
        const product = products.find(
          (product) => product?._id?.toString() === order?._id?.toString()
        );
        if (product) {
          product.totalSold += order?.qty;
        }

        await product.save();
      });

      await order.save();

      res.status(200).json({
        success: true,
        message: "Order created successfully",
        order,
        user,
      });
    } else {
      console.log(err);
    }
  });
});
