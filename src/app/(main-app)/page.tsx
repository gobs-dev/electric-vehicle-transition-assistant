"use client";

import AuthGuardLayout from "@/components/layout/AuthGuardLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import Spinner from "@/components/ui/spinner";
import AI_ACTION from "@/constants/ai-action";
import { useAuth } from "@/contexts/auth";
import { useToast } from "@/hooks/use-toast";
import axiosClient from "@/lib/axiosClient";
import { getStorageCars, setStorageCars } from "@/lib/local-storage";
import { CarDetailType } from "@/types/car";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const MainApp = () => {
  const { user } = useAuth();
  const [carData, setCarData] = useState<CarDetailType>();
  const { toast } = useToast();
  const fetchMyCar = useMutation({
    mutationFn: () =>
      axiosClient.post("/workflows/run", {
        inputs: { ...user, action: AI_ACTION.analyzeIceCar },
        response_mode: "blocking",
        user: user?.name,
      }),
    onSuccess: (response) => {
      try {
        const result = response.data.data.outputs?.result;
        // Remove markdown code block syntax and parse JSON
        if (user?.car) setStorageCars(user.car, result);
        setCarData(result);
      } catch (error) {
        toast({
          title: "Failed to parse car data",
          variant: "destructive",
        });
      }
    },
    onError: () =>
      toast({
        title: "failed to fetch my car",
        variant: "destructive",
      }),
  });

  const handleFetchMyCar = () => {
    const cars = getStorageCars();
    if (cars && user?.car && cars[user?.car]) {
      return setCarData(cars[user?.car]);
    }

    fetchMyCar.mutate();
  };

  useEffect(() => {
    if (user) handleFetchMyCar();
  }, []);

  return (
    <AuthGuardLayout>
      {carData ? (
        <div className="container mx-auto p-6 space-y-6">
          {/* Title Section */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">{user.car}</h1>
            <p className="text-muted-foreground">
              Detailed analysis and cost breakdown of your vehicle
            </p>
            <Separator className="my-4" />
          </div>

          {/* Main Car Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Car Image - Takes up full width on mobile, 2 cols on desktop */}
            <Card className="overflow-hidden lg:col-span-2">
              <div className="relative h-[400px] w-full">
                <img
                  src={carData.image.image}
                  alt={user?.car}
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 66vw"
                />
              </div>
            </Card>

            {/* Quick Stats Card */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Quick Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Purchase Price</span>
                  <span className="font-semibold">
                    {carData.purchase_price}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Efficiency</span>
                  <Badge variant="secondary">{carData.efficiency}</Badge>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Range</span>
                  <span className="font-semibold">{carData.range}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Resale Value</span>
                  <span className="font-semibold">{carData.resale_value}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cost Analysis Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Monthly Costs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {carData.monthly_operating_costs}
                </div>
                <p className="text-sm text-muted-foreground">
                  Operating Expenses
                </p>
              </CardContent>
            </Card>

            <Card className="bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Annual Maintenance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {carData.annual_maintenance_costs}
                </div>
                <p className="text-sm text-muted-foreground">
                  Yearly Service & Repairs
                </p>
              </CardContent>
            </Card>

            <Card className="bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Environmental Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {carData.environmental_impact}
                </div>
                <p className="text-sm text-muted-foreground">
                  CO2 Emissions/Year
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 5 Year Cost Projection */}
          <Card>
            <CardHeader>
              <CardTitle>5 Year Cost Breakdown</CardTitle>
              <p className="text-sm text-muted-foreground">
                Projected expenses over a five-year ownership period
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Fuel/Electricity Costs</span>
                  <span className="font-semibold">
                    {
                      carData.cost_of_ownership_projection.five_year_breakdown
                        .fuel_electricity_costs
                    }
                  </span>
                </div>
                <Progress value={40} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Maintenance Expenses</span>
                  <span className="font-semibold">
                    {
                      carData.cost_of_ownership_projection.five_year_breakdown
                        .maintenance_expenses
                    }
                  </span>
                </div>
                <Progress value={30} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Resale Depreciation</span>
                  <span className="font-semibold">
                    {
                      carData.cost_of_ownership_projection.five_year_breakdown
                        .resale_depreciation
                    }
                  </span>
                </div>
                <Progress value={70} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Spinner className="h-screen" />
      )}
    </AuthGuardLayout>
  );
};

export default MainApp;
