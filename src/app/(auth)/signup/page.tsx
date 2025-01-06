"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";
import AuthGuardLayout from "@/components/layout/AuthGuardLayout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  monthlyMillage: z.coerce.number().optional().default(1000),
  country: z.string().min(1, "Country is required"),
  car: z.string().min(5, "Please enter the complete car name and car model"),
});

const countries = ["Indonesia", "Japan"];

type SignupFormData = z.infer<typeof signupSchema>;

const SignupPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { isLoggedIn, saveUser } = useAuth();
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      monthlyMillage: 1000,
      country: "",
      car: "",
    },
  });

  const handleSignup = async (data: SignupFormData) => {
    saveUser({
      name: data.name,
      car: data.car,
      country: data.country,
      monthly_mileage: data.monthlyMillage || 1000,
    });
    toast({
      title: "Success, sign up!",
    });
  };

  useEffect(() => {
    if (isLoggedIn) router.replace("/");
  }, [isLoggedIn]);

  return (
    <AuthGuardLayout>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-2">Sign Up</h1>
          <p className="text-base font-bold mb-4">
            Please fill form below to continue using the app.
          </p>
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
              <FormField
                control={form.control}
                name="car"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Car (Make and model)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Toyota Supra GR 2020"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="monthlyMillage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Monthly Millage (Optional)&nbsp;
                      <span className="text-xs">default: 1000</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="1000" type="number" {...field} />
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
    </AuthGuardLayout>
  );
};

export default SignupPage;
