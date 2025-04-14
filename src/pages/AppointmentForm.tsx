
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { cn } from '@/lib/utils';
import { ensureType } from '@/utils/supabaseUtils';

interface AppointmentFormData {
  title: string;
  appointment_date: Date;
  appointment_time: string;
  location: string;
  notes: string;
  participant_id: string;
}

interface Participant {
  id: string;
  name: string;
  role: string;
}

const AppointmentForm = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<AppointmentFormData>({
    defaultValues: {
      title: '',
      appointment_date: new Date(),
      appointment_time: '10:00',
      location: '',
      notes: '',
      participant_id: '',
    },
  });

  React.useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const role = profile?.role === 'farmer' ? 'trader' : 'farmer';
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, role')
          .eq('role', role);

        if (error) throw error;
        setParticipants(data || []);
      } catch (error) {
        console.error('Error fetching participants:', error);
        toast({
          title: "Error",
          description: "Failed to load participants.",
          variant: "destructive"
        });
      }
    };

    if (profile?.id) {
      fetchParticipants();
    }
  }, [profile]);

  const onSubmit = async (data: AppointmentFormData) => {
    if (!profile?.id) return;
    
    setIsLoading(true);
    try {
      const appointment = {
        title: data.title,
        appointment_date: format(data.appointment_date, 'yyyy-MM-dd'),
        appointment_time: data.appointment_time,
        location: data.location,
        notes: data.notes || null,
        status: 'upcoming',
        farmer_id: profile.role === 'farmer' ? profile.id : data.participant_id,
        trader_id: profile.role === 'trader' ? profile.id : data.participant_id,
      };

      const { error } = await supabase.from('appointments').insert(appointment);

      if (error) throw error;

      // Create notification for the other participant
      const notificationData = {
        user_id: data.participant_id,
        title: 'New Appointment',
        message: `${profile.name} has scheduled an appointment with you on ${format(data.appointment_date, 'PPP')} at ${data.appointment_time}.`,
        type: 'appointment',
        read: false,
      };

      // Insert into notifications table if it exists
      try {
        await supabase.from('notification_settings').insert({
          user_id: data.participant_id,
          settings: {
            appointments: true
          }
        });
      } catch (err) {
        console.log('Notification settings might already exist or table doesn\'t exist');
      }

      toast({
        title: "Success",
        description: "Appointment scheduled successfully.",
      });

      navigate(profile.role === 'farmer' ? '/farmer-appointments' : '/trader-appointments');
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: "Error",
        description: "Failed to schedule appointment.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile) return null;

  return (
    <DashboardLayout userRole={profile.role as 'farmer' | 'trader'}>
      <DashboardHeader 
        title="Schedule Appointment" 
        userName={profile.name || ""}
        userRole={profile.role as 'farmer' | 'trader'}
      />
      
      <div className="container max-w-4xl mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>New Appointment</CardTitle>
            <CardDescription>
              Schedule a meeting with a {profile.role === 'farmer' ? 'trader' : 'farmer'}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Meeting title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="appointment_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="appointment_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Meeting location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="participant_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {profile.role === 'farmer' ? 'Select Trader' : 'Select Farmer'}
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={`Select a ${profile.role === 'farmer' ? 'trader' : 'farmer'}`} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {participants.map((participant) => (
                            <SelectItem key={participant.id} value={participant.id}>
                              {participant.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any additional notes for the meeting"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate(profile.role === 'farmer' ? '/farmer-appointments' : '/trader-appointments')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Scheduling...' : 'Schedule Appointment'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AppointmentForm;
