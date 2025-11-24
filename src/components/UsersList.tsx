// src/components/UsersList.tsx
import { userService } from "../services/userService";
import type { User } from "../services/userService";
interface UsersListProps {
  users: User[];
  onDelete: (id: string) => void;
}

export function UsersList({ users, onDelete }: UsersListProps) {
  const handleDelete = async (id: string) => {
    await userService.deleteUser(id);
    onDelete(id);
  };

  if (users.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No users found. Add one above!
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Users List</h2>
      <div className="space-y-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div>
              <h3 className="font-semibold">{user.name}</h3>
              <p className="text-sm text-gray-600">{user.email}</p>
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                {user.role}
              </span>
            </div>
            <button
              onClick={() => handleDelete(user.id)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
