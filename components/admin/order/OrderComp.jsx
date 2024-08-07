"use client";
import React, { useEffect, useState } from "react";
import { MiniSearchBar } from "../../search/Searchbar";
import { useSearchParams } from "next/navigation";
import Table from "../../../components/Table/Table";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import SortingDropdown from "../../selects/SortingDropdown";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import OrderCard from "../../cards/OrderCard";
import { useSession } from "next-auth/react";
export default function OrderComp({ Orders, paginationCount, user }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const headers = {
    storeName: "Shipping Address",
    categorySubCategory: "Products",
    active: "User Details",

    status: "Order Details",

    edit: "Edit",
  };

  let linkUrl =
    session?.user.role === "admin"
      ? "/admin/dashboard/order"
      : "/supplier/dashboard/order";

  const filterUrl = ({ page, sort, sortbydate }) => {
    const currentQuery = new URLSearchParams(searchParams.toString());

    if (page !== undefined) {
      currentQuery.set("page", page);
    }
    if (sort !== undefined) {
      currentQuery.set("sort", sort);
    }
    if (sortbydate !== undefined) {
      currentQuery.set("sortbydate", sortbydate);
    }
    const queryStr = currentQuery.toString();

    const newUrl = `${pathname}?${queryStr}`;

    router.push(newUrl, { scroll: false });
  };
  const sortbydateHandler = (sortbydate) => {
    if (sortbydate) {
      filterUrl({ sortbydate });
    } else {
      const currentQuery = new URLSearchParams(searchParams.toString());
      currentQuery.delete("sortbydate");
      router.push(`${pathname}?${currentQuery.toString()}`, { scroll: false });
    }
  };
  const pageHandler = (e, page) => {
    filterUrl({ page });
  };
  const sortHandler = (sort) => {
    if (sort) {
      filterUrl({ sort });
    } else {
      const currentQuery = new URLSearchParams(searchParams.toString());
      currentQuery.delete("sort");
      router.push(`${pathname}?${currentQuery.toString()}`, { scroll: false });
    }
  };
  const sortbydatte = [
    {
      name: "Recommend",
      value: "",
    },
    {
      name: "newest",
      value: "newest",
    },
    {
      name: "oldest",
      value: "oldest",
    },
    {
      name: "high to low",
      value: "hightolow",
    },
    {
      name: "low to high",
      value: "lowtohigh",
    },

    // ... (other sorting options)
  ];
  const sortingOptions = [
    {
      name: "Recommend",
      value: "",
    },
    {
      name: "Not Processed",
      value: "Not Processed",
    },
    {
      name: "Processing",
      value: "Processing",
    },
    {
      name: "Dispatched",
      value: "Dispatched",
    },
    {
      name: "Cancelled",
      value: "Cancelled",
    },
    {
      name: "Completed",
      value: "Completed",
    },
    // ... (other sorting options)
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center mb-2 ">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Orders</h1>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-[#2B39D1] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Add Order
          </button>
        </div>
      </div>
      <MiniSearchBar />
      <div className="   flex  items-center justify-end mt-2">
        <button
          className="border text-sm   p-2 bg-[#2B39D1] text-white rounded-3xl  "
          onClick={() => router.push(linkUrl)}
        >
          Clear All ({Array.from(searchParams).length})
        </button>
        <SortingDropdown
          sortingOptions={sortingOptions}
          sortHandler={sortHandler}
        />
        <SortingDropdown
          sortingOptions={sortbydatte}
          sortHandler={sortbydateHandler}
        />
      </div>
      <Table headers={headers} data={Orders} CardComponent={OrderCard} />

      <Stack spacing={2}>
        <Pagination
          count={paginationCount}
          defaultPage={Number(searchParams.get("page")) || 1}
          onChange={pageHandler}
          variant="outlined"
          shape="rounded"
        />
      </Stack>
    </div>
  );
}
