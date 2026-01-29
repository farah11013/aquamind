-- Create dataset_history table
CREATE TABLE IF NOT EXISTS dataset_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  upload_date TIMESTAMPTZ DEFAULT NOW(),
  record_count INTEGER NOT NULL,
  numeric_columns JSONB DEFAULT '[]'::jsonb,
  categorical_columns JSONB DEFAULT '[]'::jsonb,
  time_column TEXT,
  data JSONB NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_dataset_history_upload_date ON dataset_history(upload_date DESC);

-- Enable Row Level Security
ALTER TABLE dataset_history ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for now (public access)
CREATE POLICY "Allow all operations on dataset_history" ON dataset_history
  FOR ALL
  USING (true)
  WITH CHECK (true);