import type { Coupon } from "@/types/order"

export const mockCoupons: Coupon[] = [
  {
    id: "cp1",
    code: "WELCOME15",
    type: "percent",
    value: 15,
    minOrder: 100,
    description: "15% off your first order over $100",
    expiresAt: "2027-01-01",
  },
  {
    id: "cp2",
    code: "FRESH10",
    type: "percent",
    value: 10,
    minOrder: 50,
    description: "10% off eggs, dairy and fresh produce",
    expiresAt: "2026-12-01",
  },
  {
    id: "cp3",
    code: "FARM20",
    type: "fixed",
    value: 20,
    minOrder: 200,
    description: "$20 off any order over $200",
    expiresAt: "2026-11-15",
  },
]
