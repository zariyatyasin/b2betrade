import React from "react";

import Store from "../../../model/Store";
import User from "../../../model/User";
import Product from "../../../model/Product";
import Category from "../../../model/Category";
import SubCategory from "../../../model/SubCategory";
import StoreHeader from "../../../components/store/storeHeader/StoreHeader";
import StoreNavbar from "../../../components/store/storeHeader/StoreNavbar";
import ProductCardSwip from "../../../components/cards/ProductCardSwip";

import Footer from "../../../components/Footer/Footer";
import MainpageLayout from "../../../components/layout/MainpageLayout";

async function getData({ params }) {
  let StoreData = await Store.findById(params.id)
    .populate({
      path: "owner",
      model: User,
    })
    .populate({
      path: "products",
      model: Product,
    })
    .populate({
      path: "category",
      model: Category,
    })
    .populate({
      path: "subCategories",
      model: SubCategory,
    });

  const products = await Product.find({
    productvisibility: "visible",
    storeId: params.id,
  });

  return {
    StoreData: JSON.parse(JSON.stringify(StoreData)),
    products: JSON.parse(JSON.stringify(products)),
  };
}

export default async function page({ params }) {
  const { StoreData, products } = await getData({
    params,
  });

  return (
    <>
      <MainpageLayout />

      <div className=" pt-20 lg:pt-32 max-w-6xl mx-auto">
        <StoreHeader
          storeName={StoreData.storeName}
          headerImage={StoreData.image}
          storeDescription={StoreData.description}
        />
        {
          <>
            <StoreNavbar
              subCategory={StoreData.subCategories}
              storeName={StoreData.storeName}
              storeId={StoreData._id}
            />
            <div className=" pb-24 grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:gap-x-8">
              {products?.map((item, id) => (
                <div className="   " key={id}>
                  <ProductCardSwip products={item} />
                </div>
              ))}
            </div>
          </>
        }
      </div>
      <Footer />
    </>
  );
}
