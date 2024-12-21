"use client";

import { signIn, useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      // If user needs to complete registration, redirect to signup
      if (!session.user?.hasRegister) {
        router.push(
          `/signup?email=${session.user.email}&name=${session.user.name}`
        );
      } else {
        router.push("/dashboard");
      }
    }
  }, [session, router]);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const result = await signIn("google", {
        callbackUrl: "/dashboard",
        redirect: false,
      });

      if (result?.error) {
        // Handle error
        console.error(result.error);
      } else if (result?.url) {
        // Successful sign in, redirect to dashboard
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-sm space-y-4 p-6">
        {error === "OAuthAccountNotLinked" && (
          <div className="bg-red-100 text-red-600 p-4 rounded-md mb-4">
            The email on this account is already associated with another
            provider. Please sign in using your original provider.
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
          ) : (
            <div>Google</div>
            // <svg className="h-5 w-5" viewBox="0 0 24 24">
            //   {/* Google icon SVG path */}
            // </svg>
          )}
          {isLoading ? "Signing in..." : "Sign in with Google"}
        </button>
      </div>
    </div>
  );
}
