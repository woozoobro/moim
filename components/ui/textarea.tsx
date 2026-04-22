import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-20 w-full border-2 border-foreground bg-background px-3 py-2 text-base font-medium transition-all outline-none placeholder:text-muted-foreground placeholder:font-normal focus-visible:shadow-[3px_3px_0_0_var(--foreground)] focus-visible:-translate-x-[1px] focus-visible:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-4 aria-invalid:ring-destructive/20 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
