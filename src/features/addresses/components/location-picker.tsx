"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import { Button } from "@/components/ui/button";
import { addressCopy } from "../copy";
import { reverseGeocode, type Point, type ResolvedAddress } from "../geocoding";

type Props = {
  /** وقتی آدرس از روی نقطه پیدا شد، فیلدهای پیدا‌شده را می‌دهد */
  onResolved: (partial: ResolvedAddress) => void;
};

type Status = "idle" | "resolving" | "resolved" | "notFound" | "error" | "denied" | "unsupported";

const TEHRAN: [number, number] = [35.6892, 51.389];

const statusText: Record<Exclude<Status, "idle">, string> = {
  resolving: addressCopy.resolving,
  resolved: addressCopy.resolved,
  notFound: addressCopy.notFound,
  error: addressCopy.geocodeError,
  denied: addressCopy.locationDenied,
  unsupported: addressCopy.locationUnsupported,
};

/**
 * نقشه‌ی انتخاب موقعیت (Leaflet + OpenStreetMap). فقط سمت کلاینت بارگذاری می‌شود.
 * ☐ مختصات فقط در حالت صفحه می‌ماند؛ ذخیره‌ی lat/lng منتظر پشتیبانی بک‌اند است.
 */
export function LocationPicker({ onResolved }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const placeRef = useRef<(p: Point, pan?: boolean) => void>(() => {});
  const onResolvedRef = useRef(onResolved);
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    onResolvedRef.current = onResolved;
  }, [onResolved]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      const el = containerRef.current;
      if (cancelled || !el) return;

      const map = L.map(el, { center: TEHRAN, zoom: 12 });
      mapRef.current = map;
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
      }).addTo(map);

      const icon = L.divIcon({
        className: "",
        html: '<div style="width:22px;height:22px;border-radius:9999px;background:var(--brand);border:3px solid #fff;box-shadow:0 1px 6px rgba(0,0,0,.4)"></div>',
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      placeRef.current = (point, pan) => {
        if (markerRef.current) markerRef.current.setLatLng([point.lat, point.lng]);
        else markerRef.current = L.marker([point.lat, point.lng], { icon }).addTo(map);
        if (pan) map.setView([point.lat, point.lng], 16);

        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;
        setStatus("resolving");
        reverseGeocode(point, controller.signal)
          .then((partial) => {
            if (!partial) return setStatus("notFound");
            onResolvedRef.current(partial);
            setStatus("resolved");
          })
          .catch((e: unknown) => {
            if (e instanceof DOMException && e.name === "AbortError") return;
            setStatus("error");
          });
      };

      map.on("click", (e) => placeRef.current({ lat: e.latlng.lat, lng: e.latlng.lng }));
    })();

    return () => {
      cancelled = true;
      abortRef.current?.abort();
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  function locateMe() {
    if (!("geolocation" in navigator)) return setStatus("unsupported");
    navigator.geolocation.getCurrentPosition(
      (pos) => placeRef.current({ lat: pos.coords.latitude, lng: pos.coords.longitude }, true),
      () => setStatus("denied"),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <section aria-labelledby="map-title" className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 id="map-title" className="font-medium">
          {addressCopy.mapTitle}
        </h3>
        <Button type="button" variant="secondary" onClick={locateMe}>
          {addressCopy.useMyLocation}
        </Button>
      </div>
      <p className="text-fg-muted text-sm">{addressCopy.mapHint}</p>
      <div
        ref={containerRef}
        dir="ltr"
        role="application"
        aria-label={addressCopy.mapLabel}
        className="border-line bg-surface-2 relative isolate z-0 h-64 w-full overflow-hidden rounded-2xl border sm:h-80"
      />
      {status !== "idle" && (
        <p
          role="status"
          className={
            status === "resolved"
              ? "text-ok text-sm"
              : status === "resolving"
                ? "text-fg-muted text-sm"
                : "text-danger text-sm"
          }
        >
          {statusText[status]}
        </p>
      )}
    </section>
  );
}
