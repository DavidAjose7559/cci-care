import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: token.userId },
    include: { profile: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      email: user.email,
      role: user.role,
      status: user.status,
    },
    profile: user.profile || null,
  });
}

export async function POST(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const {
    fullName,
    attendance,
    howLongInCCI,
    firstTimeAtCCI, // expects "YYYY-MM-DD" or ""
    membershipClaimed,
    celeforceClaimed,
  } = body;

  // Basic validation (keep simple)
  const safeFullName = typeof fullName === "string" ? fullName.trim().slice(0, 100) : null;
  const safeAttendance = typeof attendance === "string" ? attendance.trim().slice(0, 50) : null;
  const safeHowLong = typeof howLongInCCI === "string" ? howLongInCCI.trim().slice(0, 50) : null;

  let safeFirstTime = null;
  if (typeof firstTimeAtCCI === "string" && firstTimeAtCCI.length > 0) {
    const d = new Date(firstTimeAtCCI);
    if (!isNaN(d.getTime())) safeFirstTime = d;
  }

  const updated = await prisma.profile.upsert({
    where: { userId: token.userId },
    create: {
      userId: token.userId,
      fullName: safeFullName,
      attendance: safeAttendance,
      howLongInCCI: safeHowLong,
      firstTimeAtCCI: safeFirstTime,
      membershipClaimed: !!membershipClaimed,
      celeforceClaimed: !!celeforceClaimed,
    },
    update: {
      fullName: safeFullName,
      attendance: safeAttendance,
      howLongInCCI: safeHowLong,
      firstTimeAtCCI: safeFirstTime,
      membershipClaimed: !!membershipClaimed,
      celeforceClaimed: !!celeforceClaimed,
    },
  });

  return NextResponse.json({ ok: true, profile: updated });
}
