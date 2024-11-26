import mongooseConnection from '../../../../../lib/mongoose';
import {User} from '../../../../../model/User';
import { NextResponse } from 'next/server';
export  async function DELETE(req) {
  await mongooseConnection(); // Connect to the database

  if (req.method === 'DELETE') {
    const { userId } = req.body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' })
    }

    try {
      // Find the user by ID and clear the cart
      const user = await User.findById(userId);

      if (!user) {
        return NextResponse.json({ error: 'User not found' })
      }

      await user.updateOne({}, { $set: { cart: [] } });
      await user.save()
      return NextResponse.json({ message: 'Cart cleared successfully' })
    } catch (error) {
      console.error('Error clearing cart:', error);
      return NextResponse.json({ error: 'Internal server error' })
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    return NextResponse({message : `Method ${req.method} not allowed`});
  }
}
