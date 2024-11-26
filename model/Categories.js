import mongoose from 'mongoose';

// Define the Subcategory schema with name, description, and image fields
const SubcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: false,
  },
  image: { 
    type: String, // URL to the subcategory image
    required: false,
  },
});

// Define the Category schema including subcategories
const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  image: { 
    type: String, // URL to the category image
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  subcategories: [SubcategorySchema], // Array of Subcategory schema
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the Category model
export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
