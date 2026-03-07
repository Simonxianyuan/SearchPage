import { generateUserMockData } from "../mock/UserData"
import { type User } from "../types/User"
export async function  fetchUsers(
  offset: number,
  limit: number,
  sortField?: string | null,
  sortOrder?: number | null,
  search?: string
): Promise<User[]> {
  return new Promise(resolve => {
    setTimeout(() => {
      const data: User[] = []
      const positions = ["Developer", "Manager", "Designer"]
      const locations = ["Taiwan", "USA", "Japan"]

      for (let i = offset; i < offset + limit; i++) {
        if (search && !`User ${i}`.includes(search)) continue
        data.push({
          id: i,
          name: `User ${i}`,
          position: positions[i % positions.length],
          location: locations[i % locations.length],
          age: 20 + (i % 40),
          birthdate: "1990-01-01"
        })
      }

      // 排序
      if (sortField) {
        data.sort((a, b) => {
          const valA = (a as any)[sortField]
          const valB = (b as any)[sortField]
          if (valA < valB) return sortOrder === 1 ? 1 : -1
          if (valA > valB) return sortOrder === 1 ? -1 : 1
          return 0
        })
      }

      resolve(data)
    }, 200)
  })
}