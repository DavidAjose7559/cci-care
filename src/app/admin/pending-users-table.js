"use client";

import { useState } from "react";

export default function PendingUsersTable({ pendingUsers }) {
  const [loadingId, setLoadingId] = useState(null);

  async function approveUser(userId, membershipVerified, celeforceVerified) {
    try {
      setLoadingId(userId);
      const res = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, membershipVerified, celeforceVerified }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to approve user");
        return;
      }

      window.location.reload();
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b">
        <h2 className="text-sm font-semibold">
          Pending members ({pendingUsers.length})
        </h2>
      </div>

      {pendingUsers.length === 0 ? (
        <div className="p-4 text-sm text-slate-600">
          No pending users right now.
        </div>
      ) : (
        <div className="divide-y">
          {pendingUsers.map((u) => (
            <Row
              key={u.id}
              user={u}
              loading={loadingId === u.id}
              onApprove={approveUser}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Row({ user, loading, onApprove }) {
  const [membershipVerified, setMembershipVerified] = useState(
    user.profile?.membershipClaimed || false
  );
  const [celeforceVerified, setCeleforceVerified] = useState(
    user.profile?.celeforceClaimed || false
  );

  return (
    <div className="p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <div className="text-sm font-semibold truncate">{user.email}</div>
        <div className="text-xs text-slate-500">
          Status: {user.status} · Role: {user.role}
        </div>

        <div className="mt-2 text-xs text-slate-600 space-y-1">
          <div>
            Claimed: Membership{" "}
            <span className="font-semibold">
              {user.profile?.membershipClaimed ? "Yes" : "No"}
            </span>{" "}
            · Celeforce{" "}
            <span className="font-semibold">
              {user.profile?.celeforceClaimed ? "Yes" : "No"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 md:items-end">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={membershipVerified}
            onChange={(e) => setMembershipVerified(e.target.checked)}
          />
          <span>Membership Verified</span>
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={celeforceVerified}
            onChange={(e) => setCeleforceVerified(e.target.checked)}
          />
          <span>Celeforce Verified</span>
        </label>

        <button
          disabled={loading}
          onClick={() =>
            onApprove(user.id, membershipVerified, celeforceVerified)
          }
          className="mt-1 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {loading ? "Approving..." : "Approve"}
        </button>
      </div>
    </div>
  );
}
