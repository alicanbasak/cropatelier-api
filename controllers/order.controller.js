import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import Iyzipay from "iyzipay";
import dotenv from "dotenv";
import Randomstring from "randomstring";
import Coupon from "../models/Coupon.js";

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
  const { coupon } = req.query;

  const couponFound = await Coupon.findOne({ code: coupon?.toUpperCase() });

  if (couponFound?.isExpired) {
    res.status(400);
    throw new Error("Coupon is expired");
  }

  // if (couponFound) {
  //   res.status(400);
  //   throw new Error("Coupon not found");
  // }

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
  // Get discount from coupon

  const payment = {
    locale: Iyzipay.LOCALE.TR,
    conversationId: orderNumber,
    price: couponFound
      ? req.body.totalPrice - (req.body.totalPrice * couponFound.discount) / 100
      : totalPrice,
    paidPrice: couponFound
      ? req.body.totalPrice - (req.body.totalPrice * couponFound.discount) / 100
      : req.body.totalPrice,
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
      email: user.email,
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
        // price: couponFound?  item.price.toString(),
        price: couponFound
          ? (item.price - (item.price * couponFound.discount) / 100).toString()
          : item.price.toString(),
      };
    }),
  };

  iyzipay.payment.create(payment, async function (err, result) {
    if (result?.status === "success") {
      // console.log(result);
      const order = new Order({
        user: req.userId,
        orderNumber: orderNumber,
        orderItems,
        shippingAddress: user.shippingAddress || shippingAddress,
        totalPrice: couponFound
          ? totalPrice - (totalPrice * couponFound.discount) / 100
          : totalPrice,
        currency: "TRY",
      });

      user.orders.push(order._id);
      await user.save();

      const products = await Product.find({ _id: { $in: orderItems } });

      orderItems.map(async (order) => {
        const product = products.find(
          (product) => product?._id?.toString() === order?._id?.toString()
        );

        product.totalSold += order?.qty;

        await product.save();
      });

      await order.save();

      res.status(200).json({
        success: true,
        message: "Order created successfully",
        data: order,
        user: user,
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.errorMessage,
      });
      return;
    }
  });
});

// @desc update order
// @route PUT /api/orders/:id
// @access Private
export const updateOrder = asyncHandler(
  async (req, res) => {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
        paymentStatus: req.body.paymentStatus,
      },
      { new: true }
    );

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: order,
    });
  },
  { new: true }
);

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin

export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "fullname email");

  if (!orders) {
    res.status(404);
    throw new Error("Orders not found");
  }

  res.status(200).json({
    success: true,
    message: "Orders fetched successfully",
    data: orders,
  });
});

// @desc    Get order by id
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user");

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.status(200).json({
    success: true,
    message: "Order fetched successfully",
    data: order,
  });
});

// @desc    Get sales sum of orders
// @route   GET /api/orders/sales
// @access  Private/Admin

export const getOrderStats = asyncHandler(async (req, res) => {
  // get minimum order
  const getStats = await Order.aggregate([
    {
      $group: {
        _id: null,
        minimumSale: { $min: "$totalPrice" },
        totalSales: { $sum: "$totalPrice" },
        maximumSale: { $max: "$totalPrice" },
        averageSales: { $avg: "$totalPrice" },
      },
    },
  ]);

  const date = new Date();
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const saleToday = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: today,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$totalPrice" },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    message: "Sales fetched successfully",
    stats: getStats,
    salesToday: saleToday,
  });
});
