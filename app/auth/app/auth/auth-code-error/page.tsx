import Link from 'next/link';

export default function AuthCodeErrorPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        <h1 className="text-2xl font-bold text-white">
          Authentication Failed
        </h1>

        <p className="mt-3 text-sm text-white/70">
          We couldn't complete your Google sign-in. This can happen if the
          authentication request expired or there's a configuration issue.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/"
            className="rounded-lg bg-cyan-500 px-4 py-3 font-medium text-black transition hover:bg-cyan-400"
          >
            Back to Home
          </Link>

          <Link
            href="/login"
            className="rounded-lg border border-white/10 px-4 py-3 text-white transition hover:bg-white/10"
          >
            Try Again
          </Link>
        </div>

        <p className="mt-6 text-xs text-white/40">
          If the problem continues, please contact support.
        </p>
      </div>
    </main>
  );
}
