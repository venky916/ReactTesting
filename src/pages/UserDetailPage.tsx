import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserDetails } from "../components/UserDetails";
import { Button } from "../components/Button";

export const UserDetailPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  if (!userId) {
    return (
      <div className="p-6 text-center">
        <p>User ID not provided</p>
        <button
          onClick={() => navigate("/all-users")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Back to Users
        </button>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Button
        onClick={() => navigate("/all-users")}
        // className="mb-6 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        label="← Back to Users"
        variant="secondary"
      />

      {/* Reuse existing UserDetails component */}
      <UserDetails userId={parseInt(userId)} />
    </div>
  );
};
