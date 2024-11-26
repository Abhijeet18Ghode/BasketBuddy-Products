import mongooseConnection from '../../../../../lib/mongoose';
import Product from '../../../../../model/Product';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await mongooseConnection();

    const body = await req.json(); // Properly parse the JSON body

    const { productIds } = body;

  
    if (!productIds || !Array.isArray(productIds)) {
      return NextResponse.json({ error: 'Invalid request body. Expected an array of product IDs.' }, { status: 400 });
    }

    const products = await Product.find({ _id: { $in: productIds } });

    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error) {
    console.error('Error fetching products by IDs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
