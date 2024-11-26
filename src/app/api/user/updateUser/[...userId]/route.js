// app/api/user/[userId]/route.js

import mongooseConnection from '../../../../../../lib/mongoose'; // Import your MongoDB connection utility
import { User } from '../../../../../../model/User'; // Import your User model
import { NextResponse } from 'next/server';

// Handler function to update user data
export async function PUT(request, { params }) {
  try {
    // Connect to the database
    await mongooseConnection();

    // Extract userId from URL params
    const { userId } = params;

    // Parse request body
    const data = await request.json();

    // Find and update the user by userId
    const updatedUser = await User.findByIdAndUpdate(userId, data, { new: true, runValidators: true })
      .exec();

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Return updated user data
    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
