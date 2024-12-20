import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-800 text-white px-4 py-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">
        EV Transition Assistant
      </Link>

      <div>
        {session ? (
          <>
            <span className="mr-4">{session.user?.name}</span>
            <button
              onClick={() => signOut()}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/auth/login">
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
