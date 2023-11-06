import Link from "next/link";
import React from "react";

export default function BuyerRequestCard({ productData }) {
  return (
    <div className="bg-white hover:bg-slate-100 cursor-pointer p-6 ">
      <Link href={`/buyerrequest/details/${productData._id}`}>
        <div className="flex items-center mb-4">
          <div className="w-full">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-[#333333] mb-2">
                {productData.productName}
              </h2>
              {productData.argent && (
                <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs m-1">
                  Argent
                </span>
              )}
            </div>

            <p className="text-gray-700 text-sm mb-4">
              {productData.description}
            </p>
            <div className="flex justify-between items-center mb-2">
              <p className="text-base text-yellow-600 font-semibold">
                ${productData.budget}
              </p>
              <p className="text-gray-500 text-sm">
                {productData.quantity} units
              </p>
            </div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-700 text-sm">
                Delivery Date: {productData.deliveryDate}
              </p>
              <p className="text-gray-700 text-sm">
                Location: {productData.location}
              </p>
            </div>
            <div className="flex flex-wrap mb-2">
              {productData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs m-1"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap">
              {productData.images.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Product Image ${index}`}
                  className="w-16 h-16 object-cover m-1 rounded-lg border-2 border-green-600"
                />
              ))}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}