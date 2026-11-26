import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps): IconProps => ({
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  ...props,
});

export const MenuIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export const SearchIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const CartIcon = (props: IconProps) => (
  <svg {...base({ fill: 'currentColor', stroke: 'none', ...props })}>
    <path d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM1 2h3.3l.9 2H21a1 1 0 0 1 .9 1.4l-3.6 6.5a2 2 0 0 1-1.8 1.1H8.1l-1 1.8a.3.3 0 0 0 .2.4H19v2H7a2 2 0 0 1-1.8-3l1.4-2.4L3 4H1V2Z" />
  </svg>
);

export const UserCircleIcon = (props: IconProps) => (
  <svg {...base({ fill: 'currentColor', stroke: 'none', ...props })}>
    <path
      fillRule="evenodd"
      d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 4a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Zm0 14a8 8 0 0 1-6.2-2.9c.9-1.8 3.3-3.1 6.2-3.1s5.3 1.3 6.2 3.1A8 8 0 0 1 12 20Z"
    />
  </svg>
);

export const UserIcon = (props: IconProps) => (
  <svg {...base({ fill: 'currentColor', stroke: 'none', ...props })}>
    <circle cx="12" cy="7" r="4.5" />
    <path d="M3 21c0-4.4 4-7.5 9-7.5s9 3.1 9 7.5H3Z" />
  </svg>
);

export const ArrowLeftIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);

export const ArrowRightIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const CheckIcon = (props: IconProps) => (
  <svg {...base({ strokeWidth: 3, ...props })}>
    <path d="m5 12 5 5 9-10" />
  </svg>
);

export const StarIcon = (props: IconProps) => (
  <svg {...base({ fill: 'currentColor', stroke: 'none', ...props })}>
    <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8L12 2.5Z" />
  </svg>
);

export const CloseIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const SlidersIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1" />
    <circle cx="15" cy="6" r="2" />
    <circle cx="9" cy="12" r="2" />
    <circle cx="17" cy="18" r="2" />
  </svg>
);

export const TruckIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M3 6h11v9H3zM14 9h4l3 3v3h-7" />
    <circle cx="7" cy="17.5" r="1.8" />
    <circle cx="17" cy="17.5" r="1.8" />
  </svg>
);

export const ShieldIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M12 3 4.5 6v5.5c0 4.5 3.2 8.3 7.5 9.5 4.3-1.2 7.5-5 7.5-9.5V6L12 3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const ReturnIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M9 14 4 9l5-5" />
    <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
  </svg>
);

export const ChevronRightIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);

export const ChevronLeftIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="m15 6-6 6 6 6" />
  </svg>
);

export const ExpandIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
  </svg>
);
