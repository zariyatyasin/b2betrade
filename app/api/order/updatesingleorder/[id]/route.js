import { NextResponse } from "next/server";
import db from "../../../../../utils/db";
import { getCurrentUser } from "../../../../../utils/session";
import Order from "../../../../../model/Order";
import User from "../../../../../model/User";

export const PUT = async (request, { params }) => {
  const session = await getCurrentUser();

  if (!session) {
    return NextResponse.json("You must be logged in", {
      status: 201,
    });
  }

  try {
    await db.connectDb();
    const { id } = params;
 
    const editedData = await request.json();
    const { product, status, otherFields } = editedData;

    const order = await Order.findById(id);

  

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const productIndex = order.products.findIndex(
      (product) => product.toString() === product.toString()
    );

    if (productIndex === -1) {
      return NextResponse.json(
        { message: "Product not found in order" },
        { status: 404 }
      );
    }
   
    order.products[productIndex].status = status;
     
    const updatedOrder = await order.save();

    const newUpdatedOrder = await Order.findById(updatedOrder._id).populate({
      path: "user",
      model: User,
    });

    db.disconnectDb();

    return NextResponse.json(
      {
        message: "Product updated successfully!",
        newUpdatedOrder,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
