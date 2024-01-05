import React from "react";
import Layout from "../../../../components/seller/layout/Layout";
import OrderComp from "../../../../components/admin/order/OrderComp";
import db from "../../../../utils/db";

import {
  filterArray,
  randomize,
  removeDuplicates,
} from "../../../../utils/Array";

import Order from "../../../../model/Order";
import Store from "../../../../model/Store";
import User from "../../../../model/User";
import Category from "../../../../model/Category";
import SubCategory from "../../../../model/SubCategory";

import { getCurrentUser } from "../../../../utils/session";
import { redirect } from "next/navigation";

export async function getData({ params, searchParams }) {
  db.connectDb();

  const session = await getCurrentUser();
  if (!session) {
    redirect("/signin");
  }
  const page = searchParams.page || 1;
  const searchQuery = searchParams.search || "";
  const sortQuery = searchParams.sort || "";
  const pageSize = 10;
  let Orders;
  const sort =
    sortQuery == ""
      ? {}
      : sortQuery == "Not Processed"
      ? { status: "Not Processed" }
      : sortQuery == "Processing"
      ? { status: "Processing" }
      : sortQuery == "Dispatched"
      ? { status: "Dispatched" }
      : sortQuery == "Cancelled"
      ? { status: "Cancelled" }
      : sortQuery == "Completed"
      ? { status: "Completed" }
      : sortQuery == "newest"
      ? { createdAt: -1 }
      : {};
  const search =
    searchQuery && searchQuery !== ""
      ? {
          orderNumber: {
            $regex: searchParams.search,
            $options: "i",
          },
        }
      : {};

  // If the user is not an admin, fetch only their Order

  const store = await Store.findOne({ owner: session.id });
  const OwnerStoreId = store._id;
  Orders = await Order.find();

  let totalProducts = await Order.countDocuments({ ...search });

  return {
    Orders: JSON.parse(JSON.stringify(Orders)),
    paginationCount: Math.ceil(totalProducts / pageSize),
  };
}
export default async function page({ searchParams }) {
  const { Orders, paginationCount } = await getData({ searchParams });
  console.log(Orders);
  const componentKey = Date.now();
  return (
    <Layout>
      <OrderComp
        linkhref={"/supplier/dashboard/order"}
        key={componentKey}
        Orders={Orders}
        paginationCount={paginationCount}
      />
    </Layout>
  );
}
