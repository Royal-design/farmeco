import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "relative overflow-hidden rounded-lg bg-foreground/8 after:absolute after:inset-0 after:-translate-x-full after:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)] after:animate-shimmer dark:bg-foreground/10",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
