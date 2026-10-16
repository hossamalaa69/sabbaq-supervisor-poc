import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { useAuthStore } from "@/store";
import { toast } from "sonner";
import { useTranslation } from "@/utils/i18n";

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const { t } = useTranslation();
  const [email, setEmail] = useState("ahmed@example.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    login();
    toast.success(t("auth.login.toastWelcome", { name: "Ahmed" }));
    navigate("/dashboard");
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-extrabold">{t("auth.login.welcomeBack")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("auth.login.subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">{t("auth.login.email")}</Label>
          <div className="mt-1.5">
            <Input
              id="email"
              type="email"
              icon={<Mail className="h-4 w-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("auth.login.emailPlaceholder")}
              required
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t("auth.login.password")}</Label>
            <span className="text-xs font-medium text-primary">{t("auth.login.forgotPassword")}</span>
          </div>
          <div className="relative mt-1.5">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              icon={<Lock className="h-4 w-4" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("auth.login.passwordPlaceholder")}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <Button type="submit" variant="solid" className="w-full">
          {t("auth.login.logIn")}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t("auth.login.noAccount")}{" "}
        <Link to="/signup" className="font-semibold text-primary">
          {t("auth.login.createAccount")}
        </Link>
      </p>
    </div>
  );
}
