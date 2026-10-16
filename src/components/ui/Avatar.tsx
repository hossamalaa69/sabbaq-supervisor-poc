import { cn } from "@/utils/cn";
import { initials } from "@/utils/format";

export function Avatar({
  name,
  color,
  size = "md",
  className,
}: {
  name: string;
  color?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "h-7 w-7 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-lg",
  }[size];

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-bold text-white",
        sizeClasses,
        className
      )}
      style={{ backgroundColor: color ?? "#4C44E4" }}
    >
      {initials(name)}
    </div>
  );
}
