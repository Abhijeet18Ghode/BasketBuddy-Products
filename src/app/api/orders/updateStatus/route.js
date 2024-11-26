import { NextResponse } from 'next/server';
import mongooseConnection from '../../../../../lib/mongoose'; // Adjust the import path as needed
import Order from '../../../../../model/Order';// Correct path

export async function PATCH(request) {
  try {
    // Connect to MongoDB
    await mongooseConnection();

    // Parse the JSON body
    const { orderId, newStatus } = await request.json();

    // Validate input
    if (!orderId || !newStatus) {
      return NextResponse.json(
        { message: 'Order ID and new status are required.' },
        { status: 400 }
      );
    }

    // Validate newStatus
    const validStatuses = ['created', 'processing', 'shipped', 'out for delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json(
        { message: 'Invalid order status provided.' },
        { status: 400 }
      );
    }

    // Find the order by ID
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { message: 'Order not found.' },
        { status: 404 }
      );
    }

    // Update the order status
    order.orderStatus = newStatus;

    // If paymentMethod is 'cod' and newStatus is 'delivered', set 'paid' to true and 'deliveredAt' date
    if (newStatus === 'delivered') {
      order.deliveredAt = new Date(); // Set the delivery date
      if (order.paymentMethod === 'cod') {
        order.paid = true;
      }
    }

    // Save the updated order
    await order.save();

    // Return the updated order information, excluding sensitive details
    const updatedOrder = {
      _id: order._id,
      user: order.user,
      amount: order.amount,
      paid: order.paid,
      orderStatus: order.orderStatus,
      paymentMethod: order.paymentMethod,
      products: order.products,
      shippingAddress: order.shippingAddress,
      trackingId: order.trackingId,
      notes: order.notes,
      deliveredAt: order.deliveredAt, // Added deliveredAt field
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };

    return NextResponse.json(
      { message: 'Order status updated successfully.', order: updatedOrder },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}
