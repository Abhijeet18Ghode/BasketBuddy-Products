// app/api/user/[userId]/route.js

import mongooseConnection from '../../../../../../lib/mongoose'; // Import your MongoDB connection utility
import { User } from '../../../../../../model/User'; // Import your User model
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    // Connect to the database
    await mongooseConnection();

    // Extract userId from URL params
    let { id } = params;
    console.log(id)
  
    // Find user by userId
    const user = await User.findById({
      _id : id[0]
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' });
    }

    // Return user data
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ message: 'Internal server error' });
  }
}
