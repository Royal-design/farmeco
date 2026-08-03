import type { User } from "@/types/user"
import type { Paginated, QueryParams } from "@/types/api"
import { currentUser, mockUsers } from "@/mock/users"
import { mockRequest, paginateData } from "@/services/request"

export interface UpdateProfileInput {
  name?: string
  phone?: string
  address?: User["address"]
  preferences?: Partial<User["preferences"]>
}

export interface ChangePasswordInput {
  currentPassword: string
  newPassword: string
}

export const usersService = {
  async getMe(): Promise<User> {
    return mockRequest(currentUser, 200)
  },

  async updateMe(input: UpdateProfileInput): Promise<User> {
    return mockRequest(
      { ...currentUser, ...input, preferences: { ...currentUser.preferences, ...input.preferences } },
      500
    )
  },

  async changePassword(input: ChangePasswordInput): Promise<void> {
    await mockRequest(undefined, 500)
    if (input.currentPassword.length < 6) {
      throw new Error("Current password is incorrect.")
    }
  },

  async updateAvatar(avatar: string): Promise<User> {
    return mockRequest({ ...currentUser, avatar }, 300)
  },

  async getUsers(params?: QueryParams): Promise<Paginated<User>> {
    return mockRequest(paginateData(mockUsers, params))
  },

  async getUser(id: string): Promise<User | null> {
    const user = mockUsers.find((u) => u.id === id) ?? null
    return mockRequest(user, 200)
  },
}
