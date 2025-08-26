import { NextRequest, NextResponse } from "next/server";
import { verifyToken, isTokenExpiringSoon } from "@/utils/jwt";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { authenticated: false, error: "No access token found" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(accessToken);
    if (!payload || !payload.authenticated) {
      return NextResponse.json(
        { authenticated: false, error: "Invalid access token" },
        { status: 401 }
      );
    }

    const needsRefresh = isTokenExpiringSoon(payload);

    return NextResponse.json({
      authenticated: true,
      needsRefresh,
      expiresAt: payload.exp,
    });
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { authenticated: false, error: "Token verification failed" },
      { status: 500 }
    );
  }
}
