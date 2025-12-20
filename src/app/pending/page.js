import Link from "next/link";

export default function PendingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Approval pending</h1>
        <p className="mt-2 text-sm text-slate-600">
          Your account is pending approval by church leadership.
          Once approved, please sign out and sign in again to refresh access.
        </p>

        <div className="mt-4 flex flex-col gap-2">
          <Link href="/signin" className="text-sm text-emerald-700 hover:underline">
            Go to sign in
          </Link>
          <a
            href="/api/auth/signout"
            className="text-sm text-slate-700 hover:underline"
          >
            Sign out
          </a>
        </div>
      </div>
    </div>
  );
}
