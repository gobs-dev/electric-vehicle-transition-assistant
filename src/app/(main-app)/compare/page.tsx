"use client";

import { useEffect, useState } from "react";
import CarDetail from "./CarDetail";
import { useAuth } from "@/contexts/auth";
import AuthGuardLayout from "@/components/layout/AuthGuardLayout";
import { useMutation } from "@tanstack/react-query";
import axiosClient from "@/lib/axiosClient";
import AI_ACTION from "@/constants/ai-action";
import { useToast } from "@/hooks/use-toast";
import Spinner from "@/components/ui/spinner";
import {
  getAvailableEvList,
  setStorageAvailableEvList,
} from "@/lib/local-storage";

export default function CompareCar() {
  const { user } = useAuth();
  const [evCarList, setEvCarList] = useState();
  const { toast } = useToast();
  const fetchEvCarList = useMutation({
    mutationFn: () =>
      axiosClient.post("https://api.dify.ai/v1/workflows/run", {
        inputs: { ...user, action: AI_ACTION.listAvailableEvCar },
        response_mode: "blocking",
        user: user?.name,
      }),
    onSuccess: (response) => {
      try {
        const jsonString = response.data.data.outputs?.text;
        // Remove markdown code block syntax and parse JSON
        const cleanJson = jsonString.replace(/```json\n|\n```/g, "");
        const parsedData = JSON.parse(cleanJson);
        setStorageAvailableEvList(parsedData);
        setEvCarList(parsedData);
      } catch (error) {
        toast({
          title: "Failed to parse ev car list",
          variant: "destructive",
        });
      }
    },
    onError: () =>
      toast({
        title: "failed to fetch ev car list",
        variant: "destructive",
      }),
  });

  const handleFetchCarList = () => {
    const evList = getAvailableEvList();
    if (evList) return setEvCarList(evList);

    fetchEvCarList.mutate();
  };

  useEffect(() => {
    handleFetchCarList();
  }, []);

  if (!evCarList) return <Spinner className="h-screen" />;

  const cars = [user?.car || "", ...evCarList];

  return (
    <AuthGuardLayout>
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-8">Compare Cars</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <CarDetail initialSelectedCar={user?.car} cars={cars} />
          <CarDetail cars={cars} />
        </div>
      </div>
    </AuthGuardLayout>
  );
}
