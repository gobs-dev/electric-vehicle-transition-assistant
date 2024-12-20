// Example for a protected dashboard route
// src/app/(dashboard)/dashboard/page.tsx
import { useSession, signIn } from "next-auth/react";

const DashboardPage = () => {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;
  if (!session) {
    signIn(); // Redirect to login if not authenticated
    return null; // Add a loading state or similar UI
  }

  return (
    <div>
      <h1 className="text-3xl">Welcome, {session.user?.name}</h1>
      {/* Rest of your dashboard components */}
    </div>
  );
};

export default DashboardPage;
