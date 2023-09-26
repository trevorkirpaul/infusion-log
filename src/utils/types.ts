export interface Infusion {
  bleed_location: string;
  created_at: string;
  id: number;
  infusion_date: string;
  treated_within: boolean;
  notes: string;
}

export interface BleedingDisorder {
  name: string;
  severity?: string;
  id: number;
  created_at: string;
}

export interface User {
  id: number;
  email: string;
  created_at: string;
  bleeding_disorder?: number;
  theme?: string;
}

export interface FactorOrder {
  id: number;
  created_at: string;
  quantity: number;
  doses_on_hand: number;
  order_placed_at: string;
  user_id: number;
  arrived: boolean;
}

export interface InfusionByOrder {
  order_id: number;
  infusion_id: number;
  user_id: number;
  infusion_date: string;
}
