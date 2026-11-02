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
