"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/contexts/auth";

interface AuthGuardLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectAuthenticatedTo?: string;
  redirectUnauthenticatedTo?: string;
}

const AuthGuardLayout: React.FC<AuthGuardLayoutProps> = ({
  children,
  redirectUnauthenticatedTo = "/signup",
}) => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) router.replace(redirectUnauthenticatedTo);
  }, [isLoggedIn]);

  return children;
};

export default AuthGuardLayout;
