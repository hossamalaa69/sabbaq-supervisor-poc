import { Outlet, Link } from "react-router-dom";
import { useTranslation } from "@/utils/i18n";

export function AuthLayout() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-sm font-extrabold text-white">
            S
          </div>
          <div className="leading-tight">
            <p className="text-sm font-extrabold">{t("nav.brandName")}</p>
            <p className="text-[11px] font-medium text-muted-foreground">{t("nav.brandTagline")}</p>
          </div>
        </Link>
      </header>
      <main className="flex flex-1 items-start justify-center px-4 py-10 sm:py-14">
        <div className="w-full max-w-2xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
