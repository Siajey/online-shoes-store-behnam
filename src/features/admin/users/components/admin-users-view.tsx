import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StateMessage } from "@/components/ui/state-message";
import { cn } from "@/lib/cn";
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

type ChipsProps<T extends string> = {
  label: string;
  value: T | undefined;
  options: readonly T[];
  names: Record<T, string>;
  onChange: (value: T | undefined) => void;
};

function Chips<T extends string>({ label, value, options, names, onChange }: ChipsProps<T>) {
  const items: { value: T | undefined; name: string }[] = [
    { value: undefined, name: t.all },
    ...options.map((o) => ({ value: o, name: names[o] })),
  ];
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-2">
      <span className="text-fg-muted text-sm">{label}</span>
      {items.map((item) => (
        <button
          key={item.name}
          type="button"
          aria-pressed={value === item.value}
          onClick={() => onChange(item.value)}
          className={cn(
            "rounded-full px-4 py-2 text-sm",
            value === item.value ? "bg-brand text-on-brand" : "bg-surface text-fg-secondary",
          )}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

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
    <div className="flex flex-col gap-4">
      <Chips
        label={t.roleGroup}
        value={role}
        options={ROLES}
        names={ROLE_LABEL}
        onChange={onRole}
      />
      <Chips
        label={t.statusGroup}
        value={status}
        options={STATUSES}
        names={STATUS_LABEL}
        onChange={onStatus}
      />
      <form
        className="flex items-start gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          onSearch();
        }}
      >
        <div className="flex-1">
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
    <li className="rounded-card bg-surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span dir="ltr" className="font-medium">
            {toPersianDigits(user.phoneNumber)}
          </span>
          {isSelf && (
            <Badge variant="neutral" size="sm">
              {t.you}
            </Badge>
          )}
          <Badge variant={user.role === "admin" ? "success" : "neutral"} size="sm">
            {ROLE_LABEL[user.role]}
          </Badge>
          <Badge variant={STATUS_BADGE[user.status]} size="sm">
            {STATUS_LABEL[user.status]}
          </Badge>
        </div>
        <div className="text-fg-muted mt-1 text-sm">
          {t.joined}: {formatJoinDate(user.createdAt)}
        </div>
      </div>
      {isSelf ? (
        <p className="text-fg-muted text-xs sm:max-w-60">{t.selfNote}</p>
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
      <ul className="flex flex-col gap-3">
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
