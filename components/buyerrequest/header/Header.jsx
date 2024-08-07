"use client";
import React, { useEffect, useState } from "react";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SearchIcon from "@mui/icons-material/Search";

import Usermenu from "../../Header/Usermenu";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";

import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

import Link from "next/link";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
const publishingOptions = [
  {
    title: "B2B",
    description: "Tailored for business-to-business interactions.",
    current: true,
  },
  {
    title: "B2C",
    description: "Designed for business-to-consumer interactions.",
    current: false,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const Header = ({ categories, subCategories }) => {
  const session = useSession();
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const router = useRouter();
  const [quary, setQuary] = useState(search);
  const [isLogin, setLogin] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [selected, setSelected] = useState(publishingOptions[0]);
  const handleUserMenuOpen = () => {
    setOpen(true);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (quary?.length > 1) {
      const currentSearchParams = new URLSearchParams(window.location.search);

      // Modify the search parameter
      currentSearchParams.set("search", quary);

      // Generate the new URL with the modified search parameter
      const newURL = `${
        window.location.pathname
      }?${currentSearchParams.toString()}`;

      // Use the `router.push` function to navigate to the new URL
      router.push(newURL, undefined, { shallow: true });
    } else {
      router.push("/browse", { shallow: true });
    }
  };

  const handleUserMenuClose = () => {
    setOpen(false);
  };

  return (
    <div className=" p-4 ">
      <div className="relative z-30 flex flex-col justify-center w-full shrink-0">
        <div className="flex flex-col w-full mx-auto">
          <form
            className="relative flex w-full rounded-md"
            noValidate=""
            role="search"
          >
            <label
              htmlFor="top-bar-search"
              className="flex flex-1 items-center py-0.5"
            >
              <input
                id="top-bar-search"
                className="text-heading border showdow  p-6  outline-none w-full h-[52px] ltr:pl-5 rtl:pr-5 md:ltr:pl-6 md:rtl:pr-6 ltr:pr-14 rtl:pl-14 md:ltr:pr-16 md:rtl:pl-16   text-brand-dark text-sm lg:text-15px rounded-md transition-all duration-200 focus:border-brand focus:ring-0 placeholder:text-brand-dark/50 "
                placeholder="What are you looking..."
                aria-label="top-bar-search"
                name="search"
              />
            </label>
            <span className="absolute top-0 right-2 flex items-center justify-center h-full w-14 md:w-16 ltr:right-0 rtl:left-0 shrink-0 focus:outline-none text-gray-500">
              <SearchIcon sx={{ fontSize: 24 }} />
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};
