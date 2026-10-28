import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileQuestion,
  ClipboardCheck,
  ClipboardList,
  MessagesSquare,
  BookOpen,
  Bell,
  MessageSquareText,
  Building2,
  Settings,
  X,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useTranslation } from "@/utils/i18n";

const navItems = [
  { to: "/dashboard", key: "nav.dashboard", icon: LayoutDashboard },
  { to: "/students", key: "nav.students", icon: Users },
  { to: "/questions", key: "nav.questions", icon: FileQuestion },
  { to: "/questions/review", key: "nav.questionReview", icon: ClipboardCheck },
  { to: "/assignments", key: "nav.assignments", icon: ClipboardList },
  { to: "/study-rooms", key: "nav.studyRooms", icon: MessagesSquare },
  { to: "/materials", key: "nav.studyMaterials", icon: BookOpen },
  { to: "/notifications", key: "nav.notifications", icon: Bell },
  { to: "/admin-requests", key: "nav.adminRequests", icon: MessageSquareText },
  { to: "/account", key: "nav.b2bAccount", icon: Building2 },
  { to: "/settings", key: "nav.settings", icon: Settings },
];

export function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const { t, lang } = useTranslation();

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/40 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 start-0 z-50 flex w-64 flex-col border-e border-sidebar-border bg-sidebar transition-transform lg:static lg:transform-none",
          mobileOpen
            ? "translate-x-0"
            : lang === "ar"
              ? "max-lg:translate-x-full"
              : "max-lg:-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between gap-2 border-b border-sidebar-border px-5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-sm font-extrabold text-white">
              S
            </div>
            <div className="leading-tight">
              <p className="text-sm font-extrabold text-sidebar-foreground">{t("nav.brandName")}</p>
              <p className="text-[11px] font-medium text-muted-foreground">{t("nav.brandTagline")}</p>
            </div>
          </div>
          <button
            className="rounded-lg p-1 text-muted-foreground hover:bg-sidebar-accent lg:hidden"
            onClick={onClose}
            aria-label={t("common.close")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-thin px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                  )
                }
              >
                <Icon className="h-[18px] w-[18px]" />
                {t(item.key)}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <div className="rounded-xl bg-secondary p-3 text-xs text-secondary-foreground">
            <p className="font-bold">{t("nav.supportedTracksTitle")}</p>
            <p className="mt-0.5 text-muted-foreground">{t("nav.supportedTracksDesc")}</p>
          </div>
        </div>
      </aside>
    </>
  );
}
