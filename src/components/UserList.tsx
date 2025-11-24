import { useState, useEffect } from "react";
import { fetchUsers } from "../services/userApi";
import type { User } from "../services/userApi";
import { Button } from "./Button";
import { useNavigate } from "react-router-dom";

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleViewDetails = (userId: number) => {
    navigate(`/users/${userId}`);
  };

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchUsers();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center" role="status">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="p-6 bg-red-50 border border-red-200 rounded-lg"
        role="alert"
      >
        <h3 className="text-red-800 font-bold mb-2">Error!</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>No users found</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Users List</h2>
      <div className="space-y-4">
        {users.map((user) => (
          <div
            data-testid="user-card"
            key={user.id}
            className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-bold text-lg">{user.name}</h3>
            <p className="text-gray-600">{user.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {user.role}
            </span>
            <Button
              onClick={() => handleViewDetails(user.id)}
              label="View Details"
              variant="primary"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// 🎓 WHAT WE'LL TEST:
// 1. Does it show "Loading users..." initially?
// 2. Does it display users after successful fetch?
// 3. Does it show error message when fetch fails?
// 4. Does it show "No users found" when array is empty?
