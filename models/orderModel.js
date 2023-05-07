import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        unique: true,
      },
    ],
    payment: {
      type: {},
      lowercase: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      default: 'Not Processed',
      enum: ['Not Processed', 'Processing', 'Shipped', 'Delivered', 'Cancel'],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
