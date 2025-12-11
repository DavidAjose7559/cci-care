"use client";

import Link from "next/link";
import { useState } from "react";

export default function PostSOSPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);

    const type = formData.get("type");
    const title = formData.get("title");
    const description = formData.get("description");
    const urgency = formData.get("urgency");
    const visibility = formData.get("visibility");
    const nameFromForm = formData.get("name");

    // Decide what name to show in the feed
    let displayName = "CCI member";
    if (visibility === "Anonymous") {
      displayName = "Anonymous";
    } else if (nameFromForm && nameFromForm.trim().length > 0) {
      displayName = nameFromForm.trim();
    }

    // Create a new help request object in the same shape as the feed uses
    const newRequest = {
      id: Date.now(), // simple unique id for demo
      title,
      type,
      name: displayName,
      description,
      badges: [], // no credibility badges yet in this demo
      urgent: urgency === "Urgent",
	createdByMe: true, // mark this as created by the current user (this browser)
    };

    // Save to localStorage list
    if (typeof window !== "undefined") {
      try {
        const existing = window.localStorage.getItem("cci-help-requests");
        let list = [];
        if (existing) {
          const parsed = JSON.parse(existing);
          if (Array.isArray(parsed)) {
            list = parsed;
          }
        }
        // put newest at the top
        list.unshift(newRequest);
        window.localStorage.setItem("cci-help-requests", JSON.stringify(list));
      } catch (err) {
        console.error("Error saving SOS to localStorage:", err);
      }
    }

    setTimeout(() => {
      alert(
        "Your SOS has been submitted (demo). In the full app, this will notify helpers and admins."
      );
      setIsSubmitting(false);
      window.location.href = "/";
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
            <span className="font-medium">Post SOS</span>
          </nav>
        </div>
      </header>

      {/* Form */}
      <main className="mx-auto max-w-3xl px-4 py-6">
        <Link
          href="/"
          className="text-sm text-slate-600 hover:underline"
        >
          ← Back to Help Requests
        </Link>

        <h1 className="mt-3 text-2xl font-semibold">
          Post an SOS
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Share what kind of help you need. This will be visible only inside
          the CCI family and, in the future, reviewed by admins/pastors.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-lg border bg-white p-4 shadow-sm">
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

          {/* Optional name */}
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
              If you leave this empty and choose Anonymous below, your request will show as “Anonymous” on the feed.
            </p>
          </div>

          {/* Urgency */}
          <div>
            <span className="block text-sm font-medium text-slate-700 mb-1">
              Urgency
            </span>
            <div className="flex gap-4 text-sm">
              <label className="flex items-center gap-1">
                <input type="radio" name="urgency" value="Normal" defaultChecked />
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
                <input
                  type="radio"
                  name="visibility"
                  value="Anonymous"
                />
                <span>Show as “Anonymous” on the feed (pastors/admins can still see who I am in the full app)</span>
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
