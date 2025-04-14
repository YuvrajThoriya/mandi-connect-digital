
export interface Appointment {
  id: string;
  trader_id: string;
  farmer_id: string;
  title: string;
  appointment_date: string;
  appointment_time: string;
  location: string;
  status: string;
  created_at: string;
  updated_at: string;
  trader?: { name: string } | any; // Made more flexible
}

export interface CreateAppointmentDto {
  trader_id: string;
  farmer_id?: string; // Make farmer_id optional to match service implementation
  title: string;
  appointment_date: string;
  appointment_time: string;
  location: string;
  status?: string; // Added status field
}

export interface UpdateAppointmentDto {
  title?: string;
  appointment_date?: string;
  appointment_time?: string;
  location?: string;
  status?: string;
}
