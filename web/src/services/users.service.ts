import type { Paginated, QueryParams } from "@/types/api"
import { toPaginated } from "@/types/api"
import type { User } from "@/types/user"
import { api } from "@/lib/http"
import { mapUser, type RawUser } from "@/services/mappers"

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

export interface UsersQuery extends QueryParams {
  search?: string
}

export const usersService = {
  async getMe(): Promise<User> {
    const { data } = await api.get<RawUser>("/users/me")
    return mapUser(data)
  },

  async updateMe(input: UpdateProfileInput): Promise<User> {
    const { data } = await api.put<RawUser>("/users/me", {
      name: input.name,
      phone: input.phone ?? null,
      address: input.address ?? undefined,
      preferences: input.preferences ?? undefined,
    })
    return mapUser(data)
  },

  async changePassword(input: ChangePasswordInput): Promise<void> {
    await api.post("/auth/change-password", {
      current_password: input.currentPassword,
      new_password: input.newPassword,
    })
  },

  async updateAvatar(file: File): Promise<User> {
    const formData = new FormData()
    formData.append("avatar", file)
    const { data } = await api.upload<RawUser>("/users/me/avatar", formData)
    return mapUser(data)
  },

  async getUsers(params?: UsersQuery): Promise<Paginated<User>> {
    const { data, meta } = await api.get<RawUser[]>("/users", {
      search: params?.search,
      page: params?.page,
      page_size: params?.pageSize,
    })
    return toPaginated(data.map(mapUser), meta)
  },

  async getUser(id: string): Promise<User | null> {
    const { data } = await api.get<RawUser[]>("/users", { search: "", page_size: 100 })
    const user = data.find((candidate) => candidate.id === id)
    return user ? mapUser(user) : null
  },

  async updateUserRole(id: string, role: User["role"]): Promise<User> {
    const { data } = await api.patch<RawUser>(`/users/${id}/role`, { role })
    return mapUser(data)
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`)
  },
}
