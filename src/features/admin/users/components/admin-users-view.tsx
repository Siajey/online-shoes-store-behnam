import { UsersIcon } from "@/features/admin/components/admin-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { StateMessage } from "@/components/ui/state-message";
import { toPersianDigits } from "@/lib/format";
import { adminUsersCopy as t } from "../copy";
import { formatJoinDate } from "../format";
import {
  ACTION_LABEL,
  ROLE_LABEL,
  STATUS_BADGE,
  STATUS_LABEL,
  userActions,
  type UserAction,
} from "../labels";
import { ROLES, STATUSES, type AdminUser, type UserRole, type UserStatus } from "../types";

/** ستون‌های جدول در صفحه‌ی بزرگ: کاربر | نقش | عضویت | وضعیت | عملیات */
const GRID =
  "lg:grid lg:grid-cols-[minmax(0,2fr)_1fr_1.2fr_1fr_minmax(0,2.4fr)] lg:items-center lg:gap-4";

const ROLE_OPTIONS = ROLES.map((r) => ({ value: r, label: ROLE_LABEL[r] }));
const STATUS_OPTIONS = STATUSES.map((s) => ({ value: s, label: STATUS_LABEL[s] }));

export type UsersFilterBarProps = {
  role: UserRole | undefined;
  status: UserStatus | undefined;
  phone: string;
  phoneError?: string;
  total: number | null;
  onRole: (v: UserRole | undefined) => void;
  onStatus: (v: UserStatus | undefined) => void;
  onPhone: (v: string) => void;
  onSearch: () => void;
  onClear: () => void;
};

export function UsersFilterBar({
  role,
  status,
  phone,
  phoneError,
  total,
  onRole,
  onStatus,
  onPhone,
  onSearch,
  onClear,
}: UsersFilterBarProps) {
  return (
    <div className="flex flex-col gap-3">
      <form
        className="flex flex-wrap items-start gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          onSearch();
        }}
      >
        <div className="min-w-56 flex-1">
          <Input
            label={t.phoneLabel}
            hint={t.phoneHint}
            ltr
            inputMode="tel"
            value={phone}
            error={phoneError}
            onChange={(e) => onPhone(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-40">
          <Select
            label={t.roleGroup}
            options={ROLE_OPTIONS}
            placeholder={t.all}
            value={role ?? ""}
            onChange={(e) => onRole((e.target.value || undefined) as UserRole | undefined)}
          />
        </div>
        <div className="w-full sm:w-40">
          <Select
            label={t.statusGroup}
            options={STATUS_OPTIONS}
            placeholder={t.all}
            value={status ?? ""}
            onChange={(e) => onStatus((e.target.value || undefined) as UserStatus | undefined)}
          />
        </div>
        <Button type="submit" variant="secondary" className="mt-7 h-13">
          {t.searchCta}
        </Button>
        {phone && (
          <Button type="button" variant="ghost" className="mt-7 h-13" onClick={onClear}>
            {t.clear}
          </Button>
        )}
      </form>
      {total !== null && (
        <p className="text-fg-muted text-sm">
          {t.total}: {toPersianDigits(total)}
        </p>
      )}
    </div>
  );
}

export type UserRowProps = {
  user: AdminUser;
  isSelf: boolean;
  busy: boolean;
  confirming: UserAction | null;
  onAction: (action: UserAction) => void;
  onConfirm: () => void;
  onCancel: () => void;
};

export function UserRow({
  user,
  isSelf,
  busy,
  confirming,
  onAction,
  onConfirm,
  onCancel,
}: UserRowProps) {
  return (
    <li className={`flex flex-col gap-3 py-4 ${GRID}`}>
      <div className="flex min-w-0 items-center gap-3">
        <span
          aria-hidden="true"
          className="bg-surface-2 text-brand flex size-11 flex-none items-center justify-center rounded-full"
        >
          <UsersIcon width="20" height="20" />
        </span>
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span dir="ltr" className="font-medium">
            {toPersianDigits(user.phoneNumber)}
          </span>
          {isSelf && (
            <Badge variant="neutral" size="sm">
              {t.you}
            </Badge>
          )}
        </div>
      </div>
      <div>
        <Badge variant={user.role === "admin" ? "success" : "neutral"} size="sm">
          {ROLE_LABEL[user.role]}
        </Badge>
      </div>
      <div className="text-fg-muted text-sm">
        <span className="lg:sr-only">{t.joined}: </span>
        {formatJoinDate(user.createdAt)}
      </div>
      <div>
        <Badge variant={STATUS_BADGE[user.status]} size="sm">
          {STATUS_LABEL[user.status]}
        </Badge>
      </div>
      {isSelf ? (
        <p className="text-fg-muted text-xs">{t.selfNote}</p>
      ) : confirming ? (
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t.confirmTitle}>
          <span className="text-danger text-sm">
            {t.confirmTitle} ({ACTION_LABEL[confirming]})
          </span>
          <Button size="sm" variant="danger" disabled={busy} onClick={onConfirm}>
            {t.confirm}
          </Button>
          <Button size="sm" variant="ghost" disabled={busy} onClick={onCancel}>
            {t.cancel}
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {userActions(user).map((action) => (
            <Button
              key={action}
              size="sm"
              variant="secondary"
              disabled={busy}
              onClick={() => onAction(action)}
            >
              {ACTION_LABEL[action]}
            </Button>
          ))}
        </div>
      )}
    </li>
  );
}

function HeaderRow() {
  const c = t.columns;
  return (
    <div
      aria-hidden="true"
      className={`text-fg-muted border-line hidden border-b pb-3 text-sm ${GRID}`}
    >
      <span>{c.user}</span>
      <span>{c.role}</span>
      <span>{c.joined}</span>
      <span>{c.status}</span>
      <span>{c.actions}</span>
    </div>
  );
}

export type UsersListViewProps = {
  state:
    | { status: "loading" }
    | { status: "error"; message: string }
    | { status: "ready"; items: AdminUser[]; hasMore: boolean };
  selfId?: string;
  busyId: string | null;
  confirming: { id: string; action: UserAction } | null;
  actionError?: string;
  loadingMore: boolean;
  onAction: (id: string, action: UserAction) => void;
  onConfirm: () => void;
  onCancelConfirm: () => void;
  onRetry: () => void;
  onLoadMore: () => void;
};

export function UsersListView(p: UsersListViewProps) {
  if (p.state.status === "loading") return <StateMessage>{t.loading}</StateMessage>;
  if (p.state.status === "error") {
    return (
      <div className="flex flex-col items-center gap-4">
        <StateMessage tone="error" className="w-full">
          {p.state.message}
        </StateMessage>
        <Button variant="secondary" onClick={p.onRetry}>
          {t.retry}
        </Button>
      </div>
    );
  }
  if (p.state.items.length === 0) return <StateMessage>{t.empty}</StateMessage>;
  return (
    <div className="flex flex-col gap-4">
      {p.actionError && <StateMessage tone="error">{p.actionError}</StateMessage>}
      <div className="rounded-card bg-surface p-4 lg:p-6">
        <HeaderRow />
        <ul className="divide-line divide-y">
          {p.state.items.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              isSelf={user.id === p.selfId}
              busy={p.busyId === user.id}
              confirming={p.confirming?.id === user.id ? p.confirming.action : null}
              onAction={(a) => p.onAction(user.id, a)}
              onConfirm={p.onConfirm}
              onCancel={p.onCancelConfirm}
            />
          ))}
        </ul>
      </div>
      {p.state.hasMore && (
        <Button
          variant="outline"
          disabled={p.loadingMore}
          onClick={p.onLoadMore}
          className="self-center"
        >
          {t.loadMore}
        </Button>
      )}
    </div>
  );
}
