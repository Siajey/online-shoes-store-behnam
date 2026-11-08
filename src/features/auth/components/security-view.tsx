import { Button } from "@/components/ui/button";
import { authCopy as t } from "../copy";

type Props = {
  onLogout: () => void;
  loggingOut: boolean;
  confirmingDelete: boolean;
  onAskDelete: () => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
  deleting: boolean;
  error?: string;
};

/** نمای خالص امنیت حساب: روش ورود، خروج و حذف حساب (با تأیید). */
export function SecurityView(p: Props) {
  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-card bg-surface flex flex-col gap-2 p-6">
        <h2 className="text-lg font-medium">{t.loginMethodTitle}</h2>
        <p className="text-fg-secondary text-sm leading-7">{t.loginMethodText}</p>
      </section>

      <section className="rounded-card bg-surface flex flex-col gap-4 p-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-medium">{t.logoutTitle}</h2>
          <p className="text-fg-secondary text-sm">{t.logoutText}</p>
        </div>
        <div>
          <Button variant="outline" onClick={p.onLogout} loading={p.loggingOut}>
            {t.logout}
          </Button>
        </div>
      </section>

      <section className="rounded-card bg-surface flex flex-col gap-4 p-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-danger text-lg font-medium">{t.dangerTitle}</h2>
          <p className="text-fg-secondary text-sm leading-7">{t.dangerText}</p>
        </div>
        {p.confirmingDelete ? (
          <div role="alertdialog" aria-label={t.deleteConfirmTitle} className="flex flex-col gap-3">
            <p className="text-base font-medium">{t.deleteConfirmTitle}</p>
            <p className="text-fg-secondary text-sm">{t.deleteConfirmText}</p>
            <div className="flex gap-2">
              <Button variant="danger" onClick={p.onConfirmDelete} loading={p.deleting}>
                {t.deleteConfirm}
              </Button>
              <Button variant="ghost" onClick={p.onCancelDelete} disabled={p.deleting}>
                {t.deleteCancel}
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <Button variant="danger" onClick={p.onAskDelete}>
              {t.deleteAccount}
            </Button>
          </div>
        )}
        {p.error && (
          <p role="alert" className="text-danger text-sm">
            {p.error}
          </p>
        )}
      </section>
    </div>
  );
}
