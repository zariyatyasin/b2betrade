import React from "react";
import { useDispatch, useSelector } from "react-redux";
import SchoolIcon from "@mui/icons-material/School";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { toggleSidebar } from "../../../../store/ExpandSlice";
import { signOut } from "next-auth/react";
import Link from "next/link";
export const Navbar = () => {
  const { expandSidebar } = useSelector((state) => ({ ...state }));
  const expand = expandSidebar.expandSidebar;
  const dispatch = useDispatch();
  return (
    <div
      className={`fixed top-0 mb-24 left-0 right-0 w-full pr-8
      bg-white border-b  
      flex items-center justify-between z-10   transition-all ease-in-out duration-300    h-[65px]    ${
        expand ? " md:pl-64" : " "
      }   `}
    >
      <div className={`flex items-center ml-6 text-black  `}>
        <div
          className="text-2xl md:text-3xl cursor-pointer"
          onClick={() => dispatch(toggleSidebar(true))}
        >
          <MenuOutlinedIcon />
        </div>
        <Link
          href="/"
          target="_blank"
          className="inline-block ml-2 focus:outline-none text-white font-bold text-xl  "
        >
          <span className=" text-blue-800"> B2B</span>
          <span className="  text-[#FFD700] text-xl  ">eTrade</span>
        </Link>
      </div>

      <div className="flex ml-2 flex-col  justify-center">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => signOut()}
        >
          <div className="mr-1"> Sign Out</div>
          <LogoutIcon />
        </div>
      </div>
    </div>
  );
};
