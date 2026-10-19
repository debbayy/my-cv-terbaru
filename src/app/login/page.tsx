import { Suspense } from "react";
import Link from "next/link";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-app grid place-items-center px-4 py-8">
      <div className="w-full max-w-sm">
        <Link href="/" className="font-display mb-8 block text-center text-3xl font-bold">
          CV<span className="text-brand">ku</span>
        </Link>
        <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
