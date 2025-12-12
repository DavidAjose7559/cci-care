"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const storedProfile = window.localStorage.getItem("cci-profile");
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      }

      const storedRequests = window.localStorage.getItem("cci-help-requests");
      if (storedRequests) {
        const parsed = JSON.parse(storedRequests);
        if (Array.isArray(parsed)) {
          setRequests(parsed);
        }
      }
    } catch (err) {
      console.error("Error loading admin data:", err);
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
            CCI Care Network – Admin (Demo)
          </div>
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

      {/* Content */}
      <main className="mx-auto max-w-5xl px-4 py-6 space-y-6">
        <Link
          href="/"
          className="text-sm text-slate-600 hover:underline"
        >
          ← Back to Help Feed
        </Link>

        <h1 className="mt-2 text-2xl font-semibold">
          Admin Oversight (Prototype)
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          This demo page shows how church admins/pastors could review profiles and
          see SOS requests in one place. In the full version, this area would be
          protected so only authorized leaders can access it.
        </p>

        {/* Profile section */}
        <section className="rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">
            Member Profile (Demo)
          </h2>
          {!loaded && (
            <p className="text-sm text-slate-500">
              Loading profile…
            </p>
          )}
          {loaded && !profile && (
            <p className="text-sm text-slate-600">
              No profile information has been submitted yet.
              Ask the member to fill out their details on the{" "}
              <Link href="/profile" className="text-emerald-600 hover:underline">
                Profile page
              </Link>
              .
            </p>
          )}
          {profile && (
            <div className="space-y-1 text-sm text-slate-700">
              <p>
                <span className="font-semibold">Name:</span> {profile.fullName || "—"}
              </p>
              <p>
                <span className="font-semibold">Membership Training:</span>{" "}
                {profile.membershipTraining || "—"}
              </p>
              <p>
                <span className="font-semibold">Celeforce Training / Worker:</span>{" "}
                {profile.celeforceTraining || "—"}
              </p>
              <p>
                <span className="font-semibold">Attendance frequency:</span>{" "}
                {profile.attendance || "—"}
              </p>
              <p>
                <span className="font-semibold">How long in CCI:</span>{" "}
                {profile.howLong || "—"}
              </p>
              <p>
                <span className="font-semibold">First time at CCI Toronto:</span>{" "}
                {profile.firstTime || "—"}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                In the full version, admins could mark this profile as{" "}
                <span className="font-semibold">“verified”</span> and add internal
                notes or connect this member to mentors/mentees.
              </p>
            </div>
          )}
        </section>

        {/* SOS requests section */}
        <section className="rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">
            Recent SOS Requests (Demo)
          </h2>
          {!loaded && (
            <p className="text-sm text-slate-500">
              Loading requests…
            </p>
          )}
          {loaded && requests.length === 0 && (
            <p className="text-sm text-slate-600">
              No SOS requests have been submitted yet from this device.
            </p>
          )}
          {requests.length > 0 && (
            <div className="space-y-3">
              {requests.map((req) => (
                <article
                  key={req.id}
                  className="rounded-md border bg-slate-50 p-3 text-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">
                        {req.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Type: {req.type} · From: {req.name}
                        {req.createdByMe && " · (created from this demo account)"}
                      </p>
                    </div>
                    {req.urgent && (
                      <span className="rounded-full bg-red-100 px-2 py-1 text-[10px] font-semibold text-red-700">
                        Urgent
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-slate-700">
                    {req.description}
                  </p>
                  <p className="mt-2 text-[11px] text-slate-500">
                    In the full version, admins could:
                    approve visibility, assign helpers, or connect this to an
                    existing mentoring relationship.
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Future section */}
        <section className="rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold mb-2">
            Future Admin Features
          </h2>
          <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
            <li>Approve or reject new profiles before they enter the network.</li>
            <li>Mark members as verified based on Membership/Celeforce checks.</li>
            <li>Track who is mentoring who for accountability.</li>
            <li>See financial/job requests and ensure safe, wise handling.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
