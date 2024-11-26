import mongoose from 'mongoose';

// Define the schema for a review
const reviewSchema = new mongoose.Schema({
  reviewerName: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  reviewImage:{type:String },
  comment: { type: String, required: true }
}, { _id: false }); // Disable _id for subdocuments

// Define the main product schema
const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  brand: { type: String },
  tags: { type: String },
  discountPrice: { type: Number },
  description: { type: String },
  warranty: { type: Number },
  returnPolicy: { type: Number },
  stockQuantity: { type: Number, required: true },
  thumbnail: { type: [String] }, // Changed to an array of strings
  images: { type: [String] },    // Assuming images is an array of strings
  reviews: [reviewSchema]        // Added reviews field
});


export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
