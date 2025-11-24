import { UserManagement } from "../components/UserManagement";

export function UsersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      <UserManagement />
    </div>
  );
}
