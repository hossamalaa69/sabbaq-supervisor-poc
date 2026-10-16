import { useState } from "react";
import { Sparkles, X, RotateCcw, UserPlus, FileQuestion, CheckCircle2, Video, Database } from "lucide-react";
import { useDemoStore } from "@/store";
import { Button } from "@/components/ui";
import { useTranslation } from "@/utils/i18n";

export function DemoPanel() {
  const { t } = useTranslation();
  const { isPanelOpen, togglePanel, resetDemo, simulateB2BApproval, addSampleStudent, generateSampleQuestion, simulateMeetingCreation } =
    useDemoStore();
  const [confirmingReset, setConfirmingReset] = useState(false);

  return (
    <div className="fixed bottom-4 start-4 z-40">
      {isPanelOpen && (
        <div className="mb-3 w-72 rounded-xl border border-border bg-popover p-3 shadow-popover animate-fade-in">
          <div className="mb-2 flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-sm font-bold">
              <Database className="h-4 w-4 text-primary" /> {t("demo.panelTitle")}
            </p>
            <button onClick={togglePanel} className="rounded-lg p-1 text-muted-foreground hover:bg-muted">
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="mb-3 text-xs text-muted-foreground">
            {t("demo.panelDesc")}
          </p>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={addSampleStudent}
            >
              <UserPlus className="h-4 w-4" /> {t("demo.addSampleStudent")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={generateSampleQuestion}
            >
              <FileQuestion className="h-4 w-4" /> {t("demo.generateSampleQuestion")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={simulateB2BApproval}
            >
              <CheckCircle2 className="h-4 w-4" /> {t("demo.simulateB2BApproval")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={simulateMeetingCreation}
            >
              <Video className="h-4 w-4" /> {t("demo.simulateMeetingCreation")}
            </Button>
            {!confirmingReset ? (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                onClick={() => setConfirmingReset(true)}
              >
                <RotateCcw className="h-4 w-4" /> {t("demo.resetDemo")}
              </Button>
            ) : (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-2">
                <p className="mb-2 text-xs font-medium text-destructive">{t("demo.confirmResetQuestion")}</p>
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      resetDemo();
                      setConfirmingReset(false);
                    }}
                  >
                    {t("demo.confirmButton")}
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => setConfirmingReset(false)}>
                    {t("demo.cancelButton")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <button
        onClick={togglePanel}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-foreground text-background shadow-popover transition-transform hover:scale-105"
        aria-label={t("demo.toggleAria")}
        title={t("demo.title")}
      >
        <Sparkles className="h-5 w-5" />
      </button>
    </div>
  );
}
