import { toEnglishDigits } from "@/lib/format";
import { matchProvince } from "./provinces";
import type { AddressInput } from "./types";

export type Point = { lat: number; lng: number };

/** بخش‌هایی از آدرس که از نقشه پر می‌شوند؛ هر چه پیدا نشود نیست. */
export type ResolvedAddress = Partial<AddressInput>;

type NominatimAddress = Record<string, string | undefined>;
type NominatimResponse = { error?: string; address?: NominatimAddress };

const MAX_STREET = 100;

/** تبدیل پاسخ Nominatim به فیلدهای آدرس ما. بدون نتیجه: null. */
export function parseReverseGeocode(data: unknown): ResolvedAddress | null {
  if (!data || typeof data !== "object") return null;
  const { address, error } = data as NominatimResponse;
  if (error || !address) return null;

  const result: ResolvedAddress = {};

  const province = matchProvince(address.state);
  if (province) result.province = province;

  const rawCity =
    address.city ?? address.town ?? address.village ?? address.municipality ?? address.county;
  const city = rawCity?.replace(/^\s*شهرستان\s+/, "").trim();
  if (city) result.city = city;

  const street = [address.neighbourhood ?? address.suburb, address.road]
    .filter((part): part is string => Boolean(part))
    .join("، ")
    .slice(0, MAX_STREET);
  if (street) result.street = street;

  const postal = toEnglishDigits(address.postcode ?? "").replace(/\s+/g, "");
  if (/^\d{10}$/.test(postal)) result.postalCode = postal;

  return Object.keys(result).length > 0 ? result : null;
}

export class GeocodeError extends Error {
  constructor() {
    super("geocode failed");
    this.name = "GeocodeError";
  }
}

/**
 * تبدیل نقطه به آدرس با سرویس عمومی Nominatim (OpenStreetMap).
 * ☐ این سرویس برای مصرف سبک است و سقف درخواست دارد؛ پیش از انتشار با سرویس اختصاصی
 *    (یا مسیر بک‌اند) جایگزین شود. فقط همین تابع عوض می‌شود.
 */
export async function reverseGeocode(
  point: Point,
  signal?: AbortSignal,
): Promise<ResolvedAddress | null> {
  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("lat", String(point.lat));
  url.searchParams.set("lon", String(point.lng));
  url.searchParams.set("zoom", "18");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("accept-language", "fa");
  let res: Response;
  try {
    res = await fetch(url, { signal, headers: { Accept: "application/json" } });
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") throw e;
    throw new GeocodeError();
  }
  if (!res.ok) throw new GeocodeError();
  return parseReverseGeocode(await res.json().catch(() => null));
}
