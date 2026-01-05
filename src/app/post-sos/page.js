"use client";

import Link from "next/link";
import { useState } from "react";

export default function PostSOSPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);

    // Existing form fields
    const type = formData.get("type"); // Spiritual / Job / Financial / Community / Other
    const title = formData.get("title");
    const description = formData.get("description");
    const urgency = formData.get("urgency"); // Normal / Urgent
    const visibility = formData.get("visibility"); // Name / Anonymous

    // NOTE (Production):
    // We do NOT use "name" from the form to identify the user.
    // Identity comes from the signed-in account + profile, and visibility controls how it’s shown.
    // Keeping the input in the UI for now is fine, but we ignore it when saving.
    // const nameFromForm = formData.get("name");

    // Payload for Phase 2 DB endpoint: POST /api/requests
    const payload = {
      category: type,
      title,
      description,
      urgent: urgency === "Urgent",
      visibility: visibility === "Anonymous" ? "Anonymous" : "Name",
    };

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data.error || "Failed to submit SOS");
        setIsSubmitting(false);
        return;
      }

      alert(
        "Your SOS has been submitted. Admins will oversee connections and offers to help."
      );

      window.location.href = "/";
    } catch (err) {
      console.error("Error submitting SOS:", err);
      alert("Network error. Please try again.");
      setIsSubmitting(false);
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
            <span className="font-medium">Post SOS</span>
          </nav>
        </div>
      </header>

      {/* Form */}
      <main className="mx-auto max-w-3xl px-4 py-6">
        <Link href="/" className="text-sm text-slate-600 hover:underline">
          ← Back to Help Requests
        </Link>

        <h1 className="mt-3 text-2xl font-semibold">Post an SOS</h1>
        <p className="mt-1 text-sm text-slate-600">
          Share what kind of help you need. This will be visible only inside the
          CCI family and overseen by admins/pastors.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4 rounded-lg border bg-white p-4 shadow-sm"
        >
          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Type of need
            </label>
            <select
              name="type"
              required
              className="w-full rounded-md border px-2 py-1.5 text-sm"
            >
              <option value="">Select one</option>
              <option value="Spiritual">Spiritual / Mentorship</option>
              <option value="Job">Job / Career</option>
              <option value="Financial">Financial</option>
              <option value="Community">Community / Bible study</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Short title
            </label>
            <input
              name="title"
              type="text"
              required
              maxLength={100}
              placeholder="e.g. Looking for a Bible study group"
              className="w-full rounded-md border px-2 py-1.5 text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Describe your situation
            </label>
            <textarea
              name="description"
              required
              rows={5}
              placeholder="Share what is going on and the kind of help you are hoping for."
              className="w-full rounded-md border px-2 py-1.5 text-sm"
            />
          </div>

          {/* Optional name (kept for now, ignored in production save) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Your name (optional for this demo)
            </label>
            <input
              name="name"
              type="text"
              placeholder="e.g. Jane Doe"
              className="w-full rounded-md border px-2 py-1.5 text-sm"
            />
            <p className="mt-1 text-xs text-slate-500">
              In production, your identity comes from your signed-in account.
              Visibility below controls whether your name is shown or hidden.
            </p>
          </div>

          {/* Urgency */}
          <div>
            <span className="block text-sm font-medium text-slate-700 mb-1">
              Urgency
            </span>
            <div className="flex gap-4 text-sm">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="urgency"
                  value="Normal"
                  defaultChecked
                />
                <span>Normal</span>
              </label>
              <label className="flex items-center gap-1">
                <input type="radio" name="urgency" value="Urgent" />
                <span>Urgent (time-sensitive)</span>
              </label>
            </div>
          </div>

          {/* Visibility */}
          <div>
            <span className="block text-sm font-medium text-slate-700 mb-1">
              How should your name appear?
            </span>
            <div className="flex flex-col gap-1 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="visibility"
                  value="Name"
                  defaultChecked
                />
                <span>Show my name to helpers</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="visibility" value="Anonymous" />
                <span>
                  Show as “Anonymous” on the feed (admins can still see who I
                  am)
                </span>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end gap-3">
            <Link
              href="/"
              className="rounded-md border px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md px-4 py-2 text-sm font-medium bg-red-500 text-white hover:bg-red-600 disabled:opacity-60"
            >
              {isSubmitting ? "Submitting..." : "Submit SOS"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
