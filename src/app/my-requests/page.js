"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function MyRequestsPage() {
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/my-requests");
    const data = await res.json().catch(() => ({}));
    if (res.ok) setMyRequests(data.requests || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Bar */}
      <header className="w-full border-b bg-white">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-3">
          <div className="font-semibold text-lg">CCI Care Network</div>
          <nav className="flex gap-4 text-sm">
            <Link href="/" className="text-slate-600 hover:underline">
              Feed
            </Link>
            <span className="font-medium">My Requests</span>
            <Link href="/profile" className="text-slate-600 hover:underline">
              Profile
            </Link>
            <Link href="/admin" className="text-slate-600 hover:underline">
              Admin
            </Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Link href="/" className="text-sm text-slate-600 hover:underline">
          ← Back to Help Feed
        </Link>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">My SOS Requests</h1>
            <p className="mt-1 text-sm text-slate-600">
              Track the SOS requests you’ve posted. Only approved offers will be visible to you.
            </p>
          </div>

          <Link
            href="/post-sos"
            className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
          >
            🆘 Post an SOS
          </Link>
        </div>

        <div className="mt-6 space-y-4">
          {loading ? (
            <p className="text-sm text-slate-600">Loading…</p>
          ) : myRequests.length === 0 ? (
            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-700">
                You haven’t posted any SOS requests yet.
              </p>
              <Link href="/post-sos" className="text-sm text-emerald-700 hover:underline">
                Post your first SOS →
              </Link>
            </div>
          ) : (
            myRequests.map((r) => (
              <article key={r.id} className="rounded-lg border bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">
                      <Link href={`/requests/${r.id}`} className="hover:underline">
                        {r.title}
                      </Link>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Type: {r.category} · Status:{" "}
                      <span className="font-semibold">
                        {r.status === "ARCHIVED" ? "Archived" : "Open"}
                      </span>
                    </p>
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
                    className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
                  >
                    View offers
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
