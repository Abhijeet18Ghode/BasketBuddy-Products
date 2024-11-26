import mongooseConnection from '../../../../../lib/mongoose';
import { User } from '../../../../../model/User'; // Ensure this path is correct
import mongoose from 'mongoose'; // Import mongoose for ObjectId
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { userId, productId } = await req.json();
        if (!userId || !productId) {
            return NextResponse.json({ message: 'User ID and Product ID are required' }, { status: 400 });
        }

        await mongooseConnection();

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: 'User Not Found' }, { status: 404 });
        }

        // Ensure wishlist exists
        if (!user.wishlist) {
            user.wishlist = { items: [] }; // Initialize if not present
        }

        // Convert productId to ObjectId
        const productObjectId = new mongoose.Types.ObjectId(productId);

        // Check if the item already exists in the wishlist
        const itemIndex = user.wishlist.items.findIndex(item => {
            // Convert existing productId to ObjectId for comparison
            return item.productId.equals(productObjectId);
        });

        if (itemIndex > -1) {
            // Item exists, remove it from the wishlist
            user.wishlist.items.splice(itemIndex, 1);
            await user.save();
            return NextResponse.json({ message: 'Item removed from wishlist' }, { status: 200 });
        } else {
            // Item does not exist, add it to the wishlist
            user.wishlist.items.push({ productId: productObjectId });
            await user.save();
            return NextResponse.json({ message: 'Item added to wishlist' }, { status: 200 });
        }
    } catch (error) {
        console.error('Error toggling wishlist item:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
