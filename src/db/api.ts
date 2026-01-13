import { supabase } from './supabase';
import type {
  Profile,
  Dataset,
  Species,
  FishIdentification,
  OceanographicData,
  FishSurveyData,
  DatasetType,
} from '@/types/database';

// Profile APIs
export const profileApi = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) throw error;
    return data as Profile | null;
  },

  async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data as Profile;
  },

  async getAllProfiles() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async updateUserRole(userId: string, role: string) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data as Profile;
  },
};

// Dataset APIs
export const datasetApi = {
  async createDataset(dataset: Omit<Dataset, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('datasets')
      .insert(dataset)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data as Dataset;
  },

  async getDatasets(limit = 50, offset = 0) {
    const { data, error } = await supabase
      .from('datasets')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getDatasetById(id: string) {
    const { data, error } = await supabase
      .from('datasets')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    return data as Dataset | null;
  },

  async getDatasetsByType(type: DatasetType) {
    const { data, error } = await supabase
      .from('datasets')
      .select('*')
      .eq('type', type)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async updateDataset(id: string, updates: Partial<Dataset>) {
    const { data, error } = await supabase
      .from('datasets')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data as Dataset;
  },

  async deleteDataset(id: string) {
    const { error } = await supabase
      .from('datasets')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
};

// Species APIs
export const speciesApi = {
  async getAllSpecies() {
    const { data, error } = await supabase
      .from('species')
      .select('*')
      .order('scientific_name', { ascending: true });
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getSpeciesById(id: string) {
    const { data, error } = await supabase
      .from('species')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    return data as Species | null;
  },

  async searchSpecies(query: string) {
    const { data, error } = await supabase
      .from('species')
      .select('*')
      .or(`scientific_name.ilike.%${query}%,common_name.ilike.%${query}%`)
      .order('scientific_name', { ascending: true })
      .limit(20);
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async createSpecies(species: Omit<Species, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('species')
      .insert(species)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data as Species;
  },
};

// Fish Identification APIs
export const fishIdentificationApi = {
  async createIdentification(identification: Omit<FishIdentification, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('fish_identifications')
      .insert(identification)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data as FishIdentification;
  },

  async getUserIdentifications(userId: string) {
    const { data, error } = await supabase
      .from('fish_identifications')
      .select('*, species(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },
};

// Oceanographic Data APIs
export const oceanographicApi = {
  async createData(data: Omit<OceanographicData, 'id' | 'created_at'>) {
    const { data: result, error } = await supabase
      .from('oceanographic_data')
      .insert(data)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return result as OceanographicData;
  },

  async getData(limit = 100, offset = 0) {
    const { data, error } = await supabase
      .from('oceanographic_data')
      .select('*')
      .order('measurement_date', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getDataByLocation(lat: number, lon: number, radius = 1) {
    const { data, error } = await supabase
      .from('oceanographic_data')
      .select('*')
      .gte('location_lat', lat - radius)
      .lte('location_lat', lat + radius)
      .gte('location_lon', lon - radius)
      .lte('location_lon', lon + radius)
      .order('measurement_date', { ascending: false })
      .limit(100);
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getDataByDateRange(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('oceanographic_data')
      .select('*')
      .gte('measurement_date', startDate)
      .lte('measurement_date', endDate)
      .order('measurement_date', { ascending: false })
      .limit(500);
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },
};

// Fish Survey Data APIs
export const fishSurveyApi = {
  async createSurvey(survey: Omit<FishSurveyData, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('fish_survey_data')
      .insert(survey)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data as FishSurveyData;
  },

  async getSurveys(limit = 100, offset = 0) {
    const { data, error } = await supabase
      .from('fish_survey_data')
      .select('*, species(*)')
      .order('survey_date', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getSurveysBySpecies(speciesId: string) {
    const { data, error } = await supabase
      .from('fish_survey_data')
      .select('*, species(*)')
      .eq('species_id', speciesId)
      .order('survey_date', { ascending: false })
      .limit(100);
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getSurveysByLocation(lat: number, lon: number, radius = 1) {
    const { data, error } = await supabase
      .from('fish_survey_data')
      .select('*, species(*)')
      .gte('location_lat', lat - radius)
      .lte('location_lat', lat + radius)
      .gte('location_lon', lon - radius)
      .lte('location_lon', lon + radius)
      .order('survey_date', { ascending: false })
      .limit(100);
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },
};

// Storage APIs
export const storageApi = {
  async uploadImage(file: File, path: string) {
    const { data, error } = await supabase.storage
      .from('app-8wr0fb8sswld_marine_images')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });
    
    if (error) throw error;
    
    const { data: urlData } = supabase.storage
      .from('app-8wr0fb8sswld_marine_images')
      .getPublicUrl(data.path);
    
    return urlData.publicUrl;
  },

  async uploadDataset(file: File, path: string) {
    const { data, error } = await supabase.storage
      .from('app-8wr0fb8sswld_datasets')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });
    
    if (error) throw error;
    
    const { data: urlData } = supabase.storage
      .from('app-8wr0fb8sswld_datasets')
      .getPublicUrl(data.path);
    
    return urlData.publicUrl;
  },

  async deleteFile(bucket: string, path: string) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    if (error) throw error;
  },
};
