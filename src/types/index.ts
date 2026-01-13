export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

export interface Profile {
  id: string;
  username: string;
  email: string | null;
  role: 'guest' | 'scientist' | 'policymaker' | 'admin';
  full_name: string | null;
  organization: string | null;
  created_at: string;
  updated_at: string;
}

