import * as React from "react";
import { cn } from "@/lib/utils";
import { DevpilotIcon } from "@/components/icons/devpilot-icon";

export function BrandMark({ className }: { className?: string }) {
  return (
    <div className={cn(`flex items-center gap-2.5 font-semibold tracking-tight`, className)}>
      <DevpilotIcon className="size-8 rounded-[10px]" />
      <span className="font-heading text-[1.05rem] leading-none">
        AskMYRepo
      </span>
    </div>
  );
}
