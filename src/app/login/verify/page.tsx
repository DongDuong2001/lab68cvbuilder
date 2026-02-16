"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function VerifyContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-8">
      <div className="max-w-2xl w-full">
        {/* Grid pattern background */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.02] -z-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Technical label */}
        <span className="label-mono block mb-6">
          AUTH.MODULE // VERIFICATION_PENDING
        </span>

        {/* Icon / Visual indicator */}
        <div className="mb-8 p-8 border border-black inline-block">
          <svg
            className="w-16 h-16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="square"
              strokeLinejoin="miter"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-6xl font-black tracking-tighter leading-[0.85] mb-6">
          CHECK
          <br />
          YOUR
          <br />
          EMAIL
        </h1>

        {/* Divider */}
        <div className="w-24 border-t border-black mb-8" />

        {/* Message */}
        <div className="mb-12 space-y-4">
          <p className="text-base font-light leading-relaxed">
            A magic link has been sent to:
          </p>
          {email && (
            <p className="text-xl font-bold border-l-2 border-black pl-4">
              {email}
            </p>
          )}
          <p className="text-base font-light leading-relaxed text-gray-600">
            Click the link in the email to complete authentication.
            <br />
            The link expires in <strong>24 hours</strong>.
          </p>
        </div>

        {/* Instructions */}
        <div className="border border-black p-6 mb-8">
          <span className="label-mono block mb-3">PROTOCOL</span>
          <ol className="space-y-2 text-sm font-light">
            <li className="flex">
              <span className="font-bold mr-3 font-mono">01.</span>
              <span>Open your email client</span>
            </li>
            <li className="flex">
              <span className="font-bold mr-3 font-mono">02.</span>
              <span>Find the email from lab68dev CV Builder</span>
            </li>
            <li className="flex">
              <span className="font-bold mr-3 font-mono">03.</span>
              <span>Click the magic link to authenticate</span>
            </li>
            <li className="flex">
              <span className="font-bold mr-3 font-mono">04.</span>
              <span>You will be redirected to your dashboard</span>
            </li>
          </ol>
        </div>

        {/* Troubleshooting */}
        <div className="mb-8 p-4 bg-gray-50 border border-gray-200">
          <span className="label-mono block mb-2 text-gray-600">
            TROUBLESHOOTING
          </span>
          <p className="text-xs text-gray-600">
            Didn&apos;t receive the email? Check your spam folder. The email may
            take up to 2 minutes to arrive.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/login"
            className="border border-black px-6 py-3 text-xs font-bold uppercase tracking-widest text-center hover:bg-black hover:text-white transition-colors duration-150"
          >
            ← Try Different Email
          </Link>
          <Link
            href="/"
            className="border border-gray-300 px-6 py-3 text-xs font-bold uppercase tracking-widest text-center text-gray-500 hover:border-black hover:text-black transition-colors duration-150"
          >
            Back to Home
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-16 border-t border-gray-200 pt-6">
          <span className="label-mono text-gray-400">
            SECURE_AUTH // NO_PASSWORDS_STORED
          </span>
        </div>
      </div>
    </div>
  );
}

export default function VerifyRequestPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <span className="label-mono">LOADING...</span>
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
