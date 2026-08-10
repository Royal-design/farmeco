"use client"

import * as React from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { PencilIcon, PlusIcon, TicketIcon, TrashIcon } from "lucide-react"
import { toast } from "sonner"

import type { Coupon } from "@/types/order"
import { couponsService } from "@/services/coupons.service"
import { getErrorMessage } from "@/lib/errors"
import { formatDate } from "@/utils/format"
import { PageHeader } from "@/features/admin/components/page-header"
import { BulkImport } from "@/features/admin/components/bulk-import"
import { CouponForm } from "@/features/admin/components/coupon-form"
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

function AdminCouponsPage() {
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Coupon | null>(null)
  const [deleteTarget, setDeleteTarget] = React.useState<Coupon | null>(null)
  const [deleting, setDeleting] = React.useState(false)

  const { data: coupons, isLoading } = useQuery({
    queryKey: ["coupons", "admin"],
    queryFn: couponsService.getCoupons,
  })

  const openCreate = () => {
    setEditing(null)
    setDialogOpen(true)
  }

  const openEdit = (coupon: Coupon) => {
    setEditing(coupon)
    setDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteTarget) {
      return
    }
    setDeleting(true)
    try {
      await couponsService.deleteCoupon(deleteTarget.id)
      toast.success("Coupon deleted")
      setDeleteTarget(null)
      queryClient.invalidateQueries({ queryKey: ["coupons"] })
    } catch (error) {
      toast.error("Couldn't delete coupon", {
        description: getErrorMessage(error),
      })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Coupons"
        description="Discount codes buyers can apply at checkout."
        actions={
          <>
            <BulkImport entity="coupons" />
            <Button onClick={openCreate}>
              <PlusIcon />
              Add coupon
            </Button>
          </>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {isLoading ? (
          <div className="flex flex-col gap-2 p-4">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-12 rounded-lg" />
            ))}
          </div>
        ) : !coupons?.length ? (
          <TableEmpty
            icon={TicketIcon}
            title="No coupons yet"
            description="Create a discount code to drive more sales."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="hidden md:table-cell">Min order</TableHead>
                <TableHead className="hidden lg:table-cell">Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell>
                    <span className="font-mono text-sm font-semibold">
                      {coupon.code}
                    </span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="text-sm capitalize text-muted-foreground">
                      {coupon.type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium tabular-nums">
                      {coupon.type === "percent" ? `${coupon.value}%` : `₦${coupon.value.toLocaleString()}`}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-sm text-muted-foreground tabular-nums">
                      ₦{coupon.minOrder.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {coupon.expiresAt ? formatDate(coupon.expiresAt) : "Never"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(coupon.expiresAt) > new Date() ? (
                      <Badge variant="success">Active</Badge>
                    ) : (
                      <Badge variant="neutral">Expired</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEdit(coupon)}
                        aria-label={`Edit ${coupon.code}`}
                      >
                        <PencilIcon />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteTarget(coupon)}
                        aria-label={`Delete ${coupon.code}`}
                      >
                        <TrashIcon />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit coupon" : "Add coupon"}</DialogTitle>
          </DialogHeader>
          <CouponForm
            initial={editing}
            onSuccess={() => {
              setDialogOpen(false)
              queryClient.invalidateQueries({ queryKey: ["coupons"] })
            }}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this coupon?"
        description={
          deleteTarget ? `"${deleteTarget.code}" will no longer be valid.` : undefined
        }
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  )
}

export { AdminCouponsPage }
