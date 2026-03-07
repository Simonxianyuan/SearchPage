
import { type User } from '../types/User'
export interface MockData {
  offset: number
  limit: number
  data: User[]
}

export function generateUserMockData(offset: number, limit: number): User[] {
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

  return data
}


