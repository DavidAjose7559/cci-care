export default function VerifiedBadges({ profile }) {
  if (!profile) return null;

  const badges = [];

  if (profile.membershipVerified) {
    badges.push("Membership Verified ✅");
  }
  if (profile.celeforceVerified) {
    badges.push("Celeforce Verified ✅");
  }

  if (badges.length === 0) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {badges.map((b) => (
        <span
          key={b}
          className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700"
        >
          {b}
        </span>
      ))}
    </div>
  );
}
