"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/contexts/auth";
import { LoaderCircle } from "lucide-react";

interface AuthGuardLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectAuthenticatedTo?: string;
  redirectUnauthenticatedTo?: string;
}

const AuthGuardLayout: React.FC<AuthGuardLayoutProps> = ({
  children,
  requireAuth = true,
  redirectAuthenticatedTo,
  redirectUnauthenticatedTo = "/login",
}) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (requireAuth && !user) {
      router.replace(redirectUnauthenticatedTo);
    } else if (!requireAuth && user && redirectAuthenticatedTo) {
      router.replace(redirectAuthenticatedTo);
    }
  }, [
    user,
    isLoading,
    requireAuth,
    redirectAuthenticatedTo,
    redirectUnauthenticatedTo,
    router,
  ]);

  if (
    isLoading ||
    (requireAuth && !user) ||
    (!requireAuth && user && redirectAuthenticatedTo)
  ) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return children;
};

export default AuthGuardLayout;
