import type { Metadata } from "next";
import { AccountShell } from "@/features/auth/components/account-shell";
import { ProfileContent } from "@/features/auth/components/profile-content";
import { authCopy } from "@/features/auth/copy";

export const metadata: Metadata = { title: authCopy.profilePageTitle };

export default function ProfilePage() {
  return (
    <AccountShell current="profile" title={authCopy.profilePageTitle}>
      <ProfileContent />
    </AccountShell>
  );
}
