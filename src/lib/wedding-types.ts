export const ATTENDANCE_OPTIONS = ["Hadir", "Tidak Hadir"] as const;

export type Attendance = (typeof ATTENDANCE_OPTIONS)[number];

export interface ReservationRecord {
  id: number;
  name: string;
  attendance: Attendance;
  location: string | null;
  message: string;
  invitationSlug: string | null;
  invitationName: string | null;
  createdAt: string;
}

export interface ReservationStats {
  total: number;
  present: number;
  absent: number;
}

export interface InvitationStats {
  total: number;
  active: number;
  inactive: number;
}

export interface InvitationRecord {
  id: number;
  slug: string;
  guestName: string;
  customMessage: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
}

export type InvitationStatusFilter = "all" | "active" | "inactive";

export interface InvitationPageFilters {
  search: string;
  status: InvitationStatusFilter;
  page: number;
  pageSize: number;
}

export interface PaginatedInvitations {
  data: InvitationRecord[];
  meta: PaginationMeta;
}

export interface ReservationPageFilters {
  page: number;
  pageSize: number;
}

export interface PaginatedReservations {
  data: ReservationRecord[];
  meta: PaginationMeta;
}
