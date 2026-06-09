import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
        // Legacy and status support
        success: "bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]/20",
        danger: "bg-[var(--danger-bg)] text-[var(--danger)] border-[var(--danger)]/20",
        warning: "bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]/20",
        info: "bg-[var(--info-bg)] text-[var(--info)] border-[var(--info)]/20",
        muted: "bg-neutral-200 text-neutral-600 border-neutral-300/50 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700",
        gold: "bg-gold-50 text-gold-700 border-gold-200 dark:bg-gold-950/20 dark:text-gold-400 dark:border-gold-800/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface BadgeProps extends React.ComponentProps<"span">, VariantProps<typeof badgeVariants> {
    asChild?: boolean;
    dot?: boolean;
}

function Badge({
  className,
  variant = "default",
  asChild = false,
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    >
      {dot && (
          <span style={{
              width: 5, height: 5, borderRadius: '50%',
              background: 'currentColor', marginRight: 4,
          }} />
      )}
      {children}
    </Comp>
  )
}

// Convenience StatusBadge component
export function StatusBadge({ active }: { active: boolean }) {
    return (
        <Badge variant={active ? 'success' : 'muted'} dot>
            {active ? 'Active' : 'Inactive'}
        </Badge>
    );
}

// Convenience LiveBadge component (pulsing glow for stream links)
export function LiveBadge() {
    return (
        <Badge
            variant="danger"
            className="live-pulse"
            style={{
                boxShadow: '0 0 8px var(--danger)',
                fontWeight: 700,
                letterSpacing: '0.05em',
            }}
        >
            🔴 LIVE
        </Badge>
    );
}

export { Badge, badgeVariants }
