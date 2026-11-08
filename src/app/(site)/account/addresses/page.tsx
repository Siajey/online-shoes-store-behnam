import type { Metadata } from "next";
import { AddressesContent } from "@/features/addresses/components/addresses-content";
import { addressCopy } from "@/features/addresses/copy";
import { AccountShell } from "@/features/auth/components/account-shell";

export const metadata: Metadata = { title: addressCopy.title };

export default function AddressesPage() {
  return (
    <AccountShell current="addresses" title={addressCopy.title}>
      <AddressesContent />
    </AccountShell>
  );
}
