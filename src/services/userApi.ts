export interface User {
    id: number;
    name: string;
    email: string;
    role: string
}

export async function fetchUsers(): Promise<User[]> {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');

    if (!response.ok) {
        throw new Error("Failed to fetch users")
    }

    const data = await response.json()

    return data.slice(0, 5).map((user: any) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: "User"
    }))
}

export async function fetchUserById(id: number): Promise<User> {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);

    if (!response.ok) {
        throw new Error(`User with id ${id} not found `)
    }

    const user = await response.json();
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: "User"
    }
}