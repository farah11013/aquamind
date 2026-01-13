export type UserRole = 'guest' | 'scientist' | 'policymaker' | 'admin';

export type DatasetType = 'oceanographic' | 'fish_survey' | 'otolith_image' | 'edna' | 'species_data';

export interface Profile {
  id: string;
  username: string;
  email: string | null;
  role: UserRole;
  full_name: string | null;
  organization: string | null;
  created_at: string;
  updated_at: string;
}

export interface Dataset {
  id: string;
  name: string;
  description: string | null;
  type: DatasetType;
  uploaded_by: string;
  file_url: string | null;
  file_size: number | null;
  file_format: string | null;
  metadata: Record<string, unknown>;
  location_lat: number | null;
  location_lon: number | null;
  collection_date: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Species {
  id: string;
  scientific_name: string;
  common_name: string | null;
  habitat: string | null;
  conservation_status: string | null;
  distribution_range: string | null;
  biological_characteristics: string | null;
  image_url: string | null;
  created_at: string;
}

export interface FishIdentification {
  id: string;
  user_id: string | null;
  image_url: string;
  identified_species_id: string | null;
  confidence_score: number | null;
  created_at: string;
}

export interface OceanographicData {
  id: string;
  dataset_id: string | null;
  location_lat: number;
  location_lon: number;
  measurement_date: string;
  temperature: number | null;
  salinity: number | null;
  ph: number | null;
  oxygen_level: number | null;
  current_speed: number | null;
  current_direction: number | null;
  depth: number | null;
  created_at: string;
}

export interface FishSurveyData {
  id: string;
  dataset_id: string | null;
  species_id: string | null;
  location_lat: number;
  location_lon: number;
  survey_date: string;
  abundance: number | null;
  biomass: number | null;
  size_range: string | null;
  notes: string | null;
  created_at: string;
}

export interface VisualizationFilter {
  timeRange?: {
    start: string;
    end: string;
  };
  location?: {
    lat: number;
    lon: number;
    radius: number;
  };
  species?: string[];
  dataType?: DatasetType[];
  parameters?: string[];
}
