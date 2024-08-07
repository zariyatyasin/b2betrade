import React, { useRef } from "react";
import { Button, Input } from "@mui/material";

const CreateProductImageSub = ({
  name,
  header,
  text,
  images,
  setImages,
  setColorImage,
}) => {
  const fileInput = useRef(null);

  const handleAddImage = () => {
    fileInput.current.click(); // Trigger the file input
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  const handleImages = (e) => {
    let files = Array.from(e.target.files);
    files.forEach((img, i) => {
      const reader = new FileReader();
      reader.readAsDataURL(img);
      reader.onload = (e) => {
        setImages((images) => [...images, e.target.result]);
      };
    });
  };

  return (
    <div>
      <h4>{header}</h4>
      <Button variant="contained" color="primary" onClick={handleAddImage}>
        {text}
      </Button>
      <input
        type="file"
        name={name}
        ref={fileInput}
        hidden
        multiple
        accept="image/jpeg,image/png,image/webp"
        onChange={handleImages}
      />
      {images.map((image, index) => (
        <div key={index}>
          <img
            src={image}
            alt={`Image ${index}`}
            style={{ maxWidth: "100px", maxHeight: "100px" }}
          />
          <Button
            variant="contained"
            color="error"
            onClick={() => handleRemoveImage(index)}
          >
            Remove Image
          </Button>
        </div>
      ))}
    </div>
  );
};

export default CreateProductImageSub;
