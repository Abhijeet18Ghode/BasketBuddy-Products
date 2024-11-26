import { NextResponse } from 'next/server';
import mongooseConnection from '../../../../../../lib/mongoose'; // Adjust the path as needed
import Order from '../../../../../../model/Order'; // Ensure this model is defined
import mongoose from 'mongoose';

export async function GET(req, { params }) {
  try {
    // Connect to MongoDB
    await mongooseConnection();

    const { userId } = params;
    console.log(`Received request to fetch orders for userId: ${userId}`); // Log the userId

    // Validate userId
    if (!userId) {
      return NextResponse.json({ message: 'Valid User ID is required' }, { status: 400 });
    }

    // Find orders by userId
    const orders = await Order.find({ user: userId }).populate('products.productId');

    if (orders.length === 0) {
      return NextResponse.json({ message: 'No orders found for this user' }, { status: 404 });
    }

    console.log('Orders found:', orders); // Log the orders found
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error(`Error fetching orders for user ${params.userId}:`, error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}