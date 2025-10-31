import { ReactNode } from "react";

type Tone =
  | "brand"
  | "blue"
  | "green"
  | "amber"
  | "red"
  | "purple"
  | "slate";

const toneClasses: Record<Tone, string> = {
  brand: "badge badge-soft-brand",
  blue: "badge bg-blue-50 text-blue-700",
  green: "badge badge-soft-green",
  amber: "badge badge-soft-yellow",
  red: "badge badge-soft-red",
  purple: "badge bg-purple-50 text-purple-700",
  slate: "badge badge-soft-slate",
};

const toneDotClasses: Record<Tone, string> = {
  brand: "before:bg-brand-500",
  blue: "before:bg-blue-500",
  green: "before:bg-green-500",
  amber: "before:bg-yellow-500",
  red: "before:bg-red-500",
  purple: "before:bg-purple-500",
  slate: "before:bg-gray-400",
};

type StatusPillProps = {
  tone?: Tone;
  icon?: ReactNode;
  children: ReactNode;
};

export function StatusPill({ tone = "slate", icon, children }: StatusPillProps) {
  const base = toneClasses[tone];
  const dot = icon ? "" : ` badge-dot ${toneDotClasses[tone]}`;

  return (
    <span className={`${base}${dot}`}>
      {icon}
      {children}
    </span>
  );
}
