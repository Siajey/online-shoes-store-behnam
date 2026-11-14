import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

/** محصولات */
export const BoxIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z" />
    <path d="m4 7 8 4 8-4M12 11v10" />
  </Icon>
);

/** دسته‌بندی‌ها */
export const TagIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M3 12V4h8l9 9-8 8-9-9Z" />
    <circle cx="7.5" cy="8.5" r="1" />
  </Icon>
);

/** برندها */
export const BadgeIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9L12 3Z" />
  </Icon>
);

/** کاربران */
export const UsersIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" />
    <path d="M16 5.2a3 3 0 0 1 0 5.6M18 14.8c1.8.7 3 2.4 3 5.2" />
  </Icon>
);

/** بازگشت به فروشگاه */
export const ExitIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M10 4H5v16h5" />
    <path d="M9 12h11m-4-4 4 4-4 4" />
  </Icon>
);

/** ویرایش */
export const PencilIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="m4 20 1-4L16.5 4.5a2 2 0 0 1 3 3L8 19l-4 1Z" />
    <path d="m14.5 6.5 3 3" />
  </Icon>
);

/** افزودن */
export const PlusIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);
