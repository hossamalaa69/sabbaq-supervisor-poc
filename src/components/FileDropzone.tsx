import { useRef, useState } from "react";
import { UploadCloud, FileText, X, CheckCircle2 } from "lucide-react";
import { cn } from "@/utils/cn";

export interface FakeUploadedFile {
  id: string;
  name: string;
  sizeKb: number;
}

/**
 * Simulated file upload control. Reads the selected file's name/size only —
 * nothing is ever transmitted anywhere, matching the prototype's "no real backend" constraint.
 */
export function FileDropzone({
  accept,
  multiple = true,
  label = "Click to upload or drag and drop",
  hint,
  onFilesAdded,
}: {
  accept?: string;
  multiple?: boolean;
  label?: string;
  hint?: string;
  onFilesAdded: (files: FakeUploadedFile[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const files: FakeUploadedFile[] = Array.from(fileList).map((f) => ({
      id: `${f.name}-${f.size}-${Date.now()}`,
      name: f.name,
      sizeKb: Math.max(1, Math.round(f.size / 1024)),
    }));
    onFilesAdded(files);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      className={cn(
        "flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors",
        dragOver ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"
      )}
    >
      <UploadCloud className="h-7 w-7 text-primary" />
      <p className="text-sm font-semibold">{label}</p>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}

export function UploadedFileRow({
  file,
  onRemove,
}: {
  file: FakeUploadedFile;
  onRemove?: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border px-3 py-2 text-sm">
      <FileText className="h-4 w-4 shrink-0 text-primary" />
      <span className="flex-1 truncate font-medium">{file.name}</span>
      <span className="text-xs text-muted-foreground">{file.sizeKb} KB</span>
      <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
      {onRemove && (
        <button onClick={onRemove} className="text-muted-foreground hover:text-destructive">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
