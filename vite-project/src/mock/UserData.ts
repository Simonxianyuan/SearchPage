
import { type User,type UserSearchInput } from '../types/User'
export function generateUserMockData(offset: number, limit: number,sortField?: string | null,
  sortOrder?: number | null,search?: UserSearchInput): User[] {
  const data: User[] = []

  const positions = ["Developer", "Manager", "Designer"]
  const locations = ["Taiwan", "USA", "Japan"]

  for (let i = offset; i < offset + limit; i++) {
    data.push({
      id: i+1,
      name: `User ${i+1}`,
      position: positions[i % positions.length],
      location: locations[i % locations.length],
      age: 20 + (i % 40),
      birthdate: "1990-01-01"
    })
  }

    // 1️⃣ Filter
  let filtered = data.filter((u) => {
    return (
      (!search?.Name || u.name.toLowerCase().includes(search.Name.toLowerCase())) &&
      (!search?.Position || u.position.includes(search.Position)) &&
      (!search?.Location || u.location.includes(search.Location)) &&
      (!search?.Age || u.age === Number(search.Age)) &&
      (!search?.Birthdate || u.birthdate === search.Birthdate)
    )
  })
  
   if (sortField) {
        filtered.sort((a, b) => {
          const valA = (a as any)[sortField]
          const valB = (b as any)[sortField]
          if (valA < valB) return sortOrder === 1 ? 1 : -1
          if (valA > valB) return sortOrder === 1 ? -1 : 1
          return 0
        })
  }
  console.log("Filtered Data:", filtered,offset,limit,sortField,sortOrder,search)
  const pageData = filtered
  return pageData
  return data
}


