export interface User {
    id: string,
    name: string,
    email: string,
    role: string
}

let users: User[] = []
let nextId = 1;

export const userService = {
    async getUsers(): Promise<User[]> {
        await new Promise(resolve => setTimeout(resolve, 100))
        return [...users]
    },

    async getUserByID(id: string): Promise<User | null> {
        await new Promise(resolve => setTimeout(resolve, 100))
        return users.find(user => user.id === id) || null
    },

    async addUser(userData: Omit<User, "id">): Promise<User> {
        await new Promise(resolve => setTimeout(resolve, 100))
        const newUser: User = {
            id: String(nextId++),
            ...userData
        }

        users.push(newUser)
        return newUser
    },

    async deleteUser(id: string): Promise<boolean> {
        await new Promise(resolve => setTimeout(resolve, 100))
        const index = users.findIndex(user => user.id === id)
        if (index !== -1) {
            users.splice(index, 1)
            return true
        }
        return false
    },

    clearUsers() {
        users = []
        nextId = 1
    }
}
