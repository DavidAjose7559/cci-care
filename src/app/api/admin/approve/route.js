import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const { userId, membershipVerified, celeforceVerified } = body || {};

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  // Update user status + verified flags
  await prisma.user.update({
    where: { id: userId },
    data: {
      status: "APPROVED",
      profile: {
        upsert: {
          create: {
            membershipVerified: !!membershipVerified,
            celeforceVerified: !!celeforceVerified,
          },
          update: {
            membershipVerified: !!membershipVerified,
            celeforceVerified: !!celeforceVerified,
          },
        },
      },
    },
  });

  return NextResponse.json({ ok: true });
}
