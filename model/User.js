import mongoose from 'mongoose'; // Ensure mongoose is imported
const { Schema, models, model } = require('mongoose');

// Define the schema for cart items
const cartItemSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true }
}, { _id: false }); // Disable _id for subdocuments

// Define the schema for the cart
const cartSchema = new Schema({
    items: [cartItemSchema],
    totalAmount: { type: Number, required: true, default: 0 }
}, { timestamps: true });


const wishlistItemSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true }
}, { _id: false });

const wishlistSchema = new Schema({
    items: [wishlistItemSchema]
}, { timestamps: true });


// Add cart to the User schema
const UserSchema = new Schema({
    // _id: { // Auto-generate ID
    //     type: Schema.Types.ObjectId,
    //     default: () => new Schema.Types.ObjectId(),
    // },

    _id: { // Explicitly define _id
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(), // Correct instantiation
    },
    name: { type: String, required: true }, // Add required validation
    email: { type: String, required: true, unique: true }, // Add unique constraint
    image: String,
    city: String,
    zip: String,
    address: String,
    state: String,
    contact: String,
    password: { type: String }, // Make password optional if needed
    role: String,
    // orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }], // Reference orders instead of embedding
    cart: cartSchema, // Embed the cart in the user schema
    wishlist: {
        items: [{
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product', // Reference to the Product model
            },
        }],
    },// Embed the wishlist in the user schema
}, {
    timestamps: true
});

export const User = models.user || model('user', UserSchema);
