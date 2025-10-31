import { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

type Trend = {
  direction: "up" | "down";
  value: string;
  label?: string;
};

type Accent = "brand" | "blue" | "green" | "purple" | "amber" | "rose";

type AdminStatCardProps = {
  icon?: ReactNode;
  label: string;
  value: ReactNode;
  helper?: string;
  trend?: Trend;
  accent?: Accent;
  footer?: ReactNode;
};

const accentClasses: Record<Accent, string> = {
  brand: "bg-brand-50 text-brand-700",
  blue: "bg-blue-50 text-blue-700",
  green: "bg-green-50 text-green-700",
  purple: "bg-purple-50 text-purple-700",
  amber: "bg-amber-50 text-amber-700",
  rose: "bg-rose-50 text-rose-700",
};

export function AdminStatCard({
  icon,
  label,
  value,
  helper,
  trend,
  accent = "brand",
  footer,
}: AdminStatCardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="card relative overflow-hidden p-6"
    >
      <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-br from-white/10 to-transparent blur-2xl" />
      <div className="relative flex flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {icon && (
              <span
                className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${accentClasses[accent]}`}
              >
                {icon}
              </span>
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                {label}
              </p>
              <div className="text-3xl font-semibold text-gray-900">
                {value}
              </div>
            </div>
          </div>

          {trend && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                trend.direction === "up"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {trend.direction === "up" ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownRight className="h-4 w-4" />
              )}
              {trend.value}
              {trend.label && (
                <span className="font-medium text-gray-500">
                  {trend.label}
                </span>
              )}
            </span>
          )}
        </div>

        {helper && (
          <p className="text-sm text-gray-500">
            {helper}
          </p>
        )}

        {footer && (
          <div className="border-t border-dashed border-gray-200 pt-4 text-sm text-gray-500">
            {footer}
          </div>
        )}
      </div>
    </motion.article>
  );
}
