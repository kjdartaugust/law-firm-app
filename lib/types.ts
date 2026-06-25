// ============================================================================
// Shared domain + generated-style Supabase types.
// ============================================================================

export type UserRole = 'client' | 'lawyer' | 'admin';
export type CaseStatus = 'open' | 'pending' | 'closed';
export type AppointmentStatus = 'requested' | 'confirmed' | 'completed' | 'cancelled';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  title: string | null;
  bio: string | null;
  practice_areas: string[] | null;
  years_experience: number | null;
  created_at: string;
}

export interface PracticeArea {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  created_at: string;
}

export interface Case {
  id: string;
  reference: string;
  title: string;
  description: string | null;
  status: CaseStatus;
  practice_area: string | null;
  client_id: string;
  lawyer_id: string | null;
  opened_at: string;
  closed_at: string | null;
  created_at: string;
}

export interface CaseDocument {
  id: string;
  case_id: string;
  uploaded_by: string;
  name: string;
  storage_path: string;
  mime_type: string | null;
  size_bytes: number | null;
  created_at: string;
}

export interface Appointment {
  id: string;
  client_id: string;
  lawyer_id: string | null;
  case_id: string | null;
  subject: string;
  notes: string | null;
  scheduled_at: string;
  duration_minutes: number;
  status: AppointmentStatus;
  created_at: string;
}

export interface Invoice {
  id: string;
  number: string;
  case_id: string | null;
  client_id: string;
  amount_cents: number;
  currency: string;
  status: InvoiceStatus;
  description: string | null;
  issued_at: string;
  due_at: string | null;
  paid_at: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  case_id: string;
  sender_id: string;
  body: string;
  read_at: string | null;
  created_at: string;
}

// ---- Minimal Database type for the Supabase generic ------------------------
// Mapped types (rather than the bare interfaces) give the shapes an implicit
// index signature, so they satisfy Supabase's `GenericSchema` constraint.
type Row<T> = { [K in keyof T]: T[K] };
type Insert<T> = Partial<{ [K in keyof T]: T[K] }>;
type Update<T> = Partial<{ [K in keyof T]: T[K] }>;

interface TableShape<T> {
  Row: Row<T>;
  Insert: Insert<T>;
  Update: Update<T>;
  Relationships: [];
}

export interface Database {
  public: {
    Tables: {
      profiles: TableShape<Profile>;
      practice_areas: TableShape<PracticeArea>;
      cases: TableShape<Case>;
      documents: TableShape<CaseDocument>;
      appointments: TableShape<Appointment>;
      invoices: TableShape<Invoice>;
      messages: TableShape<Message>;
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
      is_staff: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: {
      user_role: UserRole;
      case_status: CaseStatus;
      appointment_status: AppointmentStatus;
      invoice_status: InvoiceStatus;
    };
  };
}
