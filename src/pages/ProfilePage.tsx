import { UserProfile } from "../components/Login";

export function ProfilePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <UserProfile />
    </div>
  );
}
