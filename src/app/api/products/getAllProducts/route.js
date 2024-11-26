export const dynamic = 'force-dynamic'; // Ensures fresh content on every request

import { NextResponse } from "next/server";
import mongooseConnection from "../../../../../lib/mongoose";
import Products from "../../../../../model/Product";

let isConnected = false;

async function connectToDatabase() {
  if (isConnected) return;
  await mongooseConnection();
  isConnected = true;
}

export async function GET(req) {
  try {
    await connectToDatabase();

    const AllProducts = await Products.find({});

    return NextResponse.json(
      { AllProducts },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
