import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const { offerId, decision } = body || {};
  if (!offerId || !["APPROVED", "REJECTED"].includes(decision)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const updated = await prisma.helpOffer.update({
    where: { id: offerId },
    data: {
      status: decision,
      reviewedById: token.userId,
      reviewedAt: new Date(),
    },
  });

  return NextResponse.json({ ok: true, offer: updated });
}
