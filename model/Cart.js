import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const cartSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: ObjectId,
          ref: "Product",
        },
        storeId:{ type: ObjectId, ref:"Store"},
        name: String,
        image: String,
        size: String,
        qty: Number,
        color: {
          color: String,
          image: String,
        },
        price: Number,
      },
    ],
    cartTotal: Number,
    totalAfterDiscount: Number,
    user: {
      type: ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);

export default Cart;
