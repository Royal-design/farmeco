import Image from "next/image"

import { cn } from "@/lib/utils"
import { initials } from "@/utils/string"

interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string
  name: string
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  className?: string
}

const sizes = {
  xs: "size-6 text-[0.6rem]",
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-12 text-base",
  xl: "size-16 text-xl",
} as const

function Avatar({
  src,
  name,
  size = "md",
  className,
  ...props
}: AvatarProps) {
  return (
    <span
      data-slot="avatar"
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand/80 to-moss/80 font-semibold text-white ring-1 ring-foreground/10",
        sizes[size],
        className
      )}
      {...props}
    >
      {src ? (
        <Image
          src={src}
          alt={name}
          width={96}
          height={96}
          className="size-full object-cover"
          loading="lazy"
        />
      ) : (
        initials(name)
      )}
    </span>
  )
}

export { Avatar }
