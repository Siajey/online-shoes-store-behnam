import { api } from "@/lib/api";
import type { AddressDto } from "./dto";
import { toAddress, toAddresses } from "./mappers";
import type { Address, AddressInput } from "./types";

/*
 * مسیرها از address.controller بک‌اند. خواندن CSRF نمی‌خواهد؛ بقیه می‌خواهند
 * (کلاینت خودش توکن می‌گیرد). حذف پاسخ ۲۰۴ بدون بدنه دارد.
 */
const base = "/users/me/addresses";
const one = (id: string) => `${base}/${encodeURIComponent(id)}`;

export async function listAddresses(signal?: AbortSignal): Promise<Address[]> {
  const res = await api.get<AddressDto[]>(base, { signal });
  return toAddresses(res.data ?? []);
}

export async function createAddress(input: AddressInput): Promise<Address> {
  const res = await api.post<AddressDto>(base, { body: input });
  return toAddress(res.data);
}

export async function updateAddress(id: string, input: AddressInput): Promise<Address> {
  const res = await api.patch<AddressDto>(one(id), { body: input });
  return toAddress(res.data);
}

export async function setDefaultAddress(id: string): Promise<Address> {
  const res = await api.post<AddressDto>(`${one(id)}/default`);
  return toAddress(res.data);
}

export async function deleteAddress(id: string): Promise<void> {
  await api.delete(one(id));
}
