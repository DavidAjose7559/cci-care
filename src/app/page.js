"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const baseRequests = [
  {
    id: 1,
    title: "Looking for a Bible study group",
    type: "Spiritual",
    name: "Sarah K.",
    description:
      "I really want to grow in the Word and I'm looking for a small group that meets during the week.",
    badges: ["Member Training ✅", "Attendance: Weekly"],
    urgent: false,
  },
  {
    id: 2,
    title: "Need job referral (software developer)",
    type: "Job",
    name: "John D.",
    description:
      "I've been applying for roles in software development and would appreciate referrals or CV help.",
    badges: ["Member Training ✅", "Celeforce ✅", "Verified by Pastor"],
    urgent: false,
  },
  {
    id: 3,
    title: "Short-term financial help",
    type: "Financial",
    name: "Anonymous",
    description:
      "Going through a rough patch this month and need help covering basic groceries.",
    badges: ["Attendance: Bi-weekly"],
    urgent: true,
  },
];

export default function Home() {
  const [helpRequests, setHelpRequests] = useState(baseRequests);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = window.localStorage.getItem("cci-help-requests");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Newest from localStorage first, then base demo requests
          setHelpRequests([...parsed, ...baseRequests]);
        }
      }
    } catch (err) {
      console.error("Error loading help requests from localStorage:", err);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Nav Bar */}
      <header className="w-full border-b bg-white">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-3">
          <div className="font-semibold text-lg">
            CCI Care Network
          </div>
          <nav className="flex gap-4 text-sm">
            <Link href="/" className="font-medium">
              Feed
            </Link>
            <a href="#" className="text-slate-600">
              My Requests
            </a>
            <Link href="/profile" className="text-slate-600 hover:underline">
              Profile
            </Link>
            <a href="#" className="text-slate-600">
              Admin
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-6 grid gap-6 md:grid-cols-[2fr,1fr]">
        {/* Left: Feed */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold">
              Help Requests
            </h1>
            <Link
              href="/post-sos"
              className="rounded-md px-4 py-2 text-sm font-medium bg-red-500 text-white hover:bg-red-600"
            >
              🆘 Post an SOS
            </Link>
          </div>

          <div className="space-y-4">
            {helpRequests.length === 0 && (
              <p className="text-sm text-slate-600">
                No help requests yet. Be the first to post an SOS.
              </p>
            )}

            {helpRequests.map((req) => (
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
                      From: <span className="font-medium">{req.name}</span> · {req.type}
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

                <div className="mt-3 flex flex-wrap gap-2">
                  {req.badges && req.badges.map((badge, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700"
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex justify-end">
                  <button className="rounded-md px-3 py-1.5 text-sm font-medium bg-emerald-500 text-white hover:bg-emerald-600">
                    Offer to Help
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Right: Sidebar */}
        <aside className="space-y-4">
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold mb-2">
              Filters
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Type
                </label>
                <select className="w-full rounded-md border px-2 py-1 text-sm">
                  <option>All</option>
                  <option>Spiritual</option>
                  <option>Job</option>
                  <option>Financial</option>
                  <option>Community</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Urgency
                </label>
                <select className="w-full rounded-md border px-2 py-1 text-sm">
                  <option>All</option>
                  <option>Urgent only</option>
                  <option>Non-urgent</option>
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-4 shadow-sm text-sm text-slate-700">
            <h2 className="text-sm font-semibold mb-2">
              What is this?
            </h2>
            <p>
              This internal tool helps connect needs (jobs, finances, spiritual help)
              with trusted helpers within CCI, with pastoral oversight and accountability.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
