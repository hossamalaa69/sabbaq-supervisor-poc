import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/utils/i18n";

export default function NotFound() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="text-5xl font-extrabold text-primary">{t("notFound.code")}</p>
      <p className="font-semibold">{t("notFound.message")}</p>
      <Button onClick={() => navigate("/dashboard")}>{t("notFound.backToDashboard")}</Button>
    </div>
  );
}
