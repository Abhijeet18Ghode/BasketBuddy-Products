// src/app/api/orders/delivery-charge/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { shippingAddress } = await request.json();

    if (!shippingAddress || !shippingAddress.city) {
      return NextResponse.json({ message: 'Invalid address' }, { status: 400 });
    }

    const deliveryCharge = calculateDeliveryCharge(shippingAddress);

    return NextResponse.json({ message: 'Delivery Charge Calculated', deliveryCharge }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// Mock delivery charge calculator
function calculateDeliveryCharge(shippingAddress) {
  const { city } = shippingAddress;
  return city === 'Mumbai' ? 50 : 100; // Mock pricing based on city
}
