import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export async function GET(req, ctx) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id: requestId } = await ctx.params;

  const request = await prisma.helpRequest.findUnique({
    where: { id: requestId },
    select: { id: true, createdById: true },
  });

  if (!request) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  const isAdmin = token.role === "ADMIN";
  const isOwner = request.createdById === token.userId;

  if (!isAdmin && !isOwner) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const offers = await prisma.helpOffer.findMany({
    where: {
      requestId,
      ...(isAdmin ? {} : { status: "APPROVED" }),
    },
    orderBy: { createdAt: "desc" },
    include: {
  offeredBy: {
    select: {
      email: true,
      profile: {
        select: {
          fullName: true,
          membershipVerified: true,
          celeforceVerified: true,
        },
      },
    },
  },
},
  });

  return NextResponse.json({
    offers,
    visibility: isAdmin ? "ALL" : "APPROVED_ONLY",
  });
}
