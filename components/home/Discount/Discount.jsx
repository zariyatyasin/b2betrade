import React from "react";

const Discount = () => {
  return (
    <div className="bg-gray-50">
      <div className=" px-4  sm:px-6   lg:px-8 mb-12 md:mb-14 lg:mb-16">
        {/* Details section */}
        <section aria-labelledby="details-heading">
          {/* <div className="flex flex-col items-center ">
            <h2
              id="details-heading"
              className="text-lg md:text-xl lg:text-2xl 2xl:text-3xl xl:leading-10 font-bold text-heading text-gr"
            >
              On Selling Products
            </h2>
          </div> */}

          <div className="mt-16 grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-8">
            <div>
              <div className="w-full aspect-w-3 aspect-h-2   overflow-hidden">
                <img
                  src="/image/hero/4.webp"
                  alt="Drawstring top with elastic loop closure and textured interior padding."
                  className="w-full h-full object-center object-cover"
                />
              </div>
            </div>
            <div>
              <div className="w-full aspect-w-3 aspect-h-2    overflow-hidden">
                <img
                  src="/image/hero/1.webp"
                  alt="Front zipper pouch with included key ring."
                  className="w-full h-full object-center object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Discount;
