import { useState, useEffect } from "react";
import { fetchUserById } from "../services/userApi";
import type { User } from "../services/userApi";

interface UserDetailsProps {
  userId: number;
}

export function UserDetails({ userId }: UserDetailsProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchUserById(userId);
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [userId]);

  if (loading) {
    return (
      <div className="p-6 text-center" role="status">
        <p>Loading user details...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div
        className="p-6 bg-red-50 border border-red-200 rounded-lg"
        role="alert"
      >
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p>User not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border rounded-lg shadow-md max-w-md">
      <h2 className="text-2xl font-bold mb-4">User Details</h2>
      <div className="space-y-2">
        <div>
          <span className="font-semibold">ID:</span>
          <span className="ml-2">{user.id}</span>
        </div>
        <div>
          <span className="font-semibold">Name:</span>
          <span className="ml-2">{user.name}</span>
        </div>
        <div>
          <span className="font-semibold">Email:</span>
          <span className="ml-2">{user.email}</span>
        </div>
        <div>
          <span className="font-semibold">Role:</span>
          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded">
            {user.role}
          </span>
        </div>
      </div>
    </div>
  );
}

// 🎓 SPECIAL TESTING SCENARIO:
// This component takes a PROP (userId) and re-fetches when it changes
// We'll test:
// 1. Initial load with userId
// 2. Re-fetching when userId prop changes
// 3. Different users with different IDs
