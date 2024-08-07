import { NextResponse } from "next/server";
import db from "../../../../utils/db";
import User from "../../../../model/User";
import bcrypt from "bcrypt";
import { sendEmail } from "../../../../utils/sendEmail";
import { createActivationToken } from "../../../../utils/token";

export async function POST(request) {
  try {
    await db.connectDb();
    const {
      phoneNumber,
      password,
      name,
      storeName,
      ShopAddress,
      category,
      city,
    } = await request.json();
    console.log(storeName, ShopAddress, category);
    if (!phoneNumber || !password) {
      return NextResponse.json(
        { message: "Please fill all the fields" },
        {
          status: 400,
        }
      );
    }

    const user = await User.findOne({ phoneNumber });
    if (user) {
      return NextResponse.json(
        { message: "This phone number already exsits.", type: "login" },
        {
          status: 400,
        }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be atleast 6 characters." },
        {
          status: 400,
        }
      );
    }

    const cryptedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      phoneNumber,
      password: cryptedPassword,
      name,
      storeName,
      category,
      city,
      ShopAddress,
      ShopLocation: {
        city: city,
      },
    });

    console.log(newUser);
    const addedUser = await newUser.save();

    const activation_token = createActivationToken({
      id: addedUser._id.toString(),
    });

    const url = `${process.env.BASE_URL}/activate/${activation_token}`;

    // sendEmail(email,url,"","Activate your account");

    await db.disconnectDb();

    return NextResponse.json(
      "Register success! Please activate your phone number to start.",
      {
        status: 201,
      }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
