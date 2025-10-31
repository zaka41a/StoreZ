import { ReactNode } from "react";
import { motion } from "framer-motion";

type AdminPageHeaderProps = {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  highlight?: ReactNode;
  children?: ReactNode;
};

export function AdminPageHeader({
  title,
  subtitle,
  icon,
  actions,
  highlight,
  children,
}: AdminPageHeaderProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl border border-brand-100 bg-gradient-to-r from-brand-700 via-brand-600 to-brand-500 text-white shadow-lg"
    >
      <div className="absolute right-10 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute left-10 top-10 h-32 w-32 rounded-full bg-white/10 blur-3xl" />

      <div className="relative flex flex-col gap-6 p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-1 items-start gap-4">
            {icon && (
              <div className="rounded-2xl border border-white/30 bg-white/15 p-3 text-white shadow-inner backdrop-blur">
                {icon}
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-widest text-white/70">
                {highlight}
              </div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {title}
              </h1>
              {subtitle && (
                <p className="max-w-2xl text-base text-white/80">{subtitle}</p>
              )}
            </div>
          </div>

          {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
        </div>

        {children && (
          <div className="flex flex-wrap gap-4 text-sm text-white/90">
            {children}
          </div>
        )}
      </div>
    </motion.section>
  );
}
