"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import VerifiedBadges from "@/components/VerifiedBadges";


export default function Home() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/requests");
    const data = await res.json().catch(() => ({}));
    setRequests(data.requests || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="w-full border-b bg-white">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-3">
          <div className="font-semibold text-lg">CCI Care Network</div>
          <nav className="flex gap-4 text-sm">
            <Link href="/" className="font-medium">Feed</Link>
            <Link href="/my-requests" className="text-slate-600 hover:underline">My Requests</Link>
            <Link href="/profile" className="text-slate-600 hover:underline">Profile</Link>
            <Link href="/admin" className="text-slate-600 hover:underline">Admin</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 grid gap-6 md:grid-cols-[2fr,1fr]">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold">Help Requests</h1>
            <Link
              href="/post-sos"
              className="rounded-md px-4 py-2 text-sm font-medium bg-red-500 text-white hover:bg-red-600"
            >
              🆘 Post an SOS
            </Link>
          </div>

          {loading ? (
            <p className="text-sm text-slate-600">Loading…</p>
          ) : requests.length === 0 ? (
            <p className="text-sm text-slate-600">No open requests right now.</p>
          ) : (
            <div className="space-y-4">
              {requests.map((r) => (
                <article key={r.id} className="rounded-lg border bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold">
                        <Link href={`/requests/${r.id}`} className="hover:underline">
                          {r.title}
                        </Link>
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Type: {r.category} · From:{" "}
                        <span className="font-medium">
                          {r.visibility === "Anonymous"
                            ? "Anonymous"
                            : (r.createdBy?.profile?.fullName || r.createdBy?.email || "Member")}
                        </span>
                      </p>
			<VerifiedBadges profile={r.createdBy?.profile} />
                    </div>
                    {r.urgent && (
                      <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
                        Urgent
                      </span>
                    )}
                  </div>

                  <p className="mt-3 text-sm text-slate-700">{r.description}</p>

                  <div className="mt-4 flex justify-end">
                    <Link
                      href={`/requests/${r.id}`}
                      className="rounded-md px-3 py-1.5 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      View & Offer Help
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <div className="rounded-lg border bg-white p-4 shadow-sm text-sm text-slate-700">
            <h2 className="text-sm font-semibold mb-2">How offers work</h2>
            <p>
              Offers to help are reviewed by admins before the requester sees them.
              The app connects people — it does not handle payments.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
