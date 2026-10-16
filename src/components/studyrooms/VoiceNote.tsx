import { useEffect, useRef, useState } from "react";
import { Mic, Square, X } from "lucide-react";
import { toast } from "sonner";
import type { StudyRoomVoiceNote } from "@/types";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/utils/i18n";

const MAX_SECONDS = 120;

function formatDuration(seconds: number) {
  const safe = Math.max(0, Math.round(seconds));
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, "0")}`;
}

export function VoiceNoteRecorder({
  onSend,
}: {
  onSend: (voiceNote: StudyRoomVoiceNote) => void;
}) {
  const { t } = useTranslation();
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startedAtRef = useRef(0);
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (!recording) return;
    const timer = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAtRef.current) / 1000);
      setSeconds(elapsed);
      if (elapsed >= MAX_SECONDS) recorderRef.current?.stop();
    }, 250);
    return () => window.clearInterval(timer);
  }, [recording]);

  useEffect(
    () => () => {
      cancelledRef.current = true;
      if (recorderRef.current?.state === "recording") recorderRef.current.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
    },
    []
  );

  async function start() {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      toast.error(t("voiceNotes.unsupported"));
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      streamRef.current = stream;
      recorderRef.current = recorder;
      chunksRef.current = [];
      cancelledRef.current = false;
      startedAtRef.current = Date.now();

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        setRecording(false);
        const durationSeconds = Math.max(
          1,
          Math.min(MAX_SECONDS, Math.round((Date.now() - startedAtRef.current) / 1000))
        );
        setSeconds(0);
        if (cancelledRef.current || chunksRef.current.length === 0) return;

        const mimeType = recorder.mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const reader = new FileReader();
        reader.onloadend = () => {
          onSend({ src: String(reader.result), durationSeconds, mimeType });
          toast.success(t("voiceNotes.sent"));
        };
        reader.readAsDataURL(blob);
      };

      recorder.start();
      setSeconds(0);
      setRecording(true);
    } catch {
      toast.error(t("voiceNotes.permissionDenied"));
    }
  }

  function stop(cancel = false) {
    cancelledRef.current = cancel;
    recorderRef.current?.stop();
  }

  if (recording) {
    return (
      <div className="flex shrink-0 items-center gap-1 rounded-xl border border-destructive/30 bg-destructive/10 px-2 py-1">
        <span className="h-2 w-2 animate-pulse rounded-full bg-destructive" />
        <span className="min-w-10 text-xs font-bold tabular-nums text-destructive">
          {formatDuration(seconds)}
        </span>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={() => stop(true)}
          aria-label={t("voiceNotes.cancel")}
          title={t("voiceNotes.cancel")}
        >
          <X className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          className="h-8 w-8"
          onClick={() => stop()}
          aria-label={t("voiceNotes.stopAndSend")}
          title={t("voiceNotes.stopAndSend")}
        >
          <Square className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      size="icon"
      variant="outline"
      onClick={start}
      aria-label={t("voiceNotes.record")}
      title={t("voiceNotes.record")}
    >
      <Mic className="h-4 w-4" />
    </Button>
  );
}

export function VoiceNotePlayer({
  voiceNote,
  inverted,
}: {
  voiceNote: StudyRoomVoiceNote;
  inverted?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div className="min-w-[14rem] space-y-1">
      <p className={inverted ? "text-xs text-primary-foreground/80" : "text-xs text-muted-foreground"}>
        <Mic className="me-1 inline h-3.5 w-3.5" />
        {t("voiceNotes.label", { duration: formatDuration(voiceNote.durationSeconds) })}
      </p>
      <audio controls preload="metadata" className="h-9 w-full max-w-xs" src={voiceNote.src}>
        <source src={voiceNote.src} type={voiceNote.mimeType} />
      </audio>
    </div>
  );
}
