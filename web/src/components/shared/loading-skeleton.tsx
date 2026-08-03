import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface ProductGridSkeletonProps {
  count?: number
  className?: string
}

function ProductGridSkeleton({
  count = 8,
  className,
}: ProductGridSkeletonProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className
      )}
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-border bg-card p-0"
        >
          <Skeleton className="aspect-[5/4] w-full rounded-none" />
          <div className="space-y-3 p-4">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
            <div className="flex items-center justify-between pt-1">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="size-9 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export { ProductGridSkeleton }
