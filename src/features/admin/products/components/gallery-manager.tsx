"use client";

import { useState } from "react";
import { isApiRequestError } from "@/lib/api/errors";
import {
  checkImageFile,
  moveImage,
  remainingSlots,
  removeImage,
  sameGallery,
  setAlt,
  type GalleryImage,
} from "../gallery/gallery";
import { saveGallery, uploadGalleryImage } from "../gallery/gallery-api";
import { galleryCopy as t } from "../gallery/gallery-copy";
import { GalleryView } from "./gallery-view";

/** مدیریت گالری یک محصول موجود: آپلود، ترتیب، متن جایگزین، حذف و ذخیره. */
export function GalleryManager({
  productId,
  initial,
}: {
  productId: string;
  initial: readonly GalleryImage[];
}) {
  const [saved, setSaved] = useState<readonly GalleryImage[]>(initial);
  const [images, setImages] = useState<readonly GalleryImage[]>(initial);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();
  const [notice, setNotice] = useState<string>();

  const change = (next: readonly GalleryImage[]) => {
    setImages(next);
    setNotice(undefined);
  };

  async function onFiles(files: File[]) {
    setError(undefined);
    setNotice(undefined);
    const room = remainingSlots(images.length);
    const accepted: File[] = [];
    for (const file of files.slice(0, room)) {
      const problem = checkImageFile(file);
      if (problem) {
        setError(`${file.name}: ${t.problem[problem]}`);
        continue;
      }
      accepted.push(file);
    }
    if (accepted.length === 0) return;
    setUploading(true);
    const added: GalleryImage[] = [];
    try {
      for (const file of accepted) added.push(await uploadGalleryImage(file));
    } catch (e) {
      setError(isApiRequestError(e) ? e.message : t.uploadError);
    } finally {
      if (added.length > 0) {
        setImages((current) => [...current, ...added]);
        if (added.length < accepted.length) setError(t.partial(added.length, accepted.length));
      }
      setUploading(false);
    }
  }

  async function onSave() {
    setSaving(true);
    setError(undefined);
    setNotice(undefined);
    try {
      const fresh = await saveGallery(productId, images);
      setSaved(fresh);
      setImages(fresh);
      setNotice(t.saved);
    } catch (e) {
      setError(isApiRequestError(e) ? e.message : t.saveError);
    } finally {
      setSaving(false);
    }
  }

  return (
    <GalleryView
      images={images}
      uploading={uploading}
      saving={saving}
      dirty={!sameGallery(images, saved)}
      error={error}
      notice={notice}
      onFiles={(files) => void onFiles(files)}
      onMove={(i, dir) => change(moveImage(images, i, dir))}
      onRemove={(i) => change(removeImage(images, i))}
      onAlt={(i, value) => change(setAlt(images, i, value))}
      onSave={() => void onSave()}
    />
  );
}
