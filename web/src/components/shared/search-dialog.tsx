"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { SearchIcon } from "lucide-react"

import { useUIStore } from "@/store/ui-store"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"

const popularSearches = [
  "Boer goat",
  "Pullets",
  "Holstein",
  "Berkshire",
  "Layer feed",
  "Broiler chicks",
]

function SearchDialog() {
  const open = useUIStore((state) => state.searchOpen)
  const closeSearch = useUIStore((state) => state.closeSearch)
  const router = useRouter()
  const [term, setTerm] = React.useState("")

  const submit = (value: string) => {
    const query = value.trim()
    closeSearch()
    router.push(query ? `/shop?search=${encodeURIComponent(query)}` : "/shop")
    setTerm("")
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !next && closeSearch()}>
      <DialogContent className="max-w-lg gap-4 p-5">
        <DialogHeader>
          <DialogTitle className="text-lg">Search the marketplace</DialogTitle>
          <DialogDescription>
            Find cattle, poultry, feed and more from verified farms.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            submit(term)
          }}
        >
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <SearchIcon className="size-4 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
              autoFocus
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder="Try 'Boer goat' or 'pullets'…"
              aria-label="Search marketplace"
              className="h-11 text-base"
            />
          </InputGroup>
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Popular:</span>
          {popularSearches.map((search) => (
            <button
              key={search}
              type="button"
              onClick={() => submit(search)}
              className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-brand/30 hover:bg-brand/5 hover:text-brand"
            >
              {search}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { SearchDialog }
