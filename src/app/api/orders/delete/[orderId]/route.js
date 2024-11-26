// src/app/api/orders/[orderId]/route.js
import { NextResponse } from 'next/server';
import mongooseConnection from '../../../../../../lib/mongoose';
import Order from '../../../../../../model/Order';



export async function DELETE(request, { params }) {
  try {
    // Call mongooseConnection to connect to MongoDB
    await mongooseConnection();

    const { orderId } = params;

    // Find and delete the order by ID
    const order = await Order.findByIdAndDelete(orderId);

    // If order is not found, return a 404 error
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Return success response
    return NextResponse.json({ message: 'Order deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
