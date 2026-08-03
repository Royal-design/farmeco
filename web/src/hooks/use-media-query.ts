"use client"

import * as React from "react"

export function useMediaQuery(query: string) {
  const subscribe = React.useCallback((onStoreChange: () => void) => {
    const media = window.matchMedia(query)
    media.addEventListener("change", onStoreChange)
    return () => media.removeEventListener("change", onStoreChange)
  }, [query])

  const getSnapshot = React.useCallback(() => window.matchMedia(query).matches, [query])

  return React.useSyncExternalStore(subscribe, getSnapshot, () => false)
}

export function useIsMobile() {
  return useMediaQuery("(max-width: 767px)")
}

export function useIsDesktop() {
  return useMediaQuery("(min-width: 1024px)")
}
