
import { supabase, safeTable } from '@/integrations/supabase/client';
import { Appointment, CreateAppointmentDto, UpdateAppointmentDto } from '../types/appointment';
import { ensureType } from '@/utils/supabaseUtils';

export const appointmentService = {
  async createAppointment(appointment: CreateAppointmentDto): Promise<Appointment> {
    const { data, error } = await safeTable<Appointment>('appointments')
      .insert({
        ...appointment,
        farmer_id: appointment.farmer_id || '',
        status: 'upcoming'
      })
      .select()
      .single();

    if (error) throw error;
    return data as Appointment;
  },

  async getAppointmentById(id: string): Promise<Appointment> {
    const { data, error } = await safeTable<Appointment>('appointments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Appointment;
  },

  async getFarmerAppointments(farmerId: string): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('farmer_id', farmerId)
      .order('appointment_date', { ascending: true });

    if (error) throw error;
    return ensureType<Appointment>(data);
  },

  async getTraderAppointments(traderId: string): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('trader_id', traderId)
      .order('appointment_date', { ascending: true });

    if (error) throw error;
    return ensureType<Appointment>(data);
  },

  async updateAppointment(id: string, updates: UpdateAppointmentDto): Promise<Appointment> {
    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Appointment;
  },

  async deleteAppointment(id: string): Promise<void> {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async updateAppointmentStatus(id: string, status: string): Promise<Appointment> {
    const { data, error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Appointment;
  },

  async getUpcomingAppointments(userId: string, role: 'farmer' | 'trader'): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq(`${role}_id`, userId)
      .eq('status', 'upcoming')
      .gte('appointment_date', new Date().toISOString())
      .order('appointment_date', { ascending: true });

    if (error) throw error;
    return ensureType<Appointment>(data);
  }
};
