import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function OverviewIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1.2" />
      <rect x="14" y="3" width="7" height="7" rx="1.2" />
      <rect x="3" y="14" width="7" height="7" rx="1.2" />
      <rect x="14" y="14" width="7" height="7" rx="1.2" />
    </Icon>
  );
}

export function VisualQcIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M3.5 12s3.2-6.5 8.5-6.5S20.5 12 20.5 12 17.3 18.5 12 18.5 3.5 12 3.5 12Z" />
    </Icon>
  );
}

export function MechanicalIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6.1 6.1l1.6 1.6M16.3 16.3l1.6 1.6M17.9 6.1l-1.6 1.6M7.7 16.3l-1.6 1.6" />
    </Icon>
  );
}

export function SellerIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 19.2c.6-3.2 3.2-5 6.5-5s5.9 1.8 6.5 5" />
    </Icon>
  );
}

export function EvidenceIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="4" y="4.5" width="16" height="15" rx="2" />
      <path d="M8 9.5h8M8 13h5" />
    </Icon>
  );
}

export function DecisionIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m5 12.5 4.2 4.2L19 7.5" />
    </Icon>
  );
}

export function CaseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8 7V5.8A1.8 1.8 0 0 1 9.8 4h4.4A1.8 1.8 0 0 1 16 5.8V7" />
      <rect x="4.5" y="7" width="15" height="13" rx="2" />
    </Icon>
  );
}

export function BellIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6.5 16.5h11l-1-7a5.5 5.5 0 1 0-9 0l-1 7Z" />
      <path d="M10 16.5a2 2 0 0 0 4 0" />
    </Icon>
  );
}

export function ExportIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 4.5v10" />
      <path d="m8.5 8 3.5-3.5L15.5 8" />
      <path d="M5 16.5v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2" />
    </Icon>
  );
}
