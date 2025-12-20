"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [formValues, setFormValues] = useState({
    fullName: "",
    membershipClaimed: false,
    celeforceClaimed: false,
    attendance: "",
    howLongInCCI: "",
    firstTimeAtCCI: "", // "YYYY-MM-DD"
  });

  const [verified, setVerified] = useState({
    membershipVerified: false,
    celeforceVerified: false,
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) {
          setMessage("Failed to load profile.");
          return;
        }
        const data = await res.json();
        const p = data.profile;

        if (p) {
          setFormValues({
            fullName: p.fullName || "",
            membershipClaimed: !!p.membershipClaimed,
            celeforceClaimed: !!p.celeforceClaimed,
            attendance: p.attendance || "",
            howLongInCCI: p.howLongInCCI || "",
            firstTimeAtCCI: p.firstTimeAtCCI ? formatDate(p.firstTimeAtCCI) : "",
          });

          setVerified({
            membershipVerified: !!p.membershipVerified,
            celeforceVerified: !!p.celeforceVerified,
          });
        }
      } catch (e) {
        setMessage("Error loading profile.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMessage(data.error || "Failed to save.");
        return;
      }

      setMessage("Profile saved. Admin will verify your training badges if needed.");
    } catch (e) {
      setMessage("Error saving profile.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 4000);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Bar */}
      <header className="w-full border-b bg-white">
        <div className="mx-auto max-w-3xl flex items-center justify-between px-4 py-3">
          <div className="font-semibold text-lg">CCI Care Network</div>
          <nav className="flex gap-4 text-sm">
            <Link href="/" className="text-slate-600 hover:underline">
              Feed
            </Link>
            <Link href="/my-requests" className="text-slate-600 hover:underline">
              My Requests
            </Link>
            <span className="font-medium">Profile</span>
            <Link href="/admin" className="text-slate-600 hover:underline">
              Admin
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        <Link href="/" className="text-sm text-slate-600 hover:underline">
          ← Back to Help Requests
        </Link>

        <h1 className="mt-3 text-2xl font-semibold">My Profile & Credibility</h1>
        <p className="mt-1 text-sm text-slate-600">
          This information helps the church verify training status and keep the network safe.
        </p>

        {/* Verified badges */}
        <div className="mt-4 flex flex-wrap gap-2">
          {verified.membershipVerified && (
            <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
              Membership Verified ✅
            </span>
          )}
          {verified.celeforceVerified && (
            <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
              Celeforce Verified ✅
            </span>
          )}
          {!verified.membershipVerified && !verified.celeforceVerified && (
            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">
              Verification pending (admin)
            </span>
          )}
        </div>

        {loading ? (
          <div className="mt-6 rounded-lg border bg-white p-4 shadow-sm text-sm text-slate-600">
            Loading profile…
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-4 rounded-lg border bg-white p-4 shadow-sm"
          >
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Full name
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formValues.fullName}
                onChange={handleChange}
                className="w-full rounded-md border px-2 py-1.5 text-sm"
                placeholder="e.g. Jane Doe"
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">
                Training (what you’re claiming)
              </p>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="membershipClaimed"
                  checked={formValues.membershipClaimed}
                  onChange={handleChange}
                />
                <span>Completed Membership Training</span>
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="celeforceClaimed"
                  checked={formValues.celeforceClaimed}
                  onChange={handleChange}
                />
                <span>Completed Celeforce / Worker training</span>
              </label>

              <p className="text-xs text-slate-500">
                Admin will verify these before badges show publicly.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                How often do you usually attend?
              </label>
              <select
                name="attendance"
                required
                value={formValues.attendance}
                onChange={handleChange}
                className="w-full rounded-md border px-2 py-1.5 text-sm"
              >
                <option value="">Select one</option>
                <option value="Weekly">Weekly</option>
                <option value="Bi-weekly">Bi-weekly</option>
                <option value="Monthly">About once a month</option>
                <option value="Occasional">Here and there</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                How long have you been in CCI?
              </label>
              <input
                type="text"
                name="howLongInCCI"
                required
                value={formValues.howLongInCCI}
                onChange={handleChange}
                className="w-full rounded-md border px-2 py-1.5 text-sm"
                placeholder="e.g. 6 months, 2 years"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                When was your first time at CCI Toronto?
              </label>
              <input
                type="date"
                name="firstTimeAtCCI"
                value={formValues.firstTimeAtCCI}
                onChange={handleChange}
                className="w-full rounded-md border px-2 py-1.5 text-sm"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="rounded-md px-4 py-2 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save profile"}
              </button>
            </div>

            {message && <p className="text-xs text-emerald-700">{message}</p>}
          </form>
        )}
      </main>
    </div>
  );
}

function formatDate(isoOrDate) {
  const d = new Date(isoOrDate);
  if (isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
