"use client";

import AuthGuardLayout from "@/components/layout/AuthGuardLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { logInWithGoogle, checkUser } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      await logInWithGoogle();
      const user = await checkUser();

      if (user) {
        toast({
          title: "ログイン成功",
        });
        router.replace("/dashboard");
      } else {
        router.replace("/signup");
      }
    } catch (error) {
      console.error("Error Login with Google", error);
      toast({
        title: "ログインに失敗しました",
        description:
          "もう一度お試しください。問題が解決しない場合はサポートにお問い合わせください。",
      });
    }
    return null;
  };

  return (
    <AuthGuardLayout requireAuth={false} redirectAuthenticatedTo="/dashboard">
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="w-full max-w-sm space-y-4 p-6">
          <Button
            variant="outline"
            onClick={handleGoogleLogin}
            type="button"
            aria-label="Login With Google"
            className="mt-[50px] flex !h-auto items-center overflow-hidden rounded-full border border-[#2D342D] bg-white px-4 py-2 text-2xl font-bold leading-[27.84px] shadow-[0px_4px_4px_0px_#00000040]"
          >
            Login With Google
          </Button>
        </div>
      </main>
    </AuthGuardLayout>
  );
}
