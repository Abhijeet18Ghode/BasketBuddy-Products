// src/app/api/orders/track/[trackingId]/route.js
import { NextResponse } from 'next/server';
import mongooseConnection from '../../../../../../lib/mongoose';
import Order from '../../../../../../model/Order';

export async function GET(request, { params }) {
  try {
    await mongooseConnection();

    const { trackingId } = params;
    const order = await Order.findOne({ trackingId });

    if (!order) {
      return NextResponse.json({ message: 'Tracking ID not found' }, { status: 404 });
    }

    const orderStatus = {
      trackingId: order.trackingId,
      deliveryDate: order.deliveryDate,
      status: 'In Transit' // Mock status for now
    };

    return NextResponse.json({ message: 'Order tracked', status: orderStatus }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
