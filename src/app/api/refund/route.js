import Razorpay from 'razorpay';
import axios from 'axios';
import { NextResponse } from 'next/server';
import Order from '../../../../model/Order'; // Assuming your order schema is in models/order

export async function POST(req, res) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Only POST requests are allowed' }, { status: 405 });
  }

  const { orderId } = await req.json(); // Assuming you send orderId in the body

  try {
    // Fetch the order from the database
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    if (order.orderStatus === 'cancelled') {
      return NextResponse.json({ message: 'Order is already cancelled' }, { status: 400 });
    }

    // Check the payment method
    if (order.paymentMethod === 'cod') {
      // For COD orders, update the order status to cancelled
      order.orderStatus = 'cancelled';
      await order.save();
      return NextResponse.json({ message: 'Order cancelled successfully' }, { status: 200 });
    } else if (order.paymentMethod === 'online') {
      // For online payments, proceed with Razorpay refund and postal cancellation

      const { paymentId, amount, trackingId } = order.paymentDetails; // Assuming these fields are stored in the order

      // Initialize Razorpay instance
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      // 1. Process Razorpay Refund
      const refund = await razorpay.payments.refund(paymentId, {
        amount: order.amount * 100, // Amount in paise
      });

      // 2. Cancel India Post Order (if applicable)
      if (trackingId) {
        const postalResponse = await axios.post('https://indiapost.api.url/cancel', {
          trackingId,
          headers: {
            Authorization: `Bearer ${process.env.INDIA_POST_API_TOKEN}`,
          },
        });

        if (!postalResponse.data.success) {
          return NextResponse.json({
            message: 'Refund successful, but failed to cancel the postal order',
            refundDetails: refund,
            postalError: postalResponse.data.error,
          }, { status: 400 });
        }
      }

      // Update order status to cancelled
      order.orderStatus = 'cancelled';
      await order.save();

      return NextResponse.json({
        message: 'Refund and order cancellation successful',
        refundDetails: refund,
      }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Invalid payment method' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Failed to process refund or cancel order', error }, { status: 500 });
  }
}
