import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <h1 className="text-3xl">Welcome, {session.user?.name}</h1>
      {/* Rest of your dashboard components */}
    </div>
  );
};

export default DashboardPage;
