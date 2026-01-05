"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import VerifiedBadges from "@/components/VerifiedBadges";


export default function RequestDetailPage() {
  const params = useParams();
  const id = params?.id;

  const [request, setRequest] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offerMsg, setOfferMsg] = useState("");
  const [sending, setSending] = useState(false);

  async function load(requestId) {
    setLoading(true);

    // Fetch request by ID
    const reqRes = await fetch(`/api/requests/${requestId}`);
    const reqData = await reqRes.json().catch(() => ({}));
    if (reqRes.ok) setRequest(reqData.request || null);
    else setRequest(null);

    // Fetch offers (API enforces visibility rules)
    const offerRes = await fetch(`/api/requests/${requestId}/offers`);
    const offerData = await offerRes.json().catch(() => ({}));
    if (offerRes.ok) setOffers(offerData.offers || []);
    else setOffers([]);

    setLoading(false);
  }

  useEffect(() => {
    if (!id) return; // wait for params to be ready
    load(id);
  }, [id]);

  async function submitOffer() {
    if (!id) return;

    setSending(true);
    const res = await fetch(`/api/requests/${id}/offer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: offerMsg }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Failed to send offer");
      setSending(false);
      return;
    }

    alert("Offer sent! Admin will review it before the requester can see it.");
    setOfferMsg("");
    setSending(false);
    load(id);
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="mx-auto max-w-3xl space-y-4">
        <Link href="/" className="text-sm text-slate-600 hover:underline">
          ← Back to Feed
        </Link>

        {loading ? (
          <div className="rounded-lg border bg-white p-4 shadow-sm text-sm text-slate-600">
            Loading…
          </div>
        ) : !request ? (
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <h1 className="text-lg font-semibold">Request not found</h1>
            <p className="text-sm text-slate-600 mt-1">
              It may be archived or you may not have access.
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-xl font-semibold">{request.title}</h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Type: {request.category} · Status:{" "}
                    <span className="font-semibold">
                      {request.status === "ARCHIVED" ? "Archived" : "Open"}
                    </span>
                  </p>
		{/* Verified badges for the requester (hide if request is Anonymous) */}
  {request.visibility !== "Anonymous" && (
    <VerifiedBadges profile={request.createdBy?.profile} />
  )}
                </div>
                {request.urgent && (
                  <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
                    Urgent
                  </span>
                )}
              </div>

              <p className="mt-3 text-sm text-slate-700">{request.description}</p>
            </div>

            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold">Offer to help</h2>
              <p className="text-xs text-slate-500 mt-1">
                Your offer will be reviewed by an admin before the requester can see it.
              </p>

              {request.status === "ARCHIVED" && (
                <p className="mt-2 text-xs text-amber-700">
                  This request has been archived by an admin, so new offers are disabled.
                </p>
              )}

              <textarea
                className="mt-3 w-full rounded-md border px-3 py-2 text-sm"
                rows={3}
                placeholder="Optional message (e.g., I can help with referrals / prayer / mentorship...)"
                value={offerMsg}
                onChange={(e) => setOfferMsg(e.target.value)}
                disabled={request.status === "ARCHIVED"}
              />

              <div className="mt-3 flex justify-end">
                <button
                  onClick={submitOffer}
                  disabled={sending || request.status === "ARCHIVED"}
                  className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
                >
                  {request.status === "ARCHIVED"
                    ? "Request archived"
                    : sending
                    ? "Sending…"
                    : "Send offer"}
                </button>
              </div>
            </div>

            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold">Offers (approved)</h2>
              <p className="text-xs text-slate-500 mt-1">
                Requesters only see approved offers. Admins see all offers.
              </p>

              {offers.length === 0 ? (
                <p className="mt-3 text-sm text-slate-600">No offers visible yet.</p>
              ) : (
                <div className="mt-3 space-y-2">
                  {offers.map((o) => (
                    <div key={o.id} className="rounded-md border bg-slate-50 p-3 text-sm">
                      <div className="text-xs text-slate-500">
                        From:{" "}
                        <span className="font-medium">
                          {o.offeredBy?.profile?.fullName || o.offeredBy?.email || "Member"}
                        </span>{" "}
                        · Status: <span className="font-semibold">{o.status}</span>
                      </div>
			<VerifiedBadges profile={o.offeredBy?.profile} />

                      {o.message && <div className="mt-2 text-slate-700">{o.message}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
