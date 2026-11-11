import { Button } from "@/components/ui/button";
import { taxonomyCopy as t } from "../copy";

export type RowActionsProps = {
  confirming: boolean;
  busy: boolean;
  confirmText: string;
  onEdit: () => void;
  onAskDelete: () => void;
  onConfirmDelete: () => void;
  onCancel: () => void;
};

/** ویرایش و حذف دومرحله‌ای (اول تأیید، بعد حذف). */
export function RowActions({
  confirming,
  busy,
  confirmText,
  onEdit,
  onAskDelete,
  onConfirmDelete,
  onCancel,
}: RowActionsProps) {
  if (confirming) {
    return (
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label={confirmText}>
        <span className="text-danger text-sm">{confirmText}</span>
        <Button size="sm" variant="danger" disabled={busy} onClick={onConfirmDelete}>
          {t.confirmDelete}
        </Button>
        <Button size="sm" variant="ghost" disabled={busy} onClick={onCancel}>
          {t.cancel}
        </Button>
      </div>
    );
  }
  return (
    <div className="flex gap-2">
      <Button size="sm" variant="secondary" disabled={busy} onClick={onEdit}>
        {t.edit}
      </Button>
      <Button size="sm" variant="outline" disabled={busy} onClick={onAskDelete}>
        {t.delete}
      </Button>
    </div>
  );
}
