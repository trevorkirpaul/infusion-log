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
