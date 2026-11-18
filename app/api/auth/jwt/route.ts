import { cookies, headers } from "next/headers"
import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"

// GET /api/auth/jwt -> reads the JWT directly from Better Auth's session cookie
export async function GET() {
  // 1. Verify the session is valid (and refresh session cookie if needed)
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  if (session.user.isBlocked) {
    return NextResponse.json({ message: "Account is blocked" }, { status: 403 })
  }

  // 2. Read the HS256 JWT stored by Better Auth's cookieCache (strategy: "jwt")
  const cookieStore = await cookies()
  const token =
    cookieStore.get("better-auth.session_data")?.value ||
    cookieStore.get("__Secure-better-auth.session_data")?.value

  if (!token) {
    return NextResponse.json(
      { message: "Session JWT cookie not found. Please sign in again." },
      { status: 401 }
    )
  }

  return NextResponse.json({ token })
}
