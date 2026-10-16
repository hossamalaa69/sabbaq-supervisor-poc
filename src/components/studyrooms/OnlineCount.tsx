import { useEffect, useState } from "react";
import { useTranslation } from "@/utils/i18n";
import { cn } from "@/utils/cn";

function seed(value: string) {
  return value.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
}

export function getOnlineCount(id: string, total: number, now = Date.now()) {
  if (total <= 0) return 0;
  const bucket = Math.floor(now / 30000);
  const ratio = 0.3 + (((seed(id) + bucket * 17) % 45) / 100);
  return Math.max(1, Math.min(total, Math.round(total * ratio)));
}

export function OnlineCount({
  id,
  total,
  className,
}: {
  id: string;
  total: number;
  className?: string;
}) {
  const { t } = useTranslation();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  const count = getOnlineCount(id, total, now);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success",
        className
      )}
      title={t("onlineStatus.updatesEvery30Seconds")}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-50" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
      </span>
      {t("onlineStatus.onlineNow", { count, total })}
    </span>
  );
}
