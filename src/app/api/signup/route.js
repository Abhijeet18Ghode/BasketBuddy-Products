import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import mongooseConnection from "../../../../lib/mongoose";
import { User } from "../../../../model/User";
import { Types } from 'mongoose'; // Import Types from mongoose

export async function POST(req, res) {
  await mongooseConnection(); // Ensure MongoDB connection

  try {
    const body = await req.json();
    const { name, email, password, contact } = body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const newUser = await User.create({
      _id: new Types.ObjectId(), // Correct instantiation
      name,
      email,
      password: hashedPassword,
      contact,
    });

    return NextResponse.json(
      { message: 'Signup Successful', user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error during signup:', error);

    // Check for duplicate key error (MongoDB E11000)
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Duplicate email error. Email already exists.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Signup Failed' },
      { status: 500 }
    );
  }
}
