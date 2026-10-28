import { useState } from "react";
import { Bell, Globe, Moon, Shield, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Tabs } from "@/components/ui/Tabs";
import { useAuthStore, useNotificationsStore } from "@/store";
import { toast } from "sonner";
import { useTranslation } from "@/utils/i18n";
import { localizePersonName } from "@/utils/contentTranslations";

type TabValue = "profile" | "notifications" | "preferences" | "security";

export default function SettingsPage() {
  const teacher = useAuthStore((s) => s.teacher);
  const { t, lang } = useTranslation();
  const [tab, setTab] = useState<TabValue>("profile");
  const [name, setName] = useState(teacher.name);
  const [email, setEmail] = useState(teacher.email);
  const [phone, setPhone] = useState(teacher.phone);
  const storedEmailEnabled = useNotificationsStore((s) => s.emailEnabled);
  const storedImportantOnly = useNotificationsStore((s) => s.importantEmailOnly);
  const setEmailPreferences = useNotificationsStore((s) => s.setEmailPreferences);
  const [emailNotifs, setEmailNotifs] = useState(storedEmailEnabled);
  const [importantEmailOnly, setImportantEmailOnly] = useState(storedImportantOnly);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Tabs
        value={tab}
        onChange={(v) => setTab(v as TabValue)}
        tabs={[
          { value: "profile", label: t("settings.tabs.profile"), icon: <User className="h-4 w-4" /> },
          { value: "notifications", label: t("settings.tabs.notifications"), icon: <Bell className="h-4 w-4" /> },
          { value: "preferences", label: t("settings.tabs.preferences"), icon: <Globe className="h-4 w-4" /> },
          { value: "security", label: t("settings.tabs.security"), icon: <Shield className="h-4 w-4" /> },
        ]}
      />

      {tab === "profile" && (
        <Card>
          <CardHeader>
            <CardTitle>{t("settings.profile.title")}</CardTitle>
            <CardDescription>{t("settings.profile.desc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>{t("settings.profile.fullName")}</Label>
              <Input
                className="mt-1.5"
                value={localizePersonName(name, lang)}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Label>{t("settings.profile.email")}</Label>
              <Input className="mt-1.5" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label>{t("settings.profile.phone")}</Label>
              <Input className="mt-1.5" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <Button onClick={() => toast.success(t("settings.profile.toastUpdated"))}>{t("settings.profile.saveChanges")}</Button>
          </CardContent>
        </Card>
      )}

      {tab === "notifications" && (
        <Card>
          <CardHeader>
            <CardTitle>{t("settings.notifications.title")}</CardTitle>
            <CardDescription>{t("settings.notifications.desc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ToggleRow label={t("settings.notifications.email")} checked={emailNotifs} onChange={setEmailNotifs} />
            {emailNotifs && (
              <ToggleRow label={t("settings.notifications.importantEmailOnly")} checked={importantEmailOnly} onChange={setImportantEmailOnly} />
            )}
            <ToggleRow label={t("settings.notifications.sms")} checked={smsNotifs} onChange={setSmsNotifs} />
            <ToggleRow label={t("settings.notifications.weeklyDigest")} checked={weeklyDigest} onChange={setWeeklyDigest} />
            <Button
              onClick={() => {
                setEmailPreferences(emailNotifs, importantEmailOnly);
                toast.success(t("settings.notifications.toastSaved"));
              }}
            >{t("settings.notifications.savePreferences")}</Button>
          </CardContent>
        </Card>
      )}

      {tab === "preferences" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="h-4 w-4" /> {t("settings.preferences.title")}
            </CardTitle>
            <CardDescription>{t("settings.preferences.desc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>{t("settings.preferences.language", { lang: lang === "ar" ? t("language.arabic") : t("language.english") })}</p>
            <p>{t("settings.preferences.timezone")}</p>
            <p>{t("settings.preferences.dateFormat")}</p>
          </CardContent>
        </Card>
      )}

      {tab === "security" && (
        <Card>
          <CardHeader>
            <CardTitle>{t("settings.security.title")}</CardTitle>
            <CardDescription>{t("settings.security.desc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>{t("settings.security.currentPassword")}</Label>
              <Input className="mt-1.5" type="password" placeholder="••••••••" />
            </div>
            <div>
              <Label>{t("settings.security.newPassword")}</Label>
              <Input className="mt-1.5" type="password" placeholder="••••••••" />
            </div>
            <Button onClick={() => toast.success(t("settings.security.toastUpdated"))}>{t("settings.security.updatePassword")}</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-border px-4 py-3">
      <span className="text-sm font-medium">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${checked ? "bg-primary" : "bg-muted"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </label>
  );
}
