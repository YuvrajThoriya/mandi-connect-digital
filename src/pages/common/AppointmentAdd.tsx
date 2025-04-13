
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoadingOverlay } from "@/components/ui/loader";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AppointmentFormValues = {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'inspection' | 'meeting' | 'delivery' | 'other';
};

export default function AppointmentAdd() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createAppointment, isLoading } = useData();
  
  const form = useForm<AppointmentFormValues>({
    defaultValues: {
      title: "",
      description: "",
      date: new Date().toISOString().split('T')[0], // Today's date
      time: new Date().toTimeString().slice(0, 5), // Current time
      location: "",
      type: 'meeting',
    },
  });
  
  // Handle form submission
  const onSubmit = async (data: AppointmentFormValues) => {
    try {
      // Add user role-specific fields
      const appointmentData = {
        ...data,
        status: 'pending' as const,
      };
      
      await createAppointment(appointmentData);
      toast.success("Appointment scheduled successfully!");
      navigate("/appointments");
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error("Failed to schedule appointment. Please try again.");
    }
  };
  
  return (
    <AuthGuard allowedRoles={["farmer", "trader", "admin"]}>
      <MainLayout>
        {isLoading && <LoadingOverlay />}
        
        {/* Header */}
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Button 
                variant="link" 
                className="p-0 h-auto text-muted-foreground" 
                onClick={() => navigate("/appointments")}
              >
                Appointments
              </Button>
              <span>/</span>
              <span>New Appointment</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Schedule New Appointment</h1>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate("/appointments")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Appointment Details</CardTitle>
            <CardDescription>
              Enter the details for your appointment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  rules={{ required: "Title is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Product Inspection Meeting" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="date"
                    rules={{ required: "Date is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            <Input type="date" {...field} min={new Date().toISOString().split('T')[0]} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="time"
                    rules={{ required: "Time is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                            <Input type="time" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="type"
                  rules={{ required: "Type is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Appointment Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="inspection">Inspection</SelectItem>
                          <SelectItem value="meeting">Meeting</SelectItem>
                          <SelectItem value="delivery">Delivery</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the type of appointment you're scheduling
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  rules={{ required: "Location is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="e.g., Farm at Village Sundarpur or APMC Market, Mumbai" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Add any additional details about this appointment..." 
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
                    onClick={() => navigate("/appointments")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Schedule Appointment
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </MainLayout>
    </AuthGuard>
  );
}
