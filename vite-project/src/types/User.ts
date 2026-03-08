export interface User {
    id?:number,
    name:string,
    position?:string,
    location?:string,
    age:number,
    birthdate:string
}
export interface UserSearchInput {
    Name?:string,
    Position?:string,
    Location?:string,
    Age?:number,
    Birthdate?:string
}