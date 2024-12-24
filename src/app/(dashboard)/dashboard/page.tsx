"use client";

import AuthGuardLayout from "@/components/layout/AuthGuardLayout";

const DashboardPage = () => {
  return (
    <AuthGuardLayout>
      <div>
        <h1 className="text-3xl">Welcome, </h1>
        {/* Rest of your dashboard components */}
      </div>
    </AuthGuardLayout>
  );
};

export default DashboardPage;
