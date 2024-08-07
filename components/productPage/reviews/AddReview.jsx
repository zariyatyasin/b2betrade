import { Rating } from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Images from "./Images";
import Select from "./Select";
import FormData from "form-data";
import UploadImagesClould from "../../../utils/UploadImagesClould";

import axios from "axios";
import FullScreenLoading from "../../fullScreenOverlay/FullScreenLoading";
export default function AddReview({ product, setReviews }) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const [size, setSize] = useState("");
  const [style, setStyle] = useState("");
  const [delivery, setdelivery] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0); // Initialize the rating state with a number
  const [images, setImages] = useState([]);
  let uploaded_images = [];

  const deliverys = ["Fast", "Slow", "Late"];
  const handleSubmit = async () => {
    setLoading(true);

    try {
      const uploadedImages = await UploadImagesClould(images);

      const { data } = await axios.put(`/api/product/${product._id}`, {
        size,

        delivery,
        rating,
        review,
        images: uploadedImages,
      });
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="  border p-4 rounded-md shadow-md mt-4">
      {loading && <FullScreenLoading />}
      <div className="mx-auto">
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="w-full mt-4 md:mt-0">
            <div className="bg-white flex rounded-lg  ">
              <Select
                property={size}
                text="Size"
                data={product.allSizes.filter((x) => x.size !== size)}
                handleChange={setSize}
              />

              {/* <Select
                property={style}
                text="Style"
                data={product.colors.filter((x) => x !== style)}
                handleChange={setStyle}
              /> */}

              <Select
                property={delivery}
                text="delivery"
                data={deliverys.filter((x) => x !== delivery)}
                handleChange={setdelivery}
              />
            </div>
            <Images images={images} setImages={setImages} imageAllow={3} />
            <textarea
              name="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write your review here"
              className="w-full p-2 border border-gray-300 rounded  "
            />
            <div className="text-[#2B39D1] text-3xl">
              <Rating
                name="half-rating-read"
                value={rating} // Set the value prop to control the rating
                onChange={(e, newValue) => setRating(newValue)} // Use newValue from the callback
                precision={0.5}
              />
            </div>
            <button
              className={`bg-[#2B39D1] text-white py-2 px-4 mt-4 rounded-lg ${
                loading ? "bg-gray-400 cursor-not-allowed" : ""
              }`}
              onClick={() => handleSubmit()}
              disabled={loading}
            >
              Submit Review {loading && <div>Loading</div>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
