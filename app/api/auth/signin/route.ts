import { NextRequest, NextResponse } from "next/server";
import { signToken, signRefreshToken } from "@/utils/jwt";
import { cookies } from "next/headers";
import { ipFromRequest } from "@/lib/rate-limit/staticBudget";
import { OVERRIDES } from "@/lib/rate-limit/config";

const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY || "";
const DEMO_SECRET_KEY = process.env.DEMO_SECRET_KEY || "";
const BYPASS_SECRET_KEY = process.env.BYPASS_SECRET_KEY || "";

export async function POST(request: NextRequest) {
  try {
    const { secretKey } = await request.json();

    if (!secretKey) {
      return NextResponse.json(
        { error: "Secret key is required" },
        { status: 400 }
      );
    }

    const isDemoKey = secretKey === DEMO_SECRET_KEY
    const isBypassKey = secretKey === BYPASS_SECRET_KEY

    if (!isDemoKey && !isBypassKey) {
      return NextResponse.json(
        { error: "Invalid secret key" },
        { status: 401 }
      );
    }

    if (isBypassKey) {
      const ip = ipFromRequest(request)
      OVERRIDES.set(ip, 100)
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

    cookieStore.set('rl_mode', isBypassKey ? 'bypass' : 'demo', {
      httpOnly: false,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
      secure: process.env.NODE_ENV === 'production',
    })

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
