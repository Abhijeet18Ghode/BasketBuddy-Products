import mongooseConnection from '../../../../../lib/mongoose';
import { User } from '../../../../../model/User';
import { NextResponse } from 'next/server';

// export async function POST(req) {
//   try {
//     await mongooseConnection();

//     const { userId, combinedCartItems } = await req.json();

//     // Validate the input
//     if (!userId || !combinedCartItems) {
//       return NextResponse.json(
//         { message: 'User ID and combinedCartItems are required' },
//         { status: 400 }
//       );
//     }

//     const user = await User.findById(userId);
//     if (!user || !user.cart) {
//       return NextResponse.json({ message: 'User or cart not found' }, { status: 404 });
//     }

//     // Ensure combinedCartItems is an array
//     if (!Array.isArray(combinedCartItems)) {
//       return NextResponse.json(
//         { message: 'combinedCartItems must be an array' },
//         { status: 400 }
//       );
//     }

//     // Bulk update product quantities and prices in the cart
//     const bulkOperations = combinedCartItems.map(updatedProduct => ({
//       updateOne: {
//         filter: { _id: userId, 'cart.items.productId': updatedProduct.productId._id },
//         update: {
//           $set: {
//             'cart.items.$.quantity': updatedProduct.quantity,
//             'cart.items.$.price': updatedProduct.price,
//           },
//         },
//       },
//     }));

//     const bulkWriteResult = await User.bulkWrite(bulkOperations);

//     // Recalculate the total amount
//     const updatedUser = await User.findById(userId);
//     updatedUser.cart.totalAmount = updatedUser.cart.items.reduce(
//       (sum, item) => sum + item.price * item.quantity,
//       0
//     );
//     await updatedUser.save();

//     // Return success with updated cart details
//     return NextResponse.json({
//       message: 'Cart updated successfully',
//       cart: updatedUser.cart,
//       bulkWriteResult,
//     }, { status: 200 });

//   } catch (error) {
//     console.error('Error updating cart:', error);
//     return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
//   }
// }



export async function POST(req) {
  try {
    await mongooseConnection();

    const { userId, combinedCartItems } = await req.json();

    console.log("Received userId:", userId);
    console.log("Received combinedCartItems:", combinedCartItems);

    // Validate the input
    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }
    
    if (!combinedCartItems || !Array.isArray(combinedCartItems)) {
      return NextResponse.json(
        { message: 'combinedCartItems must be an array and cannot be empty' },
        { status: 400 }
      );
    }

    // Proceed with the rest of the logic
    const user = await User.findById(userId);
    if (!user || !user.cart) {
      return NextResponse.json({ message: 'User or cart not found' }, { status: 404 });
    }

    // Bulk update product quantities and prices in the cart
    const bulkOperations = combinedCartItems.map(updatedProduct => ({
      updateOne: {
        filter: { _id: userId, 'cart.items.productId': updatedProduct.productId._id },
        update: {
          $set: {
            'cart.items.$.quantity': updatedProduct.quantity,
            'cart.items.$.price': updatedProduct.price,
          },
        },
      },
    }));

    const bulkWriteResult = await User.bulkWrite(bulkOperations);

    // Recalculate the total amount
    const updatedUser = await User.findById(userId);
    updatedUser.cart.totalAmount = updatedUser.cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    await updatedUser.save();

    return NextResponse.json({
      message: 'Cart updated successfully',
      cart: updatedUser.cart,
      bulkWriteResult,
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
