import { NextRequest, NextResponse } from "next/server";
import { signToken, signRefreshToken } from "@/utils/jwt";
import { cookies } from "next/headers";

const VALID_SECRET_KEY = process.env.AUTH_SECRET_KEY || "my-secret-key-here";

export async function POST(request: NextRequest) {
  try {
    const { secretKey } = await request.json();

    if (!secretKey) {
      return NextResponse.json(
        { error: "Secret key is required" },
        { status: 400 }
      );
    }

    if (secretKey !== VALID_SECRET_KEY) {
      return NextResponse.json(
        { error: "Invalid secret key" },
        { status: 401 }
      );
    }

    const accessToken = await signToken({ authenticated: true });
    const refreshToken = await signRefreshToken({ authenticated: true });

    const cookieStore = await cookies();
    cookieStore.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    });

    cookieStore.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: "Authentication successful",
    });
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
