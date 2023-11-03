// components/RequestProductForm.js
"use client";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Dialog from "@mui/material/Dialog";

import DialogContent from "@mui/material/DialogContent";
import { Grid } from "@mui/material";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
const SubmitForm = ({ session, productName, ProductId, userId }) => {
  const initialValues = {
    quantity: "",
    description: "",
    price: "",
    deliveryDate: "",
  };
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const router = useRouter();
  const validationSchema = Yup.object({
    quantity: Yup.number()
      .required("Quantity is required")
      .min(1, "Quantity must be at least 1"),
  });
  //seller will request handle
  const handleSubmit = async (values, { setSubmitting }) => {
    console.log(ProductId, session.id, values);

    try {
      values.requestId = ProductId;
      values.sellerId = session.id;
      const response = await axios.post(
        "http://localhost:3000/api/sellerRequest",
        values
      );

      if (response.status === 200) {
        console.log("Request successful:", response.data);
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error making API request:", error);
    }

    setSubmitting(false);
    setIsTagModalOpen(false);
  };
  const handleOpenTagModal = () => {
    if (!session) {
      return signIn();
    }

    setIsTagModalOpen(true);
  };
  const handleDelete = async () => {
    console.log(ProductId);
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/productrequest/${ProductId}/${userId}`
      );

      console.log("this is response ", response);

      if (response.status === 201) {
        router.push("/browse/buyerrequest");
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error making API request:", error);
    }
  };

  const handleCloseTagModal = () => {
    setIsTagModalOpen(false);
  };

  return (
    <div>
      <div className="  ">
        {session ? (
          session?.role === "user" ? (
            <button
              type="button"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600"
            >
              Become a Seller
            </button>
          ) : session?.role === "seller" ? (
            <button
              onClick={handleOpenTagModal}
              type="button"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600"
            >
              Submit your Offer
            </button>
          ) : (
            session?.id === userId && (
              <button
                onClick={handleDelete}
                type="button"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-500"
              >
                Delete Your Request
              </button>
            )
          )
        ) : (
          <button
            // Redirect to sign in page
            type="button"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600"
          >
            Login
          </button>
        )}
      </div>

      <Dialog open={isTagModalOpen} onClose={handleCloseTagModal}>
        <h1 className="p-4 text-lg font-bold">{productName}</h1>
        <DialogContent>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form className="  max-w-6xl mx-auto ">
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <div>
                    <label
                      htmlFor="quantity"
                      className="block text-gray-700 font-bold mb-2"
                    >
                      Quantity
                    </label>
                    <Field
                      type="number"
                      id="quantity"
                      name="quantity"
                      className="w-full border border-gray-300 rounded p-2"
                    />
                    <ErrorMessage
                      name="quantity"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                </Grid>
                <Grid item xs={4}>
                  <div>
                    <label
                      htmlFor="price"
                      className="block text-gray-700 font-bold mb-2"
                    >
                      Price
                    </label>
                    <Field
                      type="number"
                      id="price"
                      name="price"
                      className="w-full border border-gray-300 rounded p-2"
                    />
                    <ErrorMessage
                      name="price"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                </Grid>

                <Grid item xs={4}>
                  <div>
                    <label
                      htmlFor="deliveryDate"
                      className="block text-gray-700 font-bold mb-2"
                    >
                      Delivery Date
                    </label>
                    <Field
                      type="date"
                      id="deliveryDate"
                      name="deliveryDate"
                      className="w-full border border-gray-300 rounded p-2"
                    />
                    <ErrorMessage
                      name="deliveryDate"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-gray-700 font-bold mb-2"
                    >
                      Description
                    </label>
                    <Field
                      as="textarea"
                      id="description"
                      name="description"
                      className="w-full border border-gray-300 rounded p-2"
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                </Grid>

                <Grid item xs={6}>
                  <div>
                    <label
                      htmlFor="attachmentUrls"
                      className="block text-gray-700 font-bold mb-2"
                    >
                      File Uploads
                    </label>
                    <Field
                      type="text"
                      id="attachmentUrls"
                      name="attachmentUrls"
                      className="w-full border border-gray-300 rounded p-2"
                    />
                    <ErrorMessage
                      name="attachmentUrls"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                </Grid>
              </Grid>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Submit
                </button>
              </div>
            </Form>
          </Formik>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubmitForm;
