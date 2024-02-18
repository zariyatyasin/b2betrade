"use client";
import React, { useEffect, useRef, useState } from "react";
import { HeaderWithOutCat } from "../../components/Header/HeaderWithOutCat";

import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { signIn, useSession, getProviders } from "next-auth/react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import FullScreenLoading from "../../components/fullScreenOverlay/FullScreenLoading";
import Link from "next/link";

import Model from "./Model";
const page = () => {
  const session = useSession();
  const params = useSearchParams();
  const [isRegistering, setIsRegistering] = useState(null);
  const [showNumber, setShowNumber] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [enteredOtp, setEnteredOtp] = useState(["", "", "", "", "", ""]);
  const otpInputsRefs = useRef([]);
  const [otp, setOtp] = useState("");
  const [otpSuccess, setotpSuccess] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(60);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(true);
  const [providers, setProviders] = useState(null);

  useEffect(() => {
    let intervalId;

    if (resendDisabled && isRegistering === false && otpSuccess === false) {
      intervalId = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown === 0) {
            setResendDisabled(false);
            clearInterval(intervalId);
          } else if (prevCountdown === 1) {
            setResendDisabled(false);
          }
          return Math.max(prevCountdown - 1, 0);
        });
      }, 10);
    }

    return () => clearInterval(intervalId);
  }, [resendDisabled, isRegistering, otpSuccess]);

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
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && enteredOtp[index] === "" && index > 0) {
      e.preventDefault();
      otpInputsRefs.current[index - 1].focus();
    }
  };
  const handleVerifyOtp = (enteredOtpjon) => {
    setLoading(true);
    if (otp === parseInt(enteredOtpjon)) {
      setTimeout(() => {
        setotpSuccess(true);
        setLoading(false);
        setShowOtpModal(false);
        setShowNumber(false);
      }, 2000);
    } else {
      setotpSuccess(false);
      setLoading(false);
      setError("Incorrect OTP. Please try again.");
    }
  };
  const openOtpModal = () => {
    setShowOtpModal(true);
  };

  // Function to close OTP modal
  const closeOtpModal = () => {
    setShowOtpModal(false);
  };
  const handleResendClick = () => {
    if (isRegistering === false && otpSuccess === false) {
      setResendDisabled(true);
      setCountdown(60);

      handleOtpSend();
      setError(null);
      setEnteredOtp(["", "", "", "", "", ""]);
    }
  };
  const handleOtpInputChange = (index, value) => {
    const newOtp = [...enteredOtp];
    newOtp[index] = value;

    if (index < enteredOtp.length - 1 && value !== "") {
      otpInputsRefs.current[index + 1].focus();
    }

    setEnteredOtp(newOtp);

    if (index === enteredOtp.length - 1 && value !== "") {
      const enteredOtpjon = newOtp.join("");
      handleVerifyOtp(enteredOtpjon);
    }
  };

  const renderOtpInputs = () => {
    return enteredOtp.map((digit, index) => (
      <input
        key={index}
        className="m-2 border h-10 w-10 text-center form-control rounded"
        type="text"
        maxLength="1"
        value={digit || ""}
        onChange={(e) => handleOtpInputChange(index, e.target.value)}
        ref={(input) => (otpInputsRefs.current[index] = input)}
        onKeyDown={(e) => handleOtpKeyDown(index, e)}
      />
    ));
  };

  const handleOtpSend = async () => {
    // Generate OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000);
    setOtp(generatedOtp);
    const apiKey = "vUg6OOv4uFlo7WIfkgwC";
    const senderId = "8809617615565";
    console.log(otp);
    // try {

    //   await axios.post("http://bulksmsbd.net/api/smsapimany", {
    //     api_key: apiKey,
    //     senderid: senderId,
    //     messages: [
    //       {
    //         to: phoneNumber,
    //         message: `Welcome to B2BeTrade, Your OTP is: ${generatedOtp}`,
    //       },
    //     ],
    //   });
    // } catch (error) {
    //   console.error("Error sending OTP:", error);

    // }
  };
  const loginHandle = async (e) => {
    e.preventDefault();
    console.log(password);
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

  console.log(otp);

  const handleResign = (event) => {
    event.preventDefault();

    location.reload();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post("/api/auth/register/exsituser", {
        phoneNumber,
      });

      if (response.data.type === "login") {
        setIsRegistering(true);
        setShowNumber(false);
        setSuccess(response.data.message);
      } else if (response.data.type === "register") {
        handleOtpSend();
        setShowOtpModal(true);
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

  const registerHandle = async (e) => {
    e.preventDefault();

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

  return (
    <div>
      <HeaderWithOutCat />
      {loading && <FullScreenLoading />}

      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-xl mb-8 font-bold text-gray-900">
            {isRegistering
              ? "Sign In"
              : isRegistering === false
              ? "Register"
              : "Sign In/Register"}
          </h2>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {showNumber === true && (
            <form
              onSubmit={handleSubmit}
              className="space-y-6 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10  "
            >
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-900"
                >
                  Phone Number
                </label>
                <div className="mt-1">
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="phoneNumber"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-200 shadow-sm placeholder-gray-900 focus:outline-none focus:ring-gray-900 focus:border-gray-200 sm:text-sm"
                  />
                </div>
                {phoneNumber.length !== 11 && phoneNumber !== "" && (
                  <p className="text-red-500 text-sm mt-1">
                    Phone number must be exactly 11 digits
                  </p>
                )}
                {!/^01/.test(phoneNumber) && phoneNumber.length === 11 && (
                  <p className="text-red-500 text-sm mt-1">
                    Phone number must start with "01"
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium text-white bg-[#2B39D1] hover:bg-[#2B39D1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                disabled={loading}
              >
                {loading ? "Loading..." : "CONTINUE"}
              </button>
            </form>
          )}

          {isRegistering && (
            <form
              onSubmit={loginHandle}
              className="space-y-6 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10  "
            >
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-900"
                >
                  Phone Number
                </label>
                <div className="mt-1">
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="phoneNumber"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-200 shadow-sm placeholder-gray-900 focus:outline-none focus:ring-gray-900 focus:border-gray-200 sm:text-sm"
                  />
                </div>
                {phoneNumber.length !== 11 && phoneNumber !== "" && (
                  <p className="text-red-500 text-sm mt-1">
                    Phone number must be exactly 11 digits
                  </p>
                )}
                {!/^01/.test(phoneNumber) && phoneNumber.length === 11 && (
                  <p className="text-red-500 text-sm mt-1">
                    Phone number must start with "01"
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-900"
                >
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`appearance-none block w-full px-3 py-2 border  shadow-sm placeholder-gray-900 focus:outline-none focus:ring-gray-900 focus:border-gray-200 sm:text-sm`}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <RemoveRedEyeOutlinedIcon />
                      ) : (
                        <VisibilityOffOutlinedIcon />
                      )}
                    </button>
                  </div>
                </div>
                <div className=" text-xs text-red-500 mt-1">
                  {error && error}
                </div>
                <Link
                  href={"/forgetpassword"}
                  className=" text-xs text-gray-500 mt-3"
                >
                  Forget Password?
                </Link>

                <label
                  htmlFor="remember-me"
                  className=" text-xs block  mt-2 text-gray-500"
                >
                  Don&apos;t have account?
                  <span
                    className="ml-1  font-medium hover:cursor-pointer"
                    onClick={handleResign}
                  >
                    Create one
                  </span>
                </label>
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium text-white bg-[#2B39D1] hover:bg-[#2B39D1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                disabled={loading}
              >
                {loading ? "Loading..." : "CONTINUE"}
              </button>
            </form>
          )}

          {isRegistering === false && otpSuccess === false && (
            <Model isOpen={showOtpModal} onClose={closeOtpModal}>
              <div className="w-full">
                <div className="bg-white h-64 py-3 rounded text-center">
                  <h1 className="text-2xl font-bold">OTP Verification</h1>
                  <div className="flex flex-col mt-4">
                    <span>Enter the OTP you received at</span>
                    <span className="font-bold">+88{phoneNumber}</span>
                    <div onClick={closeOtpModal} className=" text-blue-600">
                      Edit
                    </div>
                  </div>

                  <div
                    id="otp"
                    className="flex flex-row justify-center text-center px-2 mt-5"
                  >
                    {renderOtpInputs()}
                  </div>

                  {/* <div className="flex justify-center text-center mt-5">
                    <div
                      className="flex items-center text-blue-700 hover:text-blue-900 cursor-pointer"
                      onClick={handleVerifyOtp}
                    >
                      <span className="font-bold">Verify OTP</span>
                      <i className="bx bx-caret-right ml-1"></i>
                    </div>
                  </div> */}
                  <div>{error && error}</div>

                  <div>
                    {resendDisabled && (
                      <div className="text-center">{countdown}s</div>
                    )}
                  </div>
                  <div>
                    {!resendDisabled && (
                      <button
                        className=" text-center font-bold"
                        onClick={handleResendClick}
                        disabled={resendDisabled}
                      >
                        Resend
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Model>
          )}
          {otpSuccess === true && (
            <form
              onSubmit={registerHandle}
              className="space-y-6 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10  "
            >
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-900"
                >
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-200 shadow-sm placeholder-gray-900 focus:outline-none focus:ring-gray-900 focus:border-gray-200 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-900"
                >
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`appearance-none block w-full px-3 py-2 border  shadow-sm placeholder-gray-900 focus:outline-none focus:ring-gray-900 focus:border-gray-200 sm:text-sm`}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <RemoveRedEyeOutlinedIcon />
                      ) : (
                        <VisibilityOffOutlinedIcon />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-900"
                >
                  Confirm Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`appearance-none block w-full px-3 py-2 border shadow-sm placeholder-gray-900 focus:outline-none focus:ring-gray-900 focus:border-gray-200 sm:text-sm`}
                  />
                </div>
              </div>
              {password.length < 6 && password !== "" && (
                <p className="text-red-500 text-sm mt-1">
                  Password must be at least 6 characters
                </p>
              )}
              {password !== confirmPassword && confirmPassword !== "" && (
                <p className="text-red-500 text-sm mt-1">
                  Passwords do not match
                </p>
              )}
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium text-white bg-[#2B39D1] hover:bg-[#2B39D1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                disabled={loading || password !== confirmPassword}
              >
                {loading ? "Loading..." : "CONTINUE"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
