import { NextResponse } from "next/server";
import mongooseConnection from "../../../../lib/mongoose";
import Category from '../../../../model/Categories'; // Your Mongoose Category model

let isConnected = false;

async function connectToDatabase() {
  if (isConnected) return;
  await mongooseConnection();
  isConnected = true;
}

export async function GET(req) {
  try {
    if (req.method === "GET") {
      await connectToDatabase();

  

      const categories = await Category.find();
      return NextResponse.json({ categories }, { status: 200 });
    }

    return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
