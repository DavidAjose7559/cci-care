import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const requests = await prisma.helpRequest.findMany({
    where: { status: "OPEN" },
    orderBy: { createdAt: "desc" },
    include: {
  createdBy: {
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

  return NextResponse.json({ requests });
}

export async function POST(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const category = String(body.category || "").slice(0, 30);
  const title = String(body.title || "").slice(0, 100);
  const description = String(body.description || "").slice(0, 2000);
  const urgent = !!body.urgent;
  const visibility = body.visibility === "Anonymous" ? "Anonymous" : "Name";

  if (!category || !title || !description) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const created = await prisma.helpRequest.create({
    data: {
      createdById: token.userId,
      category,
      title,
      description,
      urgent,
      visibility,
    },
  });

  return NextResponse.json({ ok: true, request: created });
}
