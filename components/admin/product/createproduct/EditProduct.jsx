"use client";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { Grid, Paper, Typography } from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Input,
  Chip,
} from "@mui/material";
import CreateSubProduct from "./createSubProduct/CreateSubProduct";
import SingularSelect from "../../../selects/SingularSelect";
import MultipleSelect from "../../../selects/MultipleSelect";
import MaxminPrice from "./addToClick/MaxminPrice";
import Details from "./addToClick/Details";
import Questions from "./addToClick/Questions";
import AdminInput from "../../../selects/AdminPut";
import { Uploadimages } from "../../../../request/uploadimg";
import axios from "axios";
import FullScreenLoading from "../../../fullScreenOverlay/FullScreenLoading";
import { useRouter } from "next/navigation";
export default function EditProduct({ editedProduct, categories, id }) {
  const subCategoriesIds = editedProduct.subCategories.map(
    (subCategory) => subCategory._id
  );
  const [product, setProduct] = useState({
    name: editedProduct.name,
    description: editedProduct.description,
    brand: editedProduct.brand,
    sku: editedProduct.sku,
    slug: editedProduct.slug,
    productvisibility: editedProduct.productvisibility,
    discount: editedProduct.discount,
    section: editedProduct.section,
    productType: "",
    description_images: [],
    parent: "",
    category: editedProduct.category._id,
    subCategories: subCategoriesIds,
    details: editedProduct.details,
    bulkPricing: editedProduct.bulkPricing,
    questions: editedProduct.questions,
    shipping: editedProduct.shipping,
  });

  const [loading, setLoading] = useState(false);
  const [subs, setSubs] = useState([]);
  const [images, setImages] = useState([]);
  const [samePriceForAll, setSamePriceForAll] = useState(true);
  const [editorHtml, setEditorHtml] = useState(editedProduct.description);
  const [subProducts, setSubProducts] = useState(editedProduct.subProducts);

  const section = [
    {
      name: "big-deal",
    },
    {
      name: "featured",
    },
    {
      name: "new-arrival",
    },
    {
      name: "sale",
    },
    {
      name: "clearance",
    },
    {
      name: "bestseller",
    },
    {
      name: "limited-edition",
    },
    {
      name: "top-rated",
    },
    {
      name: "regular",
    },
  ];
  const visibility = [
    {
      name: "visible",
    },
    {
      name: "hidden",
    },
  ];
  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
  };
  const router = useRouter();
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "image",
  ];
  useEffect(() => {
    async function getSubs() {
      if (product.category) {
        try {
          setLoading(true);
          const { data } = await axios.get(
            `/api/admin/subcategory/${product.category}`
          );
          setSubs(data);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        } finally {
          setLoading(false); // Stop loading
        }
      }
    }
    getSubs();
  }, [product.category]);
  const handleChange = (e) => {
    const { value, name } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async () => {
    const updatedSubProducts = [];

    for (const subProduct of subProducts) {
      const formData = new FormData();

      for (const image of subProduct.images) {
        formData.append("file", image.blob);
        formData.append("upload_preset", "ml_default");
        formData.append("cloud_name", "dtasegoef");
        const cloudinaryResponse = await Uploadimages(formData);

        cloudinaryImages.push(cloudinaryResponse);
      }

      const cloudinaryImages = cloudinaryResponse.map((response) => ({
        url: response.secure_url,
        secure_url: response.secure_url,
        public_id: response.public_id,
      }));

      if (subProduct.color.image) {
        const colorFormData = new FormData();
        colorFormData.append(
          "file",
          new File([subProduct.color.image], "color_image.jpg", {
            type: "image/jpeg",
          })
        );

        const colorImageUpload = await Uploadimages(colorFormData);

        subProduct.color.image = colorImageUpload[0].secure_url;
      }

      updatedSubProducts.push({
        ...subProduct,
        images: cloudinaryImages,
      });
    }

    try {
      setLoading(true);
      const { data } = await axios.put(`/api/admin/product/update/${id}`, {
        ...product,
        subProducts,
      });
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      router.push(`/product/${id}/0/0`);
      setLoading(false);
    }
  };

  const validate = Yup.object({
    // Your validation schema here
  });
  return (
    <Box>
      {loading && <FullScreenLoading />}
      <Formik
        enableReinitialize
        initialValues={product}
        validationSchema={validate}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form className=" ">
            <div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
              <div className="space-y-6 lg:col-start-1 lg:col-span-2 ">
                <h1 className="font-semibold tracking-tight text-2xl">
                  Edit Product
                </h1>
                <Paper className="p-4">
                  <Grid container spacing={2}>
                    <Grid item xs={12} lg={12}>
                      <AdminInput
                        type="text"
                        label="Name"
                        name="name"
                        placeholder="Product name"
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      {" "}
                      <AdminInput
                        type="text"
                        label="Brand"
                        name="brand"
                        placholder="Product brand"
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      <SingularSelect
                        name="section"
                        value={product.section}
                        placeholder="Feature Product type if any"
                        data={section}
                        header="Feature Product type if any"
                        handleChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      <SingularSelect
                        name="productvisibility"
                        value={product.productvisibility}
                        placeholder="Visibility"
                        data={visibility}
                        header="Visibility"
                        handleChange={handleChange}
                      />
                    </Grid>
                    {/* <Grid item xs={12} lg={6}>
                      <AdminInput
                        type="text"
                        label="Sku"
                        name="sku"
                        placholder="Product sku/ number"
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      <AdminInput
                        type="text"
                        label="slug"
                        name="slug"
                        placholder="Product slug"
                        onChange={handleChange}
                      />
                    </Grid> */}

                    <Grid item xs={12} lg={6}>
                      <AdminInput
                        type="text"
                        label="Shipping Free"
                        name="shipping"
                        placholder="Shipping Free"
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      <AdminInput
                        type="text"
                        label="Discount"
                        name="discount"
                        placholder="Product discount"
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} lg={12}>
                      <ReactQuill
                        theme="snow"
                        modules={modules}
                        style={{ height: "200px", paddingBottom: "30px" }}
                        formats={formats}
                        value={editorHtml}
                        onChange={(value) => {
                          setEditorHtml(value);
                          setProduct({ ...product, description: value });
                        }}
                        placeholder="Type something..."
                        bounds=".app"
                        scrollingContainer=".app"
                      />
                    </Grid>
                    <Grid item xs={12} lg={12}>
                      <InputLabel>Same Price for All Products</InputLabel>
                      <Select
                        value={samePriceForAll}
                        onChange={(e) => setSamePriceForAll(e.target.value)}
                      >
                        <MenuItem value={true}>Yes</MenuItem>
                        <MenuItem value={false}>No</MenuItem>
                      </Select>
                    </Grid>
                    {samePriceForAll && (
                      <Grid item xs={12} lg={12}>
                        <MaxminPrice
                          bulkPricing={product.bulkPricing}
                          product={product}
                          setProduct={setProduct}
                        />
                      </Grid>
                    )}
                    <Grid item xs={12} lg={12}>
                      {" "}
                      <CreateSubProduct
                        bulkPricing={product.bulkPricing}
                        product={product}
                        samePriceForAll={samePriceForAll}
                        setSubProducts={setSubProducts}
                        subProducts={subProducts}
                        setImages={setImages}
                        images={images}
                        editedProduct={editedProduct}
                      />
                    </Grid>
                    <Grid item xs={12} lg={12}>
                      {" "}
                      <Details
                        details={product.details}
                        product={product}
                        setProduct={setProduct}
                      />
                    </Grid>

                    <Grid item xs={12} lg={12}>
                      {" "}
                      <Questions
                        questions={product.questions}
                        product={product}
                        setProduct={setProduct}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </div>
              <section
                aria-labelledby="timeline-title"
                className="lg:col-start-3 lg:col-span-1"
              >
                <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
                  <Grid item xs={12} lg={6}>
                    <SingularSelect
                      name="category"
                      value={product.category}
                      placeholder="Category"
                      data={categories}
                      header="Select a Category"
                      handleChange={handleChange}
                      disabled={product.parent}
                    />
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <MultipleSelect
                      value={product.subCategories}
                      data={subs}
                      header="Select SubCategories"
                      name="subCategories" // Pass the name prop
                      disabled={product.parent}
                      handleChange={(event) =>
                        handleChange(event, "subCategories")
                      }
                    />
                  </Grid>
                  <div className="mt-6 flex flex-col justify-stretch">
                    <button
                      onClick={handleSubmit}
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Product Submit
                    </button>
                  </div>
                </div>
              </section>
            </div>
            {/* <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button> */}
          </Form>
        )}
      </Formik>
    </Box>
  );
}
