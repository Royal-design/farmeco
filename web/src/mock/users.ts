import type { User } from "@/types/user"
import { avatar } from "@/mock/art"

export const currentUser: User = {
  id: "u1",
  name: "Avery Collins",
  email: "avery@pasture.com",
  phone: "+1 (555) 220-1187",
  role: "buyer",
  avatar: avatar("#2f5d3f", "#7d8f4d", "AC"),
  address: {
    line1: "18 Willow Lane",
    city: "Greenfield Valley",
    state: "Iowa",
    postalCode: "52101",
    country: "United States",
  },
  joinedAt: "2025-09-14",
  emailVerified: true,
  preferences: {
    notifications: true,
    marketing: false,
    currency: "NGN",
  },
}

export const mockUsers: User[] = [
  currentUser,
  {
    id: "u2",
    name: "Marcus Bennett",
    email: "marcus@willowcreek.com",
    phone: "+1 (555) 340-2290",
    role: "seller",
    avatar: avatar("#4d7c58", "#a8895b", "MB"),
    joinedAt: "2024-03-02",
    emailVerified: true,
    preferences: { notifications: true, marketing: true, currency: "NGN" },
  },
  {
    id: "u3",
    name: "Elena Voss",
    email: "elena@foxmeadow.com",
    phone: "+1 (555) 712-8831",
    role: "seller",
    avatar: avatar("#3f7a82", "#8a5f99", "EV"),
    joinedAt: "2023-11-19",
    emailVerified: true,
    preferences: { notifications: false, marketing: false, currency: "NGN" },
  },
  {
    id: "u4",
    name: "Jonas Keller",
    email: "jonas@bluebonnet.com",
    phone: "+1 (555) 908-4410",
    role: "seller",
    avatar: avatar("#c99a5b", "#4d7c58", "JK"),
    joinedAt: "2024-06-27",
    emailVerified: true,
    preferences: { notifications: true, marketing: true, currency: "NGN" },
  },
]
