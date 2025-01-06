import { Battery, Clock, Zap, DollarSign } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CarRecommendationType } from "@/types/car";

export function CarRecommendationCard({
  image,
  make,
  model,
  battery_capacity_kWh,
  range_km,
  charging_time_hours,
  price,
  key_features,
  environmental_impact,
}: CarRecommendationType) {
  return (
    <Card className="w-full max-w-sm mx-auto overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
      <CardHeader className="p-0">
        <img
          src={image.thumbnail || image.image}
          alt={`${make} ${model}`}
          width={400}
          height={300}
          className="w-full h-48 object-cover"
        />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-2xl font-bold mb-2">
          {make} {model}
        </CardTitle>
        <CardDescription className="text-sm text-gray-500 mb-4">
          {environmental_impact}
        </CardDescription>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center">
            <Battery className="w-4 h-4 mr-2" />
            <span className="text-sm">{battery_capacity_kWh} kWh</span>
          </div>
          <div className="flex items-center">
            <Zap className="w-4 h-4 mr-2" />
            <span className="text-sm">{range_km} km</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm">{charging_time_hours} hours</span>
          </div>
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-2" />
            <span className="text-sm">{price}</span>
          </div>
        </div>
        <div className="mb-4">
          {key_features.map((feature, index) => (
            <Badge key={index} variant="secondary" className="mr-2 mb-2">
              {feature}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
