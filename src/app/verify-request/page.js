export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Check your email</h1>
        <p className="mt-2 text-sm text-slate-600">
          We sent you a sign-in link. Click it to log in.
        </p>
      </div>
    </div>
  );
}
