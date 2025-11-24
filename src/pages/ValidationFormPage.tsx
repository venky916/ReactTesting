import React from "react";
import { LoginForm } from "../components/LoginForm";

export const ValidationFormPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Test Form Validation</h1>
      <LoginForm onSubmit={() => {}} />
    </div>
  );
};
