import type { Metadata } from "next";
import { AccountContent } from "@/features/auth/components/account-content";
import { AccountShell } from "@/features/auth/components/account-shell";
import { authCopy } from "@/features/auth/copy";

export const metadata: Metadata = { title: authCopy.accountTitle };

export default function AccountPage() {
  return (
    <AccountShell current="summary" title={authCopy.accountTitle}>
      <AccountContent />
    </AccountShell>
  );
}
