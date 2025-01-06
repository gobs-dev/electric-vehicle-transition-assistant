interface CostBreakdown {
  fuel_electricity_costs: string;
  maintenance_expenses: string;
  resale_depreciation: string;
  ev_incentives: string;
}

interface ImageType {
  title: string;
  image: string;
  thumbnail: string;
  url: string;
  height: number;
  width: number;
  source: string;
}

export interface CarDetailType {
  image: ImageType;
  purchase_price: string;
  efficiency: string;
  monthly_operating_costs: string;
  annual_maintenance_costs: string;
  environmental_impact: string;
  range: string;
  resale_value: string;
  cost_of_ownership_projection: {
    five_year_breakdown: CostBreakdown;
    break_even_point?: string;
  };
  enhanced_ev_charging_insights: {
    local_charging_network: {
      nearest_stations: string;
      average_charging_time: string;
    };
    charging_costs: {
      per_session: string;
      home_installation: string;
    };
  };
}

export interface CarRecommendationType {
  image: ImageType;
  make: string;
  model: string;
  battery_capacity_kWh: number;
  range_km: number | string;
  charging_time_hours: number;
  price: string;
  key_features: string[];
  environmental_impact: string;
}
