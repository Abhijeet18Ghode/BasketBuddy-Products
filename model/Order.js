import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,  // Changed to Number for accuracy
    required: true,
  },
  // amountPaid: {
  //   type: Number,
  //   default: 0,
  // },
  // amountDue: {
  //   type: Number,
  //   required: true,
  // },
  paid: {
    type: Boolean,
    // required: true,
    default: false,  // Initially set to false, especially for COD
  },
  orderStatus: {
    type: String,
    enum: ['created','processing', 'shipped', 'delivered', 'cancelled'],
    default: 'created',
  },
  paymentMethod: {
    type: String,
    enum: ['online', 'cod'],  // 'cod' for Cash on Delivery
    // required: true,
    default: 'online',
  },
  trackingId: { type: String, required: false }, //make it true
  deliveredAt: { type: Date }, // New field for storing the delivery date
  createdAt: { type: Date, default: Date.now },
  
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
  },
  paymentDetails: {
    razorpayPaymentId: { type: String, required: function () {
      return this.paymentMethod === 'online';  // Required only for online payments
    }},
    razorpayOrderId: { type: String, required: function () {
      return this.paymentMethod === 'online';  // Required only for online payments
    }},
    razorpaySignature: { type: String, required: function () {
      return this.paymentMethod === 'online';  // Required only for online payments
    }},
  },
  trackingId: {
    type: String,
    required: false,  // Can be added post-creation
  },
  notes: {
    type: String,
    required: false,  // Optional for additional info
  },
}, { timestamps: true });  // Automatically adds createdAt and updatedAt


// Pre-save hook to handle `paid` field based on `paymentMethod` and `orderStatus`
orderSchema.pre('save', function (next) {
  if (this.paymentMethod === 'online') {
    this.paid = true;
  } else if (this.paymentMethod === 'cod') {
    if (this.orderStatus === 'delivered') {
      this.paid = true;
    } else {
      this.paid = false;
    }
  }
  next();
});

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
