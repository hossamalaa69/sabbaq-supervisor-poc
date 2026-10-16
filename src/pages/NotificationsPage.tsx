import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck, Mail, MailX, Circle, CircleCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { EmptyState } from "@/components/ui/EmptyState";
import { useNotificationsStore } from "@/store";
import type { PortalNotificationCategory } from "@/types";
import { relativeTime } from "@/utils/format";
import { useTranslation } from "@/utils/i18n";
import { cn } from "@/utils/cn";

type Filter = "all" | "unread" | "read";

export default function NotificationsPage() {
  const { t, lang } = useTranslation();
  const navigate = useNavigate();
  const { notifications, markRead, markUnread, markAllRead } = useNotificationsStore();
  const [filter, setFilter] = useState<Filter>("all");
  const [category, setCategory] = useState<"all" | PortalNotificationCategory>("all");
  const unreadCount = notifications.filter((item) => !item.read).length;

  const visible = useMemo(
    () =>
      notifications.filter((item) => {
        if (filter === "unread" && item.read) return false;
        if (filter === "read" && !item.read) return false;
        if (category !== "all" && item.category !== category) return false;
        return true;
      }),
    [notifications, filter, category]
  );

  const categories: Array<"all" | PortalNotificationCategory> = [
    "all",
    "platform",
    "student",
    "administration",
    "request",
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{t("notificationsCenter.subtitle")}</p>
          <p className="mt-1 text-sm font-semibold">
            {t("notificationsCenter.unreadCount", { count: unreadCount })}
          </p>
        </div>
        <Button variant="outline" disabled={unreadCount === 0} onClick={markAllRead}>
          <CheckCheck className="h-4 w-4" />
          {t("notificationsCenter.markAllRead")}
        </Button>
      </div>

      <Tabs
        value={filter}
        onChange={(value) => setFilter(value as Filter)}
        className="w-fit max-w-full"
        tabs={[
          { value: "all", label: t("notificationsCenter.filters.all"), count: notifications.length },
          { value: "unread", label: t("notificationsCenter.filters.unread"), count: unreadCount },
          {
            value: "read",
            label: t("notificationsCenter.filters.read"),
            count: notifications.length - unreadCount,
          },
        ]}
      />

      <div className="flex flex-wrap gap-2">
        {categories.map((item) => (
          <button
            key={item}
            onClick={() => setCategory(item)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
              category === item
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary hover:text-primary"
            )}
          >
            {t(`notificationsCenter.categories.${item}`)}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={<Bell className="h-8 w-8" />}
          title={t("notificationsCenter.emptyTitle")}
          description={t("notificationsCenter.emptyDesc")}
        />
      ) : (
        <div className="space-y-3">
          {visible.map((item) => (
            <Card key={item.id} className={cn(!item.read && "border-primary/40 bg-primary/5")}>
              <CardContent className="flex flex-col gap-3 pt-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 gap-3">
                  <span
                    className={cn(
                      "mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full",
                      item.read ? "bg-muted-foreground/30" : "bg-primary"
                    )}
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold">{item.title[lang]}</p>
                      <Badge variant={item.read ? "outline" : "default"}>
                        {item.read ? t("notificationsCenter.read") : t("notificationsCenter.unread")}
                      </Badge>
                      <Badge variant="secondary">{t(`notificationsCenter.categories.${item.category}`)}</Badge>
                      {item.important && <Badge variant="warning">{t("notificationsCenter.important")}</Badge>}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{item.message[lang]}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span>{relativeTime(item.createdAt, lang)}</span>
                      <span className="flex items-center gap-1">
                        <Bell className="h-3.5 w-3.5" /> {t("notificationsCenter.portalDelivered")}
                      </span>
                      <span className="flex items-center gap-1">
                        {item.emailSent ? <Mail className="h-3.5 w-3.5" /> : <MailX className="h-3.5 w-3.5" />}
                        {item.emailSent
                          ? t("notificationsCenter.emailSent")
                          : t("notificationsCenter.emailNotSent")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  {item.link && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        markRead(item.id);
                        navigate(item.link!);
                      }}
                    >
                      {t("notificationsCenter.open")}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => (item.read ? markUnread(item.id) : markRead(item.id))}
                  >
                    {item.read ? <Circle className="h-4 w-4" /> : <CircleCheck className="h-4 w-4" />}
                    {item.read ? t("notificationsCenter.markUnread") : t("notificationsCenter.markRead")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
