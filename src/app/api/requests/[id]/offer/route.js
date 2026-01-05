import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export async function POST(req, ctx) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id: requestId } = await ctx.params;

  const body = await req.json().catch(() => ({}));
  const message = typeof body.message === "string" ? body.message.slice(0, 500) : null;

  const request = await prisma.helpRequest.findUnique({
    where: { id: requestId },
    select: { id: true, status: true },
  });

  if (!request) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  if (request.status !== "OPEN") {
    return NextResponse.json({ error: "Request is archived" }, { status: 400 });
  }

  const offer = await prisma.helpOffer.create({
    data: {
      requestId,
      offeredById: token.userId,
      message,
      status: "PENDING",
    },
  });

  return NextResponse.json({ ok: true, offer });
}
