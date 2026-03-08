import { generateUserMockData } from "../mock/UserData"
import { type User,type UserSearchInput } from "../types/User"
export async function  fetchUsers(
  offset: number,
  limit: number,
  sortField?: string | null,
  sortOrder?: number | null,
  SearchInput?: UserSearchInput
): Promise<User[]> {
  return new Promise(resolve => {
    setTimeout(() => {
      const data = generateUserMockData(offset, limit,sortField,sortOrder,SearchInput)
      resolve(data)
    }, 200)
  })
}
export async function addUser(user: User): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("User added:", user)
      resolve()
    }, 200)
  })
}
export async function updateUser(user: User): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("User updated:", user)
      resolve()
    }, 200)
  })
}
export async function deleteUser(userId: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("User deleted with ID:", userId)
      resolve()
    }, 200)
  })
}


