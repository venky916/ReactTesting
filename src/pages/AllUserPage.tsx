import React from "react";
import { UserList } from "../components/UserList";

export const AllUserPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All User List</h1>
      <UserList />
    </div>
  );
};
