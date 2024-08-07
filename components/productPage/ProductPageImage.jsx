"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

import { Pagination, Navigation, Autoplay } from "swiper/modules";
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

  const nextImage = () => {
    setActive((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActive((prev) => (prev - 1 + images.length) % images.length);
  };

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
      <div className="mt-2 lg:mt-0 lg:mr-5  ">
        <div className="">
          {/* <div className="cursor-pointer" onClick={prevImage}>
            {"<"}
          </div> */}
          <Swiper
            slidesPerView={3}
            spaceBetween={15}
            breakpoints={{
              640: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 5,
                spaceBetween: 40,
              },
              1024: {
                slidesPerView: 6,
                spaceBetween: 30,
              },
            }}
            navigation={true}
            modules={[Navigation, Autoplay]}
            className="mySwiper"
          >
            {images?.map((img, id) => (
              <SwiperSlide
                key={id}
                tyle={{ backgroundColor: "transparent" }}
                className=" bg-none"
              >
                <div
                  className={`w-16 h-16 rounded-md overflow-hidden ${
                    id === active && "border-2 border-[#2B39D1]"
                  } text-center`}
                  key={id}
                  onMouseOver={() => setActive(id)}
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
          {/* {images?.map((img, i) => (
            <div
              className={`w-16 h-16 rounded-md overflow-hidden ${
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
          ))}
          <div className="cursor-pointer" onClick={nextImage}>
            {">"}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ProductPageImage;
