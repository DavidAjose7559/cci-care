import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminDashboardClient from "./admin-dashboard-client";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-lg border bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold">Not authorized</h1>
          <p className="mt-2 text-sm text-slate-600">
            You must be an admin to access this page.
          </p>
          <div className="mt-4">
            <Link href="/" className="text-sm text-emerald-700 hover:underline">
              Go to feed
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const pendingUsers = await prisma.user.findMany({
    where: { status: "PENDING" },
    include: { profile: true },
    orderBy: { createdAt: "desc" },
  });

  const openRequests = await prisma.helpRequest.findMany({
    where: { status: "OPEN" },
    orderBy: { createdAt: "desc" },
    include: { createdBy: { select: { email: true, profile: { select: { fullName: true } } } } },
  });

  const archivedRequests = await prisma.helpRequest.findMany({
    where: { status: "ARCHIVED" },
    orderBy: { updatedAt: "desc" },
    include: { createdBy: { select: { email: true, profile: { select: { fullName: true } } } } },
    take: 25,
  });

  const pendingOffers = await prisma.helpOffer.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
    include: {
      request: { select: { id: true, title: true, category: true, createdById: true } },
      offeredBy: { select: { email: true, profile: { select: { fullName: true } } } },
    },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="w-full border-b bg-white">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-3">
          <div className="font-semibold text-lg">CCI Care Network — Admin</div>
          <nav className="flex gap-4 text-sm">
            <Link href="/" className="text-slate-600 hover:underline">
              Feed
            </Link>
            <Link href="/my-requests" className="text-slate-600 hover:underline">
              My Requests
            </Link>
            <Link href="/profile" className="text-slate-600 hover:underline">
              Profile
            </Link>
            <span className="font-medium">Admin</span>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 space-y-6">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="text-sm text-slate-600">
          Approve members into the network, verify badges, review offers to help, and archive/reopen SOS requests.
          No payments are handled in this app — it only connects people with oversight.
        </p>

        <AdminDashboardClient
          pendingUsers={pendingUsers}
          pendingOffers={pendingOffers}
          openRequests={openRequests}
          archivedRequests={archivedRequests}
        />
      </main>
    </div>
  );
}
