"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import Image from "next/image";
const ProductPageImage = ({ images, activeImg }) => {
  const modifyImageUrl = (url) => {
    const uploadIndex = url?.indexOf("/upload/");
    if (uploadIndex !== -1) {
      const modifiedUrl =
        url?.slice(0, uploadIndex + 8) +
        "f_auto,q_auto/" +
        url?.slice(uploadIndex + 8);
      return modifiedUrl;
    }
    return url;
  };
  const [active, setActive] = useState(0);
  return (
    <div className="lg:w-1/3 flex-1 w-full bg-white p-4 shadow rounded-md">
      <div className="w-full flex justify-center items-center overflow-hidden relative mb-3">
        <div className="flex justify-center">
          {images && (
            <Image
              height={500}
              width={500}
              className="w-full h-80  lg:h-[400px] object-contain"
              src={activeImg || modifyImageUrl(images[active]?.url)}
              alt=""
            />
          )}
        </div>
      </div>
      <div className="mt-2 lg:mt-0 lg:mr-5">
        <div className="flex   ">
          <Swiper slidesPerView={4} spaceBetween={10} navigation={true}>
            {images?.map((img, i) => (
              <SwiperSlide key={i}>
                <div
                  className={` w-16 h-16 rounded-md overflow-hidden   ${
                    i === active && "border-2 border-[#2B39D1]"
                  } text-center`}
                  key={i}
                  onMouseOver={() => setActive(i)}
                >
                  <Image
                    height={500}
                    width={500}
                    className="h-full w-full object-cover"
                    src={modifyImageUrl(img.url)}
                    alt=""
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>

    // <div class="w-full h-[600px] border border-qgray-border flex justify-center items-center overflow-hidden relative mb-3">
    //   <img
    //     src={activeImg || images[active].url}
    //     alt=""
    //     class="object-contain"
    //   />
    //   <div class="w-[80px] h-[80px] rounded-full bg-qyellow text-qblack flex justify-center items-center text-xl font-medium absolute left-[30px] top-[30px]">
    //     <span>-50%</span>
    //   </div>
    // </div>
  );
};

export default ProductPageImage;
