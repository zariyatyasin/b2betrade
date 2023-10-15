import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export default function Brand({ brands, brandHandle }) {
  const [show, setShow] = useState(true);

  const toggleShow = () => {
    setShow(!show);
  };

  return (
    <div className="filter p-4">
      <h3 className="text-xl font-semibold">
        Brand
        <span className="ml-2" onClick={toggleShow}>
          {show ? <RemoveIcon /> : <AddIcon />}
        </span>
      </h3>
      {show && (
        <div>
          {brands.map((brand, i) => (
            <button
              className="grid grid-cols-2 gap-4"
              key={i}
              onClick={() => brandHandle(brand)}
            >
              {brand}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
