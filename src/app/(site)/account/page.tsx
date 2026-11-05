import type { Metadata } from "next";
import { AccountContent } from "@/features/auth/components/account-content";
import { authCopy } from "@/features/auth/copy";

export const metadata: Metadata = { title: authCopy.accountTitle };

export default function AccountPage() {
  return (
    <main className="mx-auto w-full max-w-300 px-4 py-6 lg:px-8 lg:py-10">
      <h1 className="mb-6 text-2xl font-semibold lg:text-3xl">{authCopy.accountTitle}</h1>
      <AccountContent />
    </main>
  );
}
