"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function MyRequestsPage() {
  const [myRequests, setMyRequests] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = window.localStorage.getItem("cci-help-requests");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const mine = parsed.filter((req) => req.createdByMe);
          setMyRequests(mine);
        }
      }
    } catch (err) {
      console.error("Error loading my requests:", err);
    } finally {
      setLoaded(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Bar */}
      <header className="w-full border-b bg-white">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-3">
          <div className="font-semibold text-lg">
            CCI Care Network
          </div>
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
        <Link
          href="/"
          className="text-sm text-slate-600 hover:underline"
        >
          ← Back to Help Feed
        </Link>

        <h1 className="mt-3 text-2xl font-semibold">
          My SOS Requests
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          These are the SOS requests you have posted from this device. In the full
          version, this will be tied to your church account so you can track status,
          responses, and follow-up.
        </p>

        <div className="mt-6 space-y-4">
          {!loaded && (
            <p className="text-sm text-slate-500">
              Loading your requests…
            </p>
          )}

          {loaded && myRequests.length === 0 && (
            <p className="text-sm text-slate-600">
              You haven't posted any SOS requests yet from this device.
              <br />
              <Link
                href="/post-sos"
                className="text-emerald-600 hover:underline"
              >
                Post your first SOS
              </Link>
              .
            </p>
          )}

          {myRequests.map((req) => (
            <article
              key={req.id}
              className="rounded-lg border bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">
                    {req.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Type: {req.type}
                  </p>
                </div>
                {req.urgent && (
                  <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
                    Urgent
                  </span>
                )}
              </div>

              <p className="mt-3 text-sm text-slate-700">
                {req.description}
              </p>

              <div className="mt-4 flex justify-between items-center text-xs text-slate-500">
                <span>
                  Status: <span className="font-medium text-amber-700">Open (demo)</span>
                </span>
                <span>
                  In the future: offers to help &gt;
                </span>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
