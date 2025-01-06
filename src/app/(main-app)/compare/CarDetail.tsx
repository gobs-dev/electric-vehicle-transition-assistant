import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Spinner from "@/components/ui/spinner";
import AI_ACTION from "@/constants/ai-action";
import { useAuth } from "@/contexts/auth";
import { useToast } from "@/hooks/use-toast";
import axiosClient from "@/lib/axiosClient";
import { getStorageCars, setStorageCars } from "@/lib/local-storage";
import { CarDetailType } from "@/types/car";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function CarDetailPage({
  initialSelectedCar = "",
  cars,
}: {
  cars: string[];
  initialSelectedCar?: string;
}) {
  const [carDetail, setCarDetail] = useState<CarDetailType>();
  const [selectedCar, setSelectedCar] = useState(initialSelectedCar);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchCarDetail = useMutation({
    mutationFn: () =>
      axiosClient.post("https://api.dify.ai/v1/workflows/run", {
        inputs: {
          ...user,
          car: selectedCar,
          action:
            user?.car === selectedCar
              ? AI_ACTION.analyzeIceCar
              : AI_ACTION.analyzeEvCar,
        },
        response_mode: "blocking",
        user: user?.name,
      }),
    onSuccess: (response) => {
      try {
        const result = response.data.data.outputs?.result;
        const cars = getStorageCars() || {};
        if (!cars[selectedCar]) setStorageCars(selectedCar, result);

        setCarDetail(result);
      } catch (error) {
        toast({
          title: "Failed to parse ev car list",
          variant: "destructive",
        });
      }
    },
    onError: () =>
      toast({
        title: `failed to fetch ${selectedCar}`,
        variant: "destructive",
      }),
  });

  const handleFetchCar = () => {
    if (!selectedCar) return;

    const cars = getStorageCars();
    if (cars && cars[selectedCar]) return setCarDetail(cars[selectedCar]);

    fetchCarDetail.mutate();
  };

  useEffect(() => {
    handleFetchCar();
  }, [selectedCar]);

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <Select onValueChange={setSelectedCar} value={selectedCar}>
        <SelectTrigger>
          <SelectValue placeholder="Select a car" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Cars</SelectLabel>
            {cars.map((car) => (
              <SelectItem key={car} value={car}>
                {car}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {carDetail && (
        <>
          <img
            src={carDetail.image.image}
            alt="Car"
            width={300}
            height={300}
            className="rounded-lg"
          />
          <h2 className="text-2xl font-bold">{selectedCar}</h2>
          <div className="text-xl font-semibold">
            {carDetail.purchase_price}
          </div>
          <div className="w-full space-y-4">
            <DetailItem title="Efficiency" value={carDetail.efficiency} />
            <DetailItem
              title="Monthly Operating Costs"
              value={carDetail.monthly_operating_costs}
            />
            <DetailItem
              title="Annual Maintenance Costs"
              value={carDetail.annual_maintenance_costs}
            />
            <DetailItem
              title="Environmental Impact"
              value={carDetail.environmental_impact}
            />
            <DetailItem title="Range" value={carDetail.range} />
            <DetailItem title="Resale Value" value={carDetail.resale_value} />
            <DetailSection title="5 Year Cost Breakdown">
              <DetailItem
                title="Fuel/Electricity Costs"
                value={
                  carDetail.cost_of_ownership_projection.five_year_breakdown
                    .fuel_electricity_costs
                }
              />
              <DetailItem
                title="Maintenance Expenses"
                value={
                  carDetail.cost_of_ownership_projection.five_year_breakdown
                    .maintenance_expenses
                }
              />
              <DetailItem
                title="Resale Depreciation"
                value={
                  carDetail.cost_of_ownership_projection.five_year_breakdown
                    .resale_depreciation
                }
              />
              <DetailItem
                title="EV Incentives"
                value={
                  carDetail.cost_of_ownership_projection.five_year_breakdown
                    ?.ev_incentives
                }
              />
            </DetailSection>
            <DetailItem
              title="Break Even Point"
              value={carDetail.cost_of_ownership_projection?.break_even_point}
            />
            {user?.car !== selectedCar && (
              <DetailSection title="Charging Insights">
                <DetailItem
                  title="Nearest Stations"
                  value={
                    carDetail.enhanced_ev_charging_insights
                      .local_charging_network.nearest_stations
                  }
                />
                <DetailItem
                  title="Average Charging Time"
                  value={
                    carDetail.enhanced_ev_charging_insights
                      .local_charging_network.average_charging_time
                  }
                />
                <DetailItem
                  title="Charging Costs (per session)"
                  value={
                    carDetail.enhanced_ev_charging_insights.charging_costs
                      .per_session
                  }
                />
                <DetailItem
                  title="Home Installation Cost"
                  value={
                    carDetail.enhanced_ev_charging_insights.charging_costs
                      .home_installation
                  }
                />
              </DetailSection>
            )}
          </div>
        </>
      )}
      {fetchCarDetail.isPending && <Spinner className="pt-10" />}
    </div>
  );
}

function DetailItem({ title, value }: { title: string; value?: string }) {
  if (!value) return null;

  return (
    <div className="flex justify-between items-center border-b border-gray-200 py-2">
      <span className="font-medium">{title}</span>
      <span>{value}</span>
    </div>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-lg">{title}</h3>
      {children}
    </div>
  );
}
