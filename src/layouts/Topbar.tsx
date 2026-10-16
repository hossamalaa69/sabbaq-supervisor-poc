import { useState } from "react";
import { Menu, Bell, ChevronDown, LogOut, Settings as SettingsIcon, Languages, Mail } from "lucide-react";
import { Avatar } from "@/components/ui";
import { useAuthStore, useNotificationsStore } from "@/store";
import { relativeTime } from "@/utils/format";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "@/utils/i18n";
import { cn } from "@/utils/cn";

export function Topbar({ title, onMenuClick }: { title: string; onMenuClick: () => void }) {
  const teacher = useAuthStore((s) => s.teacher);
  const notifications = useNotificationsStore((s) => s.notifications);
  const markRead = useNotificationsStore((s) => s.markRead);
  const markAllRead = useNotificationsStore((s) => s.markAllRead);
  const navigate = useNavigate();
  const { t, lang, setLang } = useTranslation();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const recentNotifications = notifications.slice(0, 5);
  const unreadCount = notifications.filter((item) => !item.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/80 px-4 backdrop-blur sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden"
          onClick={onMenuClick}
          aria-label={t("nav.openNavigation")}
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="truncate text-lg font-bold">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted"
          onClick={() => setLang(lang === "ar" ? "en" : "ar")}
          aria-label={t("language.switchTo")}
          title={t("language.switchTo")}
        >
          <Languages className="h-4 w-4" />
          <span className="hidden sm:inline">{lang === "ar" ? t("language.english") : t("language.arabic")}</span>
        </button>

        <div className="relative">
          <button
            className="relative rounded-full p-2 text-muted-foreground hover:bg-muted"
            onClick={() => {
              setNotifOpen((v) => !v);
              setProfileOpen(false);
            }}
            aria-label={t("topbar.notifications")}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -end-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute end-0 mt-2 w-[22rem] max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-popover p-2 shadow-popover animate-fade-in">
              <div className="flex items-center justify-between gap-2 px-2 py-1.5">
                <p className="text-sm font-bold">
                  {t("topbar.notifications")}
                  {unreadCount > 0 && (
                    <span className="ms-1 text-xs font-semibold text-primary">
                      ({t("notificationsCenter.unreadShort", { count: unreadCount })})
                    </span>
                  )}
                </p>
                {unreadCount > 0 && (
                  <button className="text-xs font-semibold text-primary hover:underline" onClick={markAllRead}>
                    {t("notificationsCenter.markAllRead")}
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto scrollbar-thin">
                {recentNotifications.map((item) => (
                  <button
                    key={item.id}
                    className={cn(
                      "flex w-full gap-2 rounded-lg px-2 py-2 text-start text-sm hover:bg-muted",
                      !item.read && "bg-primary/5"
                    )}
                    onClick={() => {
                      markRead(item.id);
                      setNotifOpen(false);
                      if (item.link) navigate(item.link);
                    }}
                  >
                    <span
                      className={cn(
                        "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                        item.read ? "bg-transparent" : "bg-primary"
                      )}
                    />
                    <span className="min-w-0 flex-1">
                      <span className={cn("block", !item.read && "font-semibold")}>{item.title[lang]}</span>
                      <span className="mt-0.5 block line-clamp-2 text-xs text-muted-foreground">{item.message[lang]}</span>
                      <span className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                        {relativeTime(item.createdAt, lang)}
                        {item.emailSent && (
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {t("notificationsCenter.emailSentShort")}
                          </span>
                        )}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
              <Link
                to="/notifications"
                className="mt-1 block rounded-lg px-2 py-2 text-center text-sm font-semibold text-primary hover:bg-muted"
                onClick={() => setNotifOpen(false)}
              >
                {t("notificationsCenter.viewAll")}
              </Link>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-muted"
            onClick={() => {
              setProfileOpen((v) => !v);
              setNotifOpen(false);
            }}
          >
            <Avatar name={teacher.name} size="sm" />
            <div className="hidden text-start sm:block">
              <p className="text-sm font-semibold leading-tight">{teacher.name}</p>
              <p className="text-xs leading-tight text-muted-foreground">{teacher.role}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
          {profileOpen && (
            <div className="absolute end-0 mt-2 w-56 rounded-xl border border-border bg-popover p-2 shadow-popover animate-fade-in">
              <Link
                to="/account"
                className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium hover:bg-muted"
                onClick={() => setProfileOpen(false)}
              >
                <SettingsIcon className="h-4 w-4" /> {t("nav.b2bAccount")}
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-destructive hover:bg-muted"
                onClick={() => setProfileOpen(false)}
              >
                <LogOut className="h-4 w-4" /> {t("topbar.logOut")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
