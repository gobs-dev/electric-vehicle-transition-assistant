"use client";

import { useEffect, useState } from "react";
import { CarRecommendationCard } from "./CarRecommendationCard";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";
import { useMutation } from "@tanstack/react-query";
import AI_ACTION from "@/constants/ai-action";
import axiosClient from "@/lib/axiosClient";
import Spinner from "@/components/ui/spinner";
import { CarRecommendationType } from "@/types/car";
import AuthGuardLayout from "@/components/layout/AuthGuardLayout";

export default function RecommendationCar() {
  const [recommendationCars, setRecommendationCars] =
    useState<CarRecommendationType[]>();
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchRecommendationCars = useMutation({
    mutationFn: () =>
      axiosClient.post("/workflows/run", {
        inputs: {
          ...user,
          action: AI_ACTION.recommendationCar,
        },
        response_mode: "blocking",
        user: user?.name,
      }),
    onSuccess: (response) => {
      try {
        const result = response.data.data.outputs?.result;

        setRecommendationCars(result);
      } catch (error) {
        console.error(error);
        toast({
          title: "Failed to recommendation car",
          variant: "destructive",
        });
      }
    },
    onError: () =>
      toast({
        title: `failed to fetch recommendation car`,
        variant: "destructive",
      }),
  });

  useEffect(() => {
    fetchRecommendationCars.mutate();
  }, []);

  if (!recommendationCars) return <Spinner className="h-screen" />;

  return (
    <AuthGuardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Recommended Cars
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommendationCars.map((car, index) => (
            <CarRecommendationCard key={index} {...car} />
          ))}
        </div>
      </div>
    </AuthGuardLayout>
  );
}
