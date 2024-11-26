import mongoose from 'mongoose';
import mongooseConnection from '../../../../lib/mongoose';
import { User } from '../../../../model/User'; // Update path as needed
import { Product } from '../../../../model/Product'; // Ensure you have a Product model

export async function POST(req) {
  try {
    // Parse the request body
    const { userId, productId, quantity } = await req.json();

    // Connect to MongoDB
    await mongooseConnection();

    // Find the user by their ID
    const user = await User.findById(userId);

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    // Initialize the user's cart if it doesn't exist
    if (!user.cart) {
      user.cart = { items: [], totalAmount: 0 };
    }

    // Find the product by its ID
    const product = await Product.findById(productId);

    if (!product) {
      return new Response(JSON.stringify({ message: 'Product not found' }), { status: 404 });
    }

    const productPrice = product.discountPrice;

    if (productPrice === undefined) {
      return new Response(JSON.stringify({ message: 'Price not found for the product' }), { status: 404 });
    }

    // Check if the product already exists in the cart using ObjectId.equals()
    const itemIndex = user.cart.items.findIndex(item => item.productId.equals(productId));

    if (itemIndex > -1) {
      // If the product is already in the cart, return a message
      return new Response(JSON.stringify({ message: 'Product already in the cart' }), { status: 400 });
    } else {
      // If the product is not in the cart, add it as a new item
      user.cart.items.push({ productId: product._id, quantity, price: productPrice });
    }

    // Recalculate the total amount for the cart
    user.cart.totalAmount = user.cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // Save the updated user document
    await user.save({ validateBeforeSave: false });

    return new Response(
      JSON.stringify({ message: 'Item added to cart', cart: user.cart }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return new Response(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}
