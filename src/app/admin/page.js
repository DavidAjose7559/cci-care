import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PendingUsersTable from "./pending-users-table";

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
        </div>
      </div>
    );
  }

  const pendingUsers = await prisma.user.findMany({
    where: { status: "PENDING" },
    include: { profile: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-4">
        <h1 className="text-2xl font-semibold">Admin Approval</h1>
        <p className="text-sm text-slate-600">
          Approve members into the network. You can also verify (or remove) credibility badges.
        </p>

        <PendingUsersTable pendingUsers={pendingUsers} />
      </div>
    </div>
  );
}
