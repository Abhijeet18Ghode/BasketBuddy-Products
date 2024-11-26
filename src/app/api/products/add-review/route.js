import { NextResponse } from "next/server";
import mongooseConnection from "../../../../../lib/mongoose";
import Products from "../../../../../model/Product";

export async function POST(req) {
    await mongooseConnection();
    try {
        const { reviewData } = await req.json();

        console.log("Received reviewData: ", reviewData);

        // Ensure reviewData is an array
        if (!reviewData || !Array.isArray(reviewData) || reviewData.length === 0) {
            throw new Error("Invalid reviewData format");
        }

        // Extract the first review item from the array
        const review = reviewData[0];
        const { id, name, rating, comment, reviewImage} = review;
        const productId = id[0]; // Assuming id is an array with a single value

        console.log("Product ID: ", productId);

        // Find the product by ID
        const product = await Products.findById(productId);
        
        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        // Initialize reviews array if it doesn't exist
        if (!product.reviews) {
            product.reviews = [];
        }

        // Add the review to the product
        product.reviews.push({
            reviewerName: name,
            rating: rating, // Ensure rating is an integer
            comment: comment,
            reviewImage:reviewImage
        });

        // Save the updated product
        await product.save();

        return NextResponse.json({ product }, { status: 200 });
    } catch (error) {
        console.error("Error in POST /api/products/add-review: ", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
