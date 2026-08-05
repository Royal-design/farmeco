"use client"

import * as React from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { SearchIcon, TrashIcon, UsersIcon } from "lucide-react"
import { toast } from "sonner"

import type { User, UserRole } from "@/types/user"
import { usersService } from "@/services/users.service"
import { getErrorMessage } from "@/lib/errors"
import { formatDate } from "@/utils/format"
import { useAuthStore } from "@/store/auth-store"
import { useDebounce } from "@/hooks/use-debounce"
import { PageHeader } from "@/features/admin/components/page-header"
import { ConfirmDialog } from "@/features/admin/components/confirm-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/features/admin/components/table"
import { TableEmpty } from "@/features/admin/components/table-empty"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pagination } from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"

const roleTone: Record<UserRole, "brand" | "moss" | "neutral"> = {
  admin: "brand",
  seller: "moss",
  buyer: "neutral",
}

function AdminUsersPage() {
  const queryClient = useQueryClient()
  const currentUser = useAuthStore((state) => state.user)
  const [page, setPage] = React.useState(1)
  const [search, setSearch] = React.useState("")
  const [deleteTarget, setDeleteTarget] = React.useState<User | null>(null)
  const [deleting, setDeleting] = React.useState(false)
  const debouncedSearch = useDebounce(search, 350)

  const { data, isLoading } = useQuery({
    queryKey: ["users", "admin", page, debouncedSearch],
    queryFn: () =>
      usersService.getUsers({
        page,
        pageSize: 15,
        search: debouncedSearch || undefined,
      }),
  })

  const items = data?.items ?? []

  const updateRole = async (user: User, role: UserRole) => {
    try {
      await usersService.updateUserRole(user.id, role)
      toast.success(`${user.name} is now a ${role}`)
      queryClient.invalidateQueries({ queryKey: ["users", "admin"] })
    } catch (error) {
      toast.error("Couldn't update role", {
        description: getErrorMessage(error),
      })
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) {
      return
    }
    setDeleting(true)
    try {
      await usersService.deleteUser(deleteTarget.id)
      toast.success("User deleted")
      setDeleteTarget(null)
      queryClient.invalidateQueries({ queryKey: ["users", "admin"] })
    } catch (error) {
      toast.error("Couldn't delete user", {
        description: getErrorMessage(error),
      })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Users"
        description="Manage accounts and roles across the platform."
      />

      <div className="relative w-full sm:max-w-xs">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value)
            setPage(1)
          }}
          placeholder="Search users…"
          aria-label="Search users"
          className="pl-9"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {isLoading ? (
          <div className="flex flex-col gap-2 p-4">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-12 rounded-lg" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <TableEmpty
            icon={UsersIcon}
            title="No users found"
            description="Try a different search."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead className="hidden md:table-cell">Joined</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar src={user.avatar} name={user.name} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {user.name}
                          {currentUser?.id === user.id && (
                            <span className="ml-2 text-xs text-muted-foreground">
                              (you)
                            </span>
                          )}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {formatDate(user.joinedAt)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {currentUser?.id === user.id ? (
                      <Badge variant={roleTone[user.role]}>{user.role}</Badge>
                    ) : (
                      <Select
                        value={user.role}
                        onValueChange={(role) =>
                          updateRole(user, role as UserRole)
                        }
                        items={[
                          { value: "buyer", label: "Buyer" },
                          { value: "seller", label: "Seller" },
                          { value: "admin", label: "Admin" },
                        ]}
                      >
                        <SelectTrigger size="sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="buyer">Buyer</SelectItem>
                          <SelectItem value="seller">Seller</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {currentUser?.id !== user.id && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteTarget(user)}
                        aria-label={`Delete ${user.name}`}
                      >
                        <TrashIcon />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {data && data.totalPages > 1 && (
        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this user?"
        description={
          deleteTarget
            ? `${deleteTarget.name}'s account and data will be permanently removed.`
            : undefined
        }
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  )
}

export { AdminUsersPage }
