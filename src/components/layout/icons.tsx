import type { ComponentProps } from "react";

function Icon({ children, ...props }: ComponentProps<"svg">) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
      {...props}
    >
      {children}
    </svg>
  );
}

export const SearchIcon = (p: ComponentProps<"svg">) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </Icon>
);
export const HeartIcon = (p: ComponentProps<"svg">) => (
  <Icon {...p}>
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
  </Icon>
);
export const BagIcon = (p: ComponentProps<"svg">) => (
  <Icon {...p}>
    <path d="M6 8h12l1 12H5L6 8z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    <path d="M9.5 13.5c1.5 1.6 3.5 1.6 5 0" />
  </Icon>
);
export const UserIcon = (p: ComponentProps<"svg">) => (
  <Icon {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c1-4 4-6 8-6s7 2 8 6" />
  </Icon>
);
export const HomeIcon = (p: ComponentProps<"svg">) => (
  <Icon {...p}>
    <path d="M4 11l8-7 8 7v9H4z" />
    <path d="M10 20v-6h4v6" />
  </Icon>
);
export const BellIcon = (p: ComponentProps<"svg">) => (
  <Icon {...p}>
    <path d="M6 17v-6a6 6 0 0 1 12 0v6l1.5 2h-15z" />
    <path d="M10 21h4" />
  </Icon>
);
export const TrashIcon = (p: ComponentProps<"svg">) => (
  <Icon {...p}>
    <path d="M4 7h16" />
    <path d="M9 7V4h6v3" />
    <path d="M6 7l1 13h10l1-13" />
    <path d="M10 11v6M14 11v6" />
  </Icon>
);

export const SummaryIcon = (p: ComponentProps<"svg">) => (
  <Icon {...p}>
    <path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" />
  </Icon>
);
export const CubeIcon = (p: ComponentProps<"svg">) => (
  <Icon {...p}>
    <path d="M21 8l-9-5-9 5v8l9 5 9-5zM3.3 7L12 12l8.7-5M12 22V12" />
  </Icon>
);
export const PinIcon = (p: ComponentProps<"svg">) => (
  <Icon {...p}>
    <path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" />
    <circle cx="12" cy="10" r="2.5" />
  </Icon>
);
export const PencilIcon = (p: ComponentProps<"svg">) => (
  <Icon {...p}>
    <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
  </Icon>
);
export const ShieldIcon = (p: ComponentProps<"svg">) => (
  <Icon {...p}>
    <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
  </Icon>
);
export const LogoutIcon = (p: ComponentProps<"svg">) => (
  <Icon {...p}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
  </Icon>
);
export const PlusIcon = (p: ComponentProps<"svg">) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);
/** فلش «جلو» در راست‌به‌چپ (رو به چپ). */
export const ChevronStartIcon = (p: ComponentProps<"svg">) => (
  <Icon {...p}>
    <path d="M15 5l-7 7 7 7" />
  </Icon>
);
export const HelpIcon = (p: ComponentProps<"svg">) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01" />
  </Icon>
);

export const TicketIcon = (p: ComponentProps<"svg">) => (
  <Icon {...p}>
    <path d="M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2.5 2.5 0 0 0 0 5v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2.5 2.5 0 0 0 0-5zM14 6v12" />
  </Icon>
);
