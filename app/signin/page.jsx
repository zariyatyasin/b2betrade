"use client";

import React, { useEffect, useState } from "react";
import { HeaderWithOutCat } from "../../components/Header/HeaderWithOutCat";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import FullScreenLoading from "../../components/fullScreenOverlay/FullScreenLoading";
import Link from "next/link";
const validationSchema = Yup.object({
  phoneNumber: Yup.string()
    .required("Phone Number is required")
    .matches(
      /^(01)\d{9}$/,
      "Invalid phoneNumber number. It should start with '0' and have a total of 11 digits."
    ),
});

const page = () => {
  const session = useSession();
  const params = useSearchParams();
  const [isRegistering, setIsRegistering] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [providers, setProviders] = useState(null);
  const [success, setSuccess] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState();
  const [password, setpassword] = useState();

  const router = useRouter();

  const handleSignInClick = (event) => {
    event.preventDefault();

    location.reload();
  };

  useEffect(() => {
    if (session?.status === "authenticated") {
      const callbackUrl = params.get("callbackUrl");
      if (callbackUrl) {
        redirect(callbackUrl);
      } else {
        redirect("/");
      }
    }
  }, [session]);
  useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res);
    })();
  }, []);
  const loginHandle = async (values, callbackUrl) => {
    const { phoneNumber, password } = values;
    let options = {
      redirect: false,
      phoneNumber: phoneNumber,
      password: password,
    };
    try {
      setLoading(true);
      const result = await signIn("credentials", options);

      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess("User signed in successfully!");

        return result;
      }
    } catch (error) {
      setError(error.message || "An error occurred during sign-in.");
    } finally {
      setLoading(false);
    }
  };

  const registerHandle = async (values) => {
    const { phoneNumber, password, fullName } = values;

    try {
      setLoading(true);
      const res = await fetch("api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber,
          password,
          name: fullName,
        }),
      });

      if (!res.ok) {
        setLoading(false);
        const data = await res.json();
        setError(data.message);
      }
      let options = {
        redirect: false,
        phoneNumber: phoneNumber,
        password: password,
      };
      await signIn("credentials", options);

      const data = await res.json();

      return data;
    } catch (error) {
      setError(error.message || "An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    const { phoneNumber, password } = values;

    try {
      setLoading(true);
      const response = await axios.post("/api/auth/register/exsituser", {
        phoneNumber,
      });

      if (response.data.type === "login") {
        setIsRegistering(true);
        setSuccess(response.data.message);
      } else if (response.data.type === "register") {
        setIsRegistering(false);
        setSuccess(response.data.message);
      }
    } catch (error) {
      console.log(error);

      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <HeaderWithOutCat />
      {loading && <FullScreenLoading />}
      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8 ">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-xl mb-8 font-bold text-gray-900">
            Sign In/Register
          </h2>
        </div>

        <div className="  sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <Formik
              initialValues={{
                phoneNumber: "",
                fullName: "", // Add new field for full name
                password: "", // Add new field for password
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                if (isRegistering === null) {
                  handleSubmit(values);
                } else {
                  isRegistering ? loginHandle(values) : registerHandle(values);
                }
              }}
              enableReinitialize
              validateOnChange
            >
              {({ errors, touched, setFieldValue }) => (
                <Form className="space-y-6">
                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Phone Number
                    </label>
                    <div className="mt-1">
                      <Field
                        id="phoneNumber"
                        name="phoneNumber"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        autoComplete="phoneNumber"
                        required
                        className={`appearance-none block w-full px-3 py-2 border ${
                          errors.phoneNumber && touched.phoneNumber
                            ? "border-red-500"
                            : "border-gray-200"
                        } shadow-sm placeholder-gray-900 focus:outline-none focus:ring-gray-900 focus:border-gray-200 sm:text-sm`}
                      />
                    </div>
                    <ErrorMessage
                      name="phoneNumber"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  {isRegistering !== null && (
                    <>
                      {isRegistering ? (
                        <div>
                          <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-900"
                          >
                            Password
                          </label>
                          <div className="mt-1">
                            <Field
                              id="password"
                              name="password"
                              type="password"
                              autoComplete="new-password"
                              required
                              className={`appearance-none block w-full px-3 py-2 border ${
                                errors.password && touched.password
                                  ? "border-red-500"
                                  : "border-gray-200"
                              } shadow-sm placeholder-gray-900 focus:outline-none focus:ring-gray-900 focus:border-gray-200 sm:text-sm`}
                            />
                          </div>
                          <ErrorMessage
                            name="password"
                            component="div"
                            className="text-red-500 text-sm"
                          />
                          <Link
                            href={"/contact"}
                            className=" text-xs text-gray-500 mt-2"
                          >
                            Forget Password?
                          </Link>

                          <label
                            htmlFor="remember-me"
                            className=" text-xs block  mt-2 text-gray-500"
                          >
                            Don't have account?
                            <span
                              className="ml-1  font-medium hover:cursor-pointer"
                              onClick={handleSignInClick}
                            >
                              Create one
                            </span>
                          </label>
                        </div>
                      ) : (
                        <>
                          <div>
                            <label
                              htmlFor="fullName"
                              className="block text-sm font-medium text-gray-900"
                            >
                              Full Name
                            </label>
                            <div className="mt-1">
                              <Field
                                id="fullName"
                                name="fullName"
                                type="text"
                                autoComplete="name"
                                required
                                className={`appearance-none block w-full px-3 py-2 border ${
                                  errors.fullName && touched.fullName
                                    ? "border-red-500"
                                    : "border-gray-200"
                                } shadow-sm placeholder-gray-900 focus:outline-none focus:ring-gray-900 focus:border-gray-200 sm:text-sm`}
                              />
                            </div>
                            <ErrorMessage
                              name="fullName"
                              component="div"
                              className="text-red-500 text-sm"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="password"
                              className="block text-sm font-medium text-gray-900"
                            >
                              Password
                            </label>
                            <div className="mt-1">
                              <Field
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className={`appearance-none block w-full px-3 py-2 border ${
                                  errors.password && touched.password
                                    ? "border-red-500"
                                    : "border-gray-200"
                                } shadow-sm placeholder-gray-900 focus:outline-none focus:ring-gray-900 focus:border-gray-200 sm:text-sm`}
                              />
                            </div>
                            <ErrorMessage
                              name="password"
                              component="div"
                              className="text-red-500 text-sm"
                            />
                            <label
                              htmlFor="remember-me"
                              className=" block text-sm mt-2 text-gray-900"
                            >
                              Alredy have account?
                              <span
                                className="ml-1  font-medium hover:cursor-pointer"
                                onClick={handleSignInClick}
                              >
                                Sign in now
                              </span>
                            </label>
                          </div>
                        </>
                      )}
                    </>
                  )}

                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium text-white bg-[#2B39D1] hover:bg-[#2B39D1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "CONTINUE"}
                  </button>

                  {error && <div className="text-red-500 text-sm">{error}</div>}
                  {success && (
                    <div className="text-green-500 text-sm">{success}</div>
                  )}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
