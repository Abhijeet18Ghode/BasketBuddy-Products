import mongooseConnection from '../../../../../lib/mongoose';
import { User } from '../../../../../model/User'; // Update path as needed
import { NextResponse } from 'next/server';

export async function DELETE(req) {
  try {
    const { userId, productId } = await req.json();

    if (!userId || !productId) {
      return NextResponse.json(
        { message: 'User ID and Product ID are required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await mongooseConnection();

    // Find the user by their ID
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: 'User Not Found' }, { status: 404 });
    }

    // Find the product in the cart and remove it
    const cartItemIndex = user.cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (cartItemIndex === -1) {
      return NextResponse.json({ message: 'Product Not Found in Cart' }, { status: 404 });
    }

    // Remove the item from the cart
    const removedItem = user.cart.items.splice(cartItemIndex, 1)[0];

    // Update the total amount
    user.cart.totalAmount -= removedItem.price * removedItem.quantity;

    // Save the updated user document
    await user.save();

    return NextResponse.json({ message: 'Product removed from cart successfully' });
  } catch (error) {
    console.error('Error deleting product from cart:', error.message);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
