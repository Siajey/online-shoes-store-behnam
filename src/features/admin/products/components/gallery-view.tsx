import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StateMessage } from "@/components/ui/state-message";
import { toPersianDigits } from "@/lib/format";
import { galleryCopy as t } from "../gallery/gallery-copy";
import { GALLERY_LIMITS, remainingSlots, type GalleryImage } from "../gallery/gallery";

export type GalleryViewProps = {
  images: readonly GalleryImage[];
  uploading: boolean;
  saving: boolean;
  dirty: boolean;
  error?: string;
  notice?: string;
  onFiles: (files: File[]) => void;
  onMove: (index: number, dir: -1 | 1) => void;
  onRemove: (index: number) => void;
  onAlt: (index: number, value: string) => void;
  onSave: () => void;
};

export function GalleryView({
  images,
  uploading,
  saving,
  dirty,
  error,
  notice,
  onFiles,
  onMove,
  onRemove,
  onAlt,
  onSave,
}: GalleryViewProps) {
  const slots = remainingSlots(images.length);
  const busy = uploading || saving;
  return (
    <section
      aria-labelledby="gallery-title"
      className="rounded-card bg-surface flex flex-col gap-4 p-5 lg:p-6"
    >
      <div>
        <h2 id="gallery-title" className="text-lg font-medium">
          {t.title}
        </h2>
        <p className="text-fg-muted mt-1 text-sm">{t.note}</p>
      </div>

      {images.length === 0 ? (
        <StateMessage>{t.empty}</StateMessage>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img, i) => (
            <li key={img.fileKey} className="border-line flex flex-col gap-3 rounded-lg border p-3">
              <div className="bg-surface-2 relative aspect-square overflow-hidden rounded-lg">
                {img.url && (
                  <Image
                    src={img.url}
                    alt={img.altText}
                    fill
                    unoptimized
                    sizes="(min-width: 1024px) 220px, 50vw"
                    className="object-cover"
                  />
                )}
                {i === 0 && (
                  <span className="bg-brand text-on-brand absolute start-2 top-2 rounded-full px-2 py-1 text-xs">
                    {t.primary}
                  </span>
                )}
                <span className="bg-surface/90 absolute end-2 top-2 rounded-full px-2 py-1 text-xs">
                  {toPersianDigits(i + 1)}
                </span>
              </div>
              <Input
                label={t.alt}
                value={img.altText}
                maxLength={GALLERY_LIMITS.altMax}
                onChange={(e) => onAlt(i, e.target.value)}
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={busy || i === 0}
                  onClick={() => onMove(i, -1)}
                >
                  {t.moveEarlier}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={busy || i === images.length - 1}
                  onClick={() => onMove(i, 1)}
                >
                  {t.moveLater}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={busy}
                  onClick={() => onRemove(i)}
                >
                  {t.remove}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {slots > 0 ? (
          <label
            className={buttonVariants({
              variant: "secondary",
              className:
                "has-focus-visible:outline-brand cursor-pointer has-focus-visible:outline-2",
            })}
          >
            {uploading ? t.uploading : t.add}
            <input
              type="file"
              multiple
              accept={GALLERY_LIMITS.allowedTypes.join(",")}
              disabled={busy}
              className="sr-only"
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                e.target.value = "";
                if (files.length > 0) onFiles(files);
              }}
            />
          </label>
        ) : (
          <span className="text-fg-muted text-sm">{t.full}</span>
        )}
        <Button type="button" disabled={busy || !dirty} onClick={onSave}>
          {saving ? t.saving : t.save}
        </Button>
        {dirty && !busy && <span className="text-warn text-sm">{t.unsaved}</span>}
      </div>

      {error && (
        <p role="alert" className="text-danger text-sm">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="text-ok text-sm">
          {notice}
        </p>
      )}
    </section>
  );
}
