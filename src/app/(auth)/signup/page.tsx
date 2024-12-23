"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SelectInput from "@/components/form/SelectInput";
import COUNTRY_BY_CURRENCY from "@/constants/country-by-currency";
import { useMutation } from "@tanstack/react-query";
import axiosClient from "@/lib/axiosClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";
import { useEffect } from "react";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  country: z.string().min(1, "Country is required"),
});

const countries = COUNTRY_BY_CURRENCY.map((item) => item.country);

type SignupFormData = z.infer<typeof signupSchema>;

const SignupPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { firebaseUser, isLoading, isLoggedIn, user, saveUser } = useAuth();
  console.log("user", user);
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: firebaseUser?.name || "",
    },
  });

  useEffect(() => {
    if (isLoading) return;

    if (!isLoggedIn) router.replace("/login");

    if (user) router.replace("/dashboard");
  }, [isLoggedIn, user, isLoading, router]);

  const signupMutation = useMutation({
    mutationFn: async (data: SignupFormData) =>
      axiosClient.post("/auth/signup", {
        ...data,
        firebaseUid: firebaseUser?.firebaseUserId,
        email: firebaseUser?.email,
      }),
    onSuccess: async (res) => {
      console.log("res", res);
      saveUser(res.data);
      toast({ title: "Account created successfully!" });
    },
    onError: (error) => {
      toast({ title: error.message || "Failed to create account" });
    },
  });

  const handleSignup = async (data: SignupFormData) =>
    signupMutation.mutate(data);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSignup)}
            className="flex flex-col gap-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <SelectInput
                      data={countries}
                      onChange={(val) => field.onChange(val)}
                      placeholder="Select your country"
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 mt-8 text-white py-2 rounded"
            >
              Sign Up
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SignupPage;
