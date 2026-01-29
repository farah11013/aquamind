import { supabase } from '@/lib/supabase';

export interface DatasetHistory {
  id: string;
  filename: string;
  upload_date: string;
  record_count: number;
  numeric_columns: string[];
  categorical_columns: string[];
  time_column: string | null;
  data: Record<string, any>[];
  file_type: string;
  file_size?: number;
  created_at: string;
}

export interface CreateDatasetHistoryInput {
  filename: string;
  record_count: number;
  numeric_columns: string[];
  categorical_columns: string[];
  time_column: string | null;
  data: Record<string, any>[];
  file_type: string;
  file_size?: number;
}

// Save dataset to history
export async function saveDatasetToHistory(input: CreateDatasetHistoryInput) {
  const { data, error } = await supabase
    .from('dataset_history')
    .insert({
      filename: input.filename,
      record_count: input.record_count,
      numeric_columns: input.numeric_columns,
      categorical_columns: input.categorical_columns,
      time_column: input.time_column,
      data: input.data,
      file_type: input.file_type,
      file_size: input.file_size,
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving dataset to history:', error);
    throw error;
  }

  return data as DatasetHistory;
}

// Get all dataset history (sorted by upload date, newest first)
export async function getAllDatasetHistory() {
  const { data, error } = await supabase
    .from('dataset_history')
    .select('*')
    .order('upload_date', { ascending: false });

  if (error) {
    console.error('Error fetching dataset history:', error);
    throw error;
  }

  return data as DatasetHistory[];
}

// Get single dataset by ID
export async function getDatasetById(id: string) {
  const { data, error } = await supabase
    .from('dataset_history')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching dataset:', error);
    throw error;
  }

  return data as DatasetHistory;
}

// Delete dataset from history
export async function deleteDatasetFromHistory(id: string) {
  const { error } = await supabase
    .from('dataset_history')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting dataset:', error);
    throw error;
  }

  return true;
}

// Get dataset count
export async function getDatasetCount() {
  const { count, error } = await supabase
    .from('dataset_history')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error getting dataset count:', error);
    throw error;
  }

  return count || 0;
}
