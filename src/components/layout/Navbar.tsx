import { useAuth } from "@/contexts/auth";
import Link from "next/link";

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white px-4 py-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">
        EV Transition Assistant
      </Link>

      <div>
        {isLoggedIn ? (
          <>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/login">
            <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
              Login
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
