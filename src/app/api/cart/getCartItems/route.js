import mongooseConnection from '../../../../../lib/mongoose';
import { User } from '../../../../../model/User'; // Update path as needed
import { NextResponse } from 'next/server';
import {Product} from '../../../../../model/Product';

export async function POST(req) {
  try {
    // Validate request body
    const requestBody = await req.json();
    if (!requestBody || !requestBody.userId) {
      return NextResponse.json({ message: 'User ID is required' },{status:400});
    }

    // Connect to MongoDB
    try {
      await mongooseConnection();
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      return NextResponse.json({ message: 'Internal Server Error' },{status:500});
    }

    // Find the user by their ID and populate the cart items
    const user = await User.findById(requestBody.userId).populate('cart.items.productId', 'name price');

    if (!user) {
      return NextResponse.json({ message: 'User Not Found' },{status:404});
    }

    // Return the user's cart items
    return NextResponse.json({ cart: user.cart.items, totalAmount: user.cart.totalAmount });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return NextResponse.json({ message: 'Internal Server Error' },{status:500});
  }
}