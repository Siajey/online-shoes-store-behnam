import type { Metadata } from "next";
import { AddressesContent } from "@/features/addresses/components/addresses-content";
import { addressCopy } from "@/features/addresses/copy";
import { AccountTabs } from "@/features/auth/components/account-tabs";

export const metadata: Metadata = { title: addressCopy.title };

export default function AddressesPage() {
  return (
    <main className="mx-auto w-full max-w-300 px-4 py-6 lg:px-8 lg:py-10">
      <h1 className="mb-6 text-2xl font-semibold lg:text-3xl">{addressCopy.title}</h1>
      <AccountTabs current="addresses" />
      <AddressesContent />
    </main>
  );
}
