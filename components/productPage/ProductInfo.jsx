"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Rating from "@mui/material/Rating";
import axios from "axios";
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Accordian from "../accordion/Accordion";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateCart } from "../../store/cartSlice";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
const ProductInfo = ({ product, setActiveImg, params }) => {
  const priceRange = [
    { minQty: 0, maxQty: 5, price: 45.0 },
    { minQty: 6, maxQty: 10, price: 1 },
    { minQty: 20, maxQty: 49, price: 40.5 },
    { minQty: 50, maxQty: 99, price: 36.0 },
    { minQty: 100, maxQty: Infinity, price: 33.75 },
  ];
  const [priceRanges, setPriceRanges] = useState(priceRange); // Initialize with an empty array
  const [selectedRange, setSelectedRange] = useState(null); // Initialize with null

  const UrlSize = params?.slug[2];
  const UrlStyle = params?.slug[1];
  const { cart } = useSelector((state) => ({ ...state }));
  const [size, setSize] = useState(UrlSize);
  const [qty, setQty] = useState(1);
  const [totalPrice, setTotalPrice] = useState(product.price);
  const [staySize, setStaySize] = useState(
    UrlSize !== undefined ? parseInt(UrlSize) : -1
  );

  const dispatch = useDispatch();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  useEffect(() => {
    // Find the correct price based on the selected quantity
    const selectedPriceRange = priceRanges.find(
      (range) => qty >= range.minQty && qty <= range.maxQty
    );

    if (selectedPriceRange) {
      setTotalPrice(selectedPriceRange.price * qty);
    }
  }, [qty]);

  useEffect(() => {
    if (selectedRange) {
      setTotalPrice(selectedRange.price * qty);
    }
  }, [qty, selectedRange]);

  useEffect(() => {
    setSize(UrlSize);
    setQty(1);
  }, [UrlStyle]);
  useEffect(() => {
    if (staySize !== -1) {
      setSize(product.size[staySize].size);
    }
  }, [staySize, product.size]);
  useEffect(() => {
    if (qty > product.quantity) {
      setQty(product.quantity);
    }
  }, [UrlSize]);

  const handleSizeSelection = (size) => {
    setSize(size.size);
    setStaySize(size.index);
  };
  const handleRangeSelect = (range) => {
    setSelectedRange(range);

    // Set qty based on the selected range
    setQty(range.minQty);

    // Calculate total price based on the selected range and qty
    setTotalPrice(range.price * range.minQty);
  };

  const handleQtyDecrease = () => {
    if (qty > 1) {
      setQty((prev) => prev - 1);
      const selectedPriceRange = priceRanges.find(
        (range) => qty - 1 >= range.minQty && qty - 1 <= range.maxQty
      );

      if (selectedPriceRange) {
        setTotalPrice(selectedPriceRange.price * (qty - 1));
        setSelectedRange(selectedPriceRange);
      }
    }
  };
  console.log(qty);

  const handleQtyIncrease = () => {
    if (qty < product.quantity) {
      setQty((prev) => prev + 1);
      const selectedPriceRange = priceRanges.find(
        (range) => qty + 1 >= range.minQty && qty + 1 <= range.maxQty
      );

      if (selectedPriceRange) {
        setTotalPrice(selectedPriceRange.price * (qty + 1));
        setSelectedRange(selectedPriceRange);
      }
    }
  };

  const addToCartHandler = async () => {
    if (!UrlSize) {
      setError("Please Select a size");
      return;
    }
    const { data } = await axios.get(
      `/api/product/${product._id}/${UrlStyle}/${UrlSize}`
    );
    if (qty > data.quantity) {
      setError(
        "The Quantity you have choosed is more than in stock. Try and lower the Qty"
      );
    } else if (data.quantity < 1) {
      setError("This Product is out of stock.");
      return;
    } else {
      let _uid = `${data._id}_${product.style}_${UrlSize}`;
      let exist = cart.cartItems.find((p) => p._uid === _uid);

      if (exist) {
        let newCart = cart.cartItems.map((p) => {
          if (p._uid == exist._uid) {
            return { ...p, qty: qty };
          }
          return p;
        });
        dispatch(updateCart(newCart));
      } else {
        dispatch(
          addToCart({
            ...data,
            qty,
            size: data.size,
            _uid,
          })
        );
      }
    }
  };

  return (
    <div className="flex-1">
      <h1 className="text-lg font-medium text-qblack mb-2 ">{product.name}</h1>
      <div className="  flex items-center">
        <Rating
          name="hover-feedback"
          defaultValue={product.rating}
          readOnly
          sx={{ fontSize: 18 }}
          precision={0.5}
        />
        <p className="ml-2 text-sm font-medium text-gray-600">
          {product.numReviews} {product.numReviews > 1 ? "reviews" : "review"}
        </p>
      </div>
      <div className="flex items-end mt-2">
        <h1 className="text-lg font-bold text-green-500">
          {!size ? product.priceRange : `৳${product.price}`}
        </h1>
        {product.discount > 0 && size && (
          <div className="ml-2">
            <span className="text-xs line-through text-gray-500 mr-2">
              ${product.priceBefore}
            </span>
            <span className="text-red-500 text-xs rounded-full bg-[#ff6f61] px-2">
              {product.discount}%
            </span>
          </div>
        )}
      </div>
      {/* <div className="mt-1 text-green-500 text-sm font-semibold">
        {product.shipping ? `+${product.shipping}$ shipping` : "Free Shipping"}
      </div> */}
      {/* <p className="mt-2 text-sm text-gray-600">
        {size
          ? `${product.quantity} pieces available.`
          : `Total available: ${product.size.reduce(
              (start, next) => start + next.qty,
              0
            )} pieces.`}
      </p> */}
      <h2 className="mt-2 text-lg font-medium  text-gray-900">
        Select the Size
      </h2>
      <div className="mt-2 flex select-none flex-wrap items-center gap-2">
        {product.size.map((size, i) => (
          <Link
            href={`/product/${product.slug}/${UrlStyle}/${i}`}
            key={i}
            onClick={() => setStaySize(i)}
          >
            <div
              key={i}
              className={`rounded-lg border ${
                i === staySize ? "bg-black text-white" : "border-black"
              }  p-2 font-medium cursor-pointer hover:bg-black hover:text-white text-sm transition-all duration-300 ease-in-out`}
              onClick={() => handleSizeSelection({ size: size.size, index: i })}
            >
              {size.size}
            </div>
          </Link>
        ))}
      </div>
      <h2 className="mt-4 text-lg font-semibold text-gray-900">Color</h2>
      <div className="mt-2 flex select-none flex-wrap items-center gap-2">
        {product.colors &&
          product.colors.map((color, i) => (
            <div
              onMouseOver={() =>
                setActiveImg(product.subProducts[i].images[0].url)
              }
              onMouseLeave={() => setActiveImg("")}
              key={i}
            >
              <Link href={`/product/${product.slug}/${i}`}>
                {color?.image ? (
                  <img src={color?.image} className="h-5 w-5 rounded-full" />
                ) : (
                  <div
                    className={`h-5 w-5 rounded-full`}
                    style={{ backgroundColor: color.color }}
                  ></div>
                )}
              </Link>
            </div>
          ))}
      </div>
      {priceRanges.map((range, index) => (
        <div
          key={index}
          onClick={() => handleRangeSelect(range)}
          className={`rounded-lg border p-2 font-medium cursor-pointer ${
            range === selectedRange ? "bg-black text-white" : "border-black"
          }`}
        >
          {`Quantity ${range.minQty} - ${range.maxQty}: $${range.price.toFixed(
            2
          )}`}
        </div>
      ))}
      <div className="text-2xl font-bold mt-4 text-green-500">
        Total Price: {totalPrice}
      </div>
      <div className="mt-2 flex select-none flex-wrap items-center gap-2">
        <div className="bg-gray-100 h-10 p-1 rounded-lg flex flex-row relative mt-1">
          <button
            className="inline-flex items-center px-3 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 ease-in-out"
            onClick={handleQtyDecrease}
          >
            <RemoveOutlinedIcon sx={{ fontSize: 14 }} />
          </button>
          <div className="p-4 flex items-center text-lg font-semibold">
            {qty}
          </div>
          <button
            className="inline-flex items-center px-3 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 ease-in-out"
            onClick={handleQtyIncrease}
          >
            <AddOutlinedIcon sx={{ fontSize: 14 }} />
          </button>
        </div>
      </div>
      <div className="mt-2 flex flex-col items-center space-y-4 border-t border-b py-4 sm:flex-row sm:space-y-0">
        <button
          disabled={product.quantity < 1}
          type="button"
          className="inline-flex items-center justify-center border-2 border-transparent border-green-500  text-green-500 rounded-md bg-none px-6  py-2   text-center text-sm uppercase font-semibold  transition-all duration-300 ease-in-out  mr-2 "
        >
          Contact Supplier
        </button>
        <button
          disabled={product.quantity < 1}
          type="button"
          className="inline-flex items-center justify-center border-2 border-transparent  bg-green-500 rounded-md bg-none px-6  py-2   text-center text-sm uppercase font-semibold text-white transition-all duration-300 ease-in-out  "
          onClick={() => addToCartHandler()}
        >
          Add to cart
        </button>
        <div className="ml-6">
          <FavoriteBorderOutlinedIcon sx={{ fontSize: 32 }} />
        </div>
      </div>
      {error && <span className="text-red-600 mt-2">{error}</span>}
      <ul className="mt-5 flex items-center">
        <li className="flex items-center text-left text-sm font-medium text-gray-600">
          <svg
            className="mr-2 block h-5 w-5 align-middle text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              className=""
            ></path>
          </svg>
          Cancel Anytime
        </li>
      </ul>
      <Accordian details={[product.description, ...product.details]} />
    </div>
  );
};

export default ProductInfo;
