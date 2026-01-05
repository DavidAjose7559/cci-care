import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const requests = await prisma.helpRequest.findMany({
    where: { createdById: token.userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ requests });
}
