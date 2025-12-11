"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [formValues, setFormValues] = useState({
    fullName: "",
    membershipTraining: "",
    celeforceTraining: "",
    attendance: "",
    howLong: "",
    firstTime: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  // Load demo data from localStorage (so it feels a bit persistent)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("cci-profile");
    if (stored) {
      try {
        setFormValues(JSON.parse(stored));
      } catch {}
    }
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setIsSaving(true);

    // In the real app this will go to the server.
    // For demo, we'll store it in localStorage.
    if (typeof window !== "undefined") {
      window.localStorage.setItem("cci-profile", JSON.stringify(formValues));
    }

    setTimeout(() => {
      setIsSaving(false);
      setSavedMessage("Profile saved (demo). In the real app, this will be sent to church admins for review.");
      setTimeout(() => setSavedMessage(""), 4000);
    }, 400);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Bar */}
      <header className="w-full border-b bg-white">
        <div className="mx-auto max-w-3xl flex items-center justify-between px-4 py-3">
          <div className="font-semibold text-lg">
            CCI Care Network
          </div>
          <nav className="flex gap-4 text-sm">
            <Link href="/" className="text-slate-600 hover:underline">
              Feed
            </Link>
            <span className="font-medium">Profile</span>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-4 py-6">
        <Link
          href="/"
          className="text-sm text-slate-600 hover:underline"
        >
          ← Back to Help Requests
        </Link>

        <h1 className="mt-3 text-2xl font-semibold">
          My Profile & Credibility
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          This information helps the church understand who is in the network,
          confirm your details, and build safe, trustworthy connections.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4 rounded-lg border bg-white p-4 shadow-sm"
        >
          {/* Full name */}
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
              placeholder="e.g. Jane Doe"
              className="w-full rounded-md border px-2 py-1.5 text-sm"
            />
          </div>

          {/* Membership training */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Have you completed Membership Training?
            </label>
            <select
              name="membershipTraining"
              required
              value={formValues.membershipTraining}
              onChange={handleChange}
              className="w-full rounded-md border px-2 py-1.5 text-sm"
            >
              <option value="">Select one</option>
              <option value="Yes">Yes</option>
              <option value="In progress">In progress</option>
              <option value="No">Not yet</option>
            </select>
          </div>

          {/* Celeforce training */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Have you done Celeforce training / served as a worker?
            </label>
            <select
              name="celeforceTraining"
              required
              value={formValues.celeforceTraining}
              onChange={handleChange}
              className="w-full rounded-md border px-2 py-1.5 text-sm"
            >
              <option value="">Select one</option>
              <option value="Yes">Yes</option>
              <option value="In progress">In progress</option>
              <option value="No">No</option>
            </select>
          </div>

          {/* Attendance */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              How often do you usually attend church?
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
              <option value="Occasional">
                Here and there (can go a month without showing up)
              </option>
            </select>
          </div>

          {/* How long in CCI */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              How long have you been in CCI?
            </label>
            <input
              type="text"
              name="howLong"
              required
              value={formValues.howLong}
              onChange={handleChange}
              placeholder="e.g. 6 months, 2 years"
              className="w-full rounded-md border px-2 py-1.5 text-sm"
            />
          </div>

          {/* First time at CCI Toronto */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              When was your first time at CCI Toronto?
            </label>
            <input
              type="date"
              name="firstTime"
              value={formValues.firstTime}
              onChange={handleChange}
              className="w-full rounded-md border px-2 py-1.5 text-sm"
            />
          </div>

          {/* Info text */}
          <p className="text-xs text-slate-500">
            In the full version, this information will be visible to church admins
            and used (with your consent) to add verification badges to your profile.
          </p>

          {/* Submit */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-md px-4 py-2 text-sm font-medium bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save profile"}
            </button>
          </div>

          {savedMessage && (
            <p className="mt-2 text-xs text-emerald-700">
              {savedMessage}
            </p>
          )}
        </form>
      </main>
    </div>
  );
}
