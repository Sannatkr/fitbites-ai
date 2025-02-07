// app/api/auth/route.js
import { NextResponse } from "next/server";
import { dbConnect, User } from "@/app/lib/mongodb";
import { SignJWT } from "jose";

const JWT_SECRET = process.env.NEXT_APP_JWT_SECRET;

export async function POST(request) {
  if (!JWT_SECRET) {
    console.error("JWT_SECRET is not defined");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  try {
    const { phoneNumber } = await request.json();

    // Validate phone number
    if (!phoneNumber || !/^\d{10}$/.test(phoneNumber)) {
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if user exists
    const existingUser = await User.findOne({ phoneNumber });

    if (existingUser) {
      // Generate token with jose
      const token = await new SignJWT({
        phoneNumber,
        userId: existingUser._id.toString(),
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(new TextEncoder().encode(JWT_SECRET));

      return NextResponse.json({
        exists: true,
        token,
        userId: existingUser._id,
        name: existingUser.name,
      });
    }

    // For new users, return exists: false
    return NextResponse.json({
      exists: false,
      message: "User not found, proceed to registration",
    });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
