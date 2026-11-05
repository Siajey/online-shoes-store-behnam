import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginContent, type LoginSearchParams } from "@/features/auth/components/login-content";
import { authCopy } from "@/features/auth/copy";

export const metadata: Metadata = { title: authCopy.loginTitle };

function LoginSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="rounded-card bg-surface mx-auto h-80 w-full max-w-md animate-pulse motion-reduce:animate-none"
    />
  );
}

export default function LoginPage({ searchParams }: { searchParams: Promise<LoginSearchParams> }) {
  return (
    <main className="mx-auto w-full max-w-300 px-4 py-10 lg:px-8 lg:py-16">
      <Suspense fallback={<LoginSkeleton />}>
        <LoginContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
