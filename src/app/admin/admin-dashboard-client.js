"use client";

import Link from "next/link";
import { useState } from "react";

export default function AdminDashboardClient({
  pendingUsers,
  pendingOffers,
  openRequests,
  archivedRequests,
}) {
  return (
    <div className="space-y-6">
      <UserApprovalsSection pendingUsers={pendingUsers} />
      <OfferReviewsSection pendingOffers={pendingOffers} />
      <RequestsManagementSection openRequests={openRequests} archivedRequests={archivedRequests} />
    </div>
  );
}

/* ----------------------------- User approvals ----------------------------- */

function UserApprovalsSection({ pendingUsers }) {
  const [loadingId, setLoadingId] = useState(null);

  async function approveUser(userId, membershipVerified, celeforceVerified) {
    try {
      setLoadingId(userId);
      const res = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, membershipVerified, celeforceVerified }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || "Failed to approve user");
        return;
      }

      window.location.reload();
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <section className="rounded-lg border bg-white shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <h2 className="text-sm font-semibold">
          Pending Members ({pendingUsers.length})
        </h2>
        <span className="text-xs text-slate-500">Phase 1</span>
      </div>

      {pendingUsers.length === 0 ? (
        <div className="p-4 text-sm text-slate-600">No pending users right now.</div>
      ) : (
        <div className="divide-y">
          {pendingUsers.map((u) => (
            <UserRow
              key={u.id}
              user={u}
              loading={loadingId === u.id}
              onApprove={approveUser}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function UserRow({ user, loading, onApprove }) {
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
        <div className="mt-2 text-xs text-slate-600">
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
          onClick={() => onApprove(user.id, membershipVerified, celeforceVerified)}
          className="mt-1 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {loading ? "Approving..." : "Approve"}
        </button>
      </div>
    </div>
  );
}

/* ----------------------------- Offer reviews ------------------------------ */

function OfferReviewsSection({ pendingOffers }) {
  const [loadingId, setLoadingId] = useState(null);

  async function reviewOffer(offerId, decision) {
    try {
      setLoadingId(offerId);
      const res = await fetch("/api/admin/offers/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offerId, decision }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || "Failed to review offer");
        return;
      }

      window.location.reload();
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <section className="rounded-lg border bg-white shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <h2 className="text-sm font-semibold">
          Pending Offers ({pendingOffers.length})
        </h2>
        <span className="text-xs text-slate-500">Phase 2</span>
      </div>

      {pendingOffers.length === 0 ? (
        <div className="p-4 text-sm text-slate-600">
          No pending offers right now.
        </div>
      ) : (
        <div className="divide-y">
          {pendingOffers.map((o) => (
            <div key={o.id} className="p-4 flex flex-col gap-3 md:flex-row md:justify-between">
              <div className="min-w-0">
                <div className="text-sm font-semibold">
                  Offer for:{" "}
                  <Link href={`/requests/${o.request.id}`} className="hover:underline">
                    {o.request.title}
                  </Link>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Type: {o.request.category} · Offered by:{" "}
                  <span className="font-medium">
                    {o.offeredBy?.profile?.fullName || o.offeredBy?.email || "Member"}
                  </span>
                </div>
                {o.message && (
                  <div className="mt-2 text-sm text-slate-700">
                    <span className="font-medium">Message:</span> {o.message}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 md:justify-end">
                <button
                  disabled={loadingId === o.id}
                  onClick={() => reviewOffer(o.id, "APPROVED")}
                  className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
                >
                  Approve
                </button>
                <button
                  disabled={loadingId === o.id}
                  onClick={() => reviewOffer(o.id, "REJECTED")}
                  className="rounded-md bg-slate-200 px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-300 disabled:opacity-60"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* -------------------------- Requests management --------------------------- */

function RequestsManagementSection({ openRequests, archivedRequests }) {
  const [loadingId, setLoadingId] = useState(null);

  async function setStatus(requestId, status) {
    try {
      setLoadingId(requestId);
      const res = await fetch("/api/admin/requests/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, status }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || "Failed to update request status");
        return;
      }

      window.location.reload();
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <section className="rounded-lg border bg-white shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <h2 className="text-sm font-semibold">Requests Management</h2>
        <span className="text-xs text-slate-500">Phase 2</span>
      </div>

      <div className="p-4 space-y-6">
        <div>
          <h3 className="text-sm font-semibold">Open Requests ({openRequests.length})</h3>
          {openRequests.length === 0 ? (
            <p className="mt-2 text-sm text-slate-600">No open requests.</p>
          ) : (
            <div className="mt-3 space-y-2">
              {openRequests.map((r) => (
                <div key={r.id} className="rounded-md border bg-slate-50 p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate">
                      <Link href={`/requests/${r.id}`} className="hover:underline">
                        {r.title}
                      </Link>
                    </div>
                    <div className="text-xs text-slate-500">
                      Type: {r.category} · From:{" "}
                      <span className="font-medium">
                        {r.createdBy?.profile?.fullName || r.createdBy?.email || "Member"}
                      </span>
                      {r.urgent ? " · Urgent" : ""}
                    </div>
                  </div>
                  <button
                    disabled={loadingId === r.id}
                    onClick={() => setStatus(r.id, "ARCHIVED")}
                    className="rounded-md bg-slate-200 px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-300 disabled:opacity-60"
                  >
                    {loadingId === r.id ? "Updating..." : "Archive"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-semibold">Archived Requests ({archivedRequests.length})</h3>
          {archivedRequests.length === 0 ? (
            <p className="mt-2 text-sm text-slate-600">No archived requests yet.</p>
          ) : (
            <div className="mt-3 space-y-2">
              {archivedRequests.map((r) => (
                <div key={r.id} className="rounded-md border bg-slate-50 p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate">
                      <Link href={`/requests/${r.id}`} className="hover:underline">
                        {r.title}
                      </Link>
                    </div>
                    <div className="text-xs text-slate-500">
                      Type: {r.category} · From:{" "}
                      <span className="font-medium">
                        {r.createdBy?.profile?.fullName || r.createdBy?.email || "Member"}
                      </span>
                    </div>
                  </div>
                  <button
                    disabled={loadingId === r.id}
                    onClick={() => setStatus(r.id, "OPEN")}
                    className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
                  >
                    {loadingId === r.id ? "Updating..." : "Re-open"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-xs text-slate-500">
          Archiving a request means the church has enough helpers or the situation is paused.
          Re-open if more help is needed.
        </p>
      </div>
    </section>
  );
}
