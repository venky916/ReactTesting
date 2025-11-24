// src/components/UserManagement.tsx
import { useState, useEffect } from "react";
import { userService } from "../services/userService";
import type {User} from "../services/userService"
import { AddUserForm } from "./AddUserForm";
import { UsersList } from "./UsersList";

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    const data = await userService.getUsers();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleUserAdded = () => {
    loadUsers();
  };

  const handleUserDeleted = (id: string) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  if (loading) {
    return <div className="p-6">Loading users...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 border">
      <h1 className="text-3xl font-bold">User Management System</h1>
      <AddUserForm onUserAdded={handleUserAdded} />
      <UsersList users={users} onDelete={handleUserDeleted} />
    </div>
  );
}

// 🎓 INTEGRATION TESTING TARGETS:
// 1. Add user → form submits → user appears in list
// 2. Delete user → user removed from list
// 3. Form clears after successful add
// 4. Multiple adds work correctly
// 5. Loading states work
// 6. Parent-child communication works
