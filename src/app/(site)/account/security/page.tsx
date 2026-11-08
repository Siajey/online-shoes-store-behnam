import type { Metadata } from "next";
import { AccountShell } from "@/features/auth/components/account-shell";
import { SecurityContent } from "@/features/auth/components/security-content";
import { authCopy } from "@/features/auth/copy";

export const metadata: Metadata = { title: authCopy.securityTitle };

export default function SecurityPage() {
  return (
    <AccountShell current="security" title={authCopy.securityTitle}>
      <SecurityContent />
    </AccountShell>
  );
}
