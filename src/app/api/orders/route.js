// import { NextResponse } from 'next/server';
// import mongooseConnection from '../../../../lib/mongoose'; // Adjust the import path as needed
// import Order from '../../../../model/Order'; // Correct path
// import { Product } from '../../../../model/Product';
// import { User } from '../../../../model/User'; // Assuming you have a User model

// export async function POST(request) {
//   try {
//     // Connect to MongoDB
//     await mongooseConnection();

//     // Parse the JSON body
//     const {
//       user,
//       productDetails,
//       shippingAddress,
//       paymentDetails, // Optional for online payments
//       paymentMethod,
//       notes, // Optional
//     } = await request.json();

//     // Validate the incoming data
//     if (
//       !user ||
//       !productDetails ||
//       !Array.isArray(productDetails) ||
//       productDetails.length === 0 ||
//       !paymentMethod ||
//       !shippingAddress
//     ) {
//       console.error('Invalid input:', { user, productDetails, shippingAddress, paymentMethod });
//       return NextResponse.json(
//         { message: 'Invalid input', data: { user, productDetails, shippingAddress, paymentMethod } },
//         { status: 400 }
//       );
//     }

//     console.log('Product Details:', productDetails);

//     // Validate user
//     const foundUser = await User.findById(user);
//     if (!foundUser) {
//       return NextResponse.json({ message: 'User not found' }, { status: 400 });
//     }

//     // Validate products and their quantities, and calculate total amount
//     let totalAmount = 0;
//     const productIds = productDetails.map(pd => pd.productId);
//     console.log('Product IDs:', productIds);

//     const products = await Product.find({ "_id": { $in: productIds } });
//     console.log('Fetched Products:', products);

//     // Check if all products exist
//     if (products.length !== productIds.length) {
//       return NextResponse.json({ message: 'One or more products not found' }, { status: 400 });
//     }

//     // Calculate the total amount based on product prices and quantities
//     const orderProducts = productDetails.map(pd => {
//       const product = products.find(p => p._id.toString() === pd.productId);
//       console.log('Matched Product:', product);
//       const productTotal = product.price * pd.quantity;
//       totalAmount += productTotal;

//       return {
//         productId: pd.productId,
//         quantity: pd.quantity,
//       };
//     });

//     // Mock function to calculate delivery charge based on location
//     const deliveryCharge = calculateDeliveryCharge(shippingAddress);

//     const normalizedPaymentMethod = paymentMethod.toLowerCase();

//     // Determine amountPaid and amountDue based on payment method
//     const amountPaid = normalizedPaymentMethod === 'online' ? totalAmount : 0;
//     const amountDue = totalAmount - amountPaid + deliveryCharge;

//     // Generate tracking ID
//     const trackingId = generateTrackingId();

//     // Generate a mock delivery date (7 days after order creation)
//     const deliveryDate = new Date();
//     deliveryDate.setDate(deliveryDate.getDate() + 7); // Delivery in 7 days

//     // Create the order
//     const newOrder = new Order({
//       user: user,
//       products: orderProducts,
//       shippingAddress,
//       amount: totalAmount,
//       amountDue,
//       amountPaid,
//       paymentMethod: normalizedPaymentMethod,
//       paymentDetails: normalizedPaymentMethod === 'online' ? paymentDetails : undefined,
//       notes: notes || undefined, // Optional
//       deliveryCharge,
//       trackingId,
//       deliveryDate, // Store the delivery date
//     });

//     await newOrder.save();

//     // Exclude sensitive information like payment details in the response
//     const orderResponse = {
//       _id: newOrder._id,
//       user: newOrder.user,
//       amount: newOrder.amount,
//       amountDue: newOrder.amountDue,
//       amountPaid: newOrder.amountPaid,
//       paid: newOrder.paid,
//       orderStatus: newOrder.orderStatus,
//       paymentMethod: newOrder.paymentMethod,
//       products: newOrder.products,
//       shippingAddress: newOrder.shippingAddress,
//       paymentDetails: newOrder.paymentDetails,
//       trackingId: newOrder.trackingId,
//       deliveryDate: newOrder.deliveryDate,
//       notes: newOrder.notes,
//       createdAt: newOrder.createdAt,
//       updatedAt: newOrder.updatedAt,
//     };

//     return NextResponse.json({ message: 'Order Created Successfully', order: orderResponse }, { status: 201 });
//   } catch (error) {
//     console.error('Error creating order:', error);
//     return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
//   }
// }

// // Mock function to generate tracking ID
// function generateTrackingId() {
//   const prefix = 'IND';
//   const randomNumber = Math.floor(Math.random() * 1000000);
//   const timestamp = Date.now();
//   return `${prefix}${randomNumber}${timestamp}`;
// }

// // Mock function to calculate delivery charge based on location
// function calculateDeliveryCharge(shippingAddress) {
//   const { city } = shippingAddress;
//   if (city === 'Delhi') return 50;
//   else if (city === 'Mumbai') return 70;
//   else return 100; // Default charge for other locations
// }



import { NextResponse } from 'next/server';
import mongooseConnection from '../../../../lib/mongoose'; // Adjust the import path as needed
import Order from '../../../../model/Order';
import { Product } from '../../../../model/Product';
import { User } from '../../../../model/User';
import { v4 as uuidv4 } from 'uuid'; // For tracking ID generation

export async function POST(request) {
  try {
    // Connect to MongoDB
    await mongooseConnection();

    // Parse the JSON body
    const {
      user,
      productDetails,
      shippingAddress,
      paymentDetails, // Optional for online payments
      paymentMethod,
      notes, // Optional
    } = await request.json();

    // Input validation
    if (
      !user ||
      !productDetails ||
      !Array.isArray(productDetails) ||
      productDetails.length === 0 ||
      !paymentMethod ||
      !shippingAddress
    ) {
      return NextResponse.json(
        { message: 'Invalid input. Ensure all required fields are provided.' },
        { status: 400 }
      );
    }

    // Validate user existence
    const foundUser = await User.findById(user);
    if (!foundUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Validate product existence and calculate total amount
    const productIds = productDetails.map((pd) => pd.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== productIds.length) {
      return NextResponse.json({ message: 'One or more products not found' }, { status: 404 });
    }

    const { totalAmount, orderProducts } = productDetails.reduce(
      (acc, pd) => {
        const product = products.find((p) => p._id.toString() === pd.productId);
        if (product) {
          const productTotal = product.price * pd.quantity;
          acc.totalAmount += productTotal;
          acc.orderProducts.push({ productId: pd.productId, quantity: pd.quantity });
        }
        return acc;
      },
      { totalAmount: 0, orderProducts: [] }
    );

    // Calculate delivery charge
    const deliveryCharge = calculateDeliveryCharge(shippingAddress);

    // Normalize payment method
    const normalizedPaymentMethod = paymentMethod.toLowerCase();

    // Determine amounts based on payment method
    const amountPaid = normalizedPaymentMethod === 'online' ? totalAmount : 0;
    const amountDue = totalAmount - amountPaid + deliveryCharge;

    // Generate tracking ID and delivery date
    const trackingId = uuidv4();
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7); // 7 days from now

    // Create the order
    const newOrder = new Order({
      user,
      products: orderProducts,
      shippingAddress,
      amount: totalAmount,
      amountDue,
      amountPaid,
      paymentMethod: normalizedPaymentMethod,
      paymentDetails: normalizedPaymentMethod === 'online' ? sanitizePaymentDetails(paymentDetails) : undefined,
      notes: notes || undefined,
      deliveryCharge,
      trackingId,
      deliveryDate,
    });

    await newOrder.save();

    // Prepare response object
    const orderResponse = {
      _id: newOrder._id,
      user: newOrder.user,
      amount: newOrder.amount,
      amountDue: newOrder.amountDue,
      amountPaid: newOrder.amountPaid,
      paid: newOrder.paid,
      orderStatus: newOrder.orderStatus,
      paymentMethod: newOrder.paymentMethod,
      products: newOrder.products,
      shippingAddress: newOrder.shippingAddress,
      trackingId: newOrder.trackingId,
      deliveryDate: newOrder.deliveryDate,
      notes: newOrder.notes,
      createdAt: newOrder.createdAt,
      updatedAt: newOrder.updatedAt,
    };

    return NextResponse.json({ message: 'Order Created Successfully', order: orderResponse }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

// Utility to generate delivery charge
function calculateDeliveryCharge(shippingAddress) {
  const { city } = shippingAddress;
  if (city === 'Delhi') return 50;
  if (city === 'Mumbai') return 70;
  return 100; // Default charge
}

// Utility to sanitize payment details (for security)
function sanitizePaymentDetails(paymentDetails) {
  const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = paymentDetails || {};
  return { razorpayPaymentId, razorpayOrderId, razorpaySignature };
}
