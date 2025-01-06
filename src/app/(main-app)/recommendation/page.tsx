import { CarRecommendationCard } from "./CarRecommendationCard";

const carRecommendations = [
  {
    "image":
      "https://www.hyundai.com/etc/designs/hyundaiworldwide/us/en/ev/images/ioniq5/ioniq5-exterior-01.jpg",
    "make": "Hyundai",
    "model": "Ioniq 5",
    "battery_capacity_kWh": 77.4,
    "range_km": 480,
    "charging_time_hours": 6.5,
    "price": "Rp 800,000,000",
    "key_features": [
      "Retro-futuristic design",
      "Fast charging (10-80% in 18 minutes with DC fast charger)",
      "Spacious interior with adjustable seats",
    ],
    "environmental_impact": "Low emissions, recyclable interior materials",
  },
  {
    "image":
      "https://tesla-cdn.thron.com/delivery/public/image/tesla/0cf72a8b-4d79-4b2c-8e6a-5bdf9f7cb5e4/bvlatuR/std/4096x2560/Model3-Social",
    "make": "Tesla",
    "model": "Model 3",
    "battery_capacity_kWh": 82,
    "range_km": 507,
    "charging_time_hours": 7,
    "price": "Rp 1,500,000,000",
    "key_features": [
      "Autopilot system",
      "Minimalist interior design",
      "Over-the-air software updates",
    ],
    "environmental_impact":
      "Zero tailpipe emissions, globally recognized EV sustainability",
  },
  {
    "image": "https://cdn.mos.cms.futurecdn.net/hC6HxC5R3CiMZ3xry5t8Qj.jpg",
    "make": "Nissan",
    "model": "Leaf",
    "battery_capacity_kWh": 40,
    "range_km": 270,
    "charging_time_hours": 8,
    "price": "Rp 649,000,000",
    "key_features": [
      "Affordable pricing",
      "ProPILOT driver assistance",
      "Compact design suitable for city driving",
    ],
    "environmental_impact": "100% electric, recyclable battery materials",
  },
  {
    "image":
      "https://media.mitsubishi-motors.com/image/jpg/2022/mitsubishi-outlander-phev.jpg",
    "make": "Mitsubishi",
    "model": "Outlander PHEV",
    "battery_capacity_kWh": 13.8,
    "range_km": "55 (electric-only, 600 km combined with hybrid)",
    "charging_time_hours": 3.5,
    "price": "Rp 1,200,000,000",
    "key_features": [
      "Plug-in hybrid with extended range",
      "All-wheel drive capabilities",
      "Family-friendly SUV",
    ],
    "environmental_impact": "Reduced emissions due to hybrid technology",
  },
  {
    "image": "https://cdn.motor1.com/images/mgl/0ANk4/s1/2022-toyota-bz4x.webp",
    "make": "Toyota",
    "model": "bZ4X",
    "battery_capacity_kWh": 71.4,
    "range_km": 500,
    "charging_time_hours": 8,
    "price": "Rp 850,000,000",
    "key_features": [
      "All-electric SUV",
      "Advanced safety features (Toyota Safety Sense)",
      "User-friendly infotainment system",
    ],
    "environmental_impact": "Zero emissions, commitment to sustainability",
  },
];

export default function RecommendationCar() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Recommended Cars</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {carRecommendations.map((car, index) => (
          <CarRecommendationCard key={index} {...car} />
        ))}
      </div>
    </div>
  );
}
