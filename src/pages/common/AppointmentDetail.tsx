
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Check, 
  X,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { LoadingOverlay } from "@/components/ui/loader";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AppointmentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getMyAppointments, updateAppointmentStatus, isLoading } = useData();
  
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  
  // Get appointment details
  const appointments = getMyAppointments();
  const appointment = appointments.find(appointment => appointment.id === id);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };
  
  // Check if appointment is today
  const isToday = (dateString: string) => {
    const today = new Date();
    const date = new Date(dateString);
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  
  // Check if appointment is in the past
  const isPast = (dateString: string) => {
    const today = new Date();
    const date = new Date(dateString);
    return date < today;
  };
  
  // Handle status updates
  const handleUpdateStatus = async (status: 'confirmed' | 'completed' | 'canceled') => {
    if (!id) return;
    
    try {
      await updateAppointmentStatus(id, status);
      setConfirmDialogOpen(false);
      setCancelDialogOpen(false);
      setCompleteDialogOpen(false);
    } catch (error) {
      console.error(`Failed to update appointment status to ${status}:`, error);
    }
  };
  
  if (!appointment) {
    return (
      <AuthGuard allowedRoles={["farmer", "trader", "admin"]}>
        <MainLayout>
          <div className="py-12 text-center">
            <div className="mb-4 text-muted-foreground">Appointment not found</div>
            <Button onClick={() => navigate("/appointments")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Appointments
            </Button>
          </div>
        </MainLayout>
      </AuthGuard>
    );
  }
  
  const isCreator = user?.id === appointment.createdBy;
  
  return (
    <AuthGuard allowedRoles={["farmer", "trader", "admin"]}>
      <MainLayout>
        {isLoading && <LoadingOverlay />}
        
        {/* Header with breadcrumb and actions */}
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
              <span>Appointment Details</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{appointment.title}</h1>
          </div>
          <Button 
            variant="outline"
            onClick={() => navigate("/appointments")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Appointments
          </Button>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle>Appointment Details</CardTitle>
                    <CardDescription>
                      {isToday(appointment.date) 
                        ? "This appointment is scheduled for today" 
                        : isPast(appointment.date)
                          ? "This appointment was scheduled in the past"
                          : "Upcoming appointment"}
                    </CardDescription>
                  </div>
                  <StatusBadge status={appointment.status} className="text-base px-3 py-1" />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Date</div>
                      <div className="font-medium">
                        {formatDate(appointment.date)}
                        {isToday(appointment.date) && (
                          <Badge className="ml-2 bg-primary">Today</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Time</div>
                      <div className="font-medium">
                        {appointment.time}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded">
                      <Badge className="h-5 w-5 bg-transparent text-primary border-0 p-0 capitalize">
                        {appointment.type}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Type</div>
                      <div className="font-medium capitalize">
                        {appointment.type}
                      </div>
                    </div>
                  </div>
                </div>
                
                {appointment.location && (
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Location</div>
                      <div className="font-medium">{appointment.location}</div>
                    </div>
                  </div>
                )}
                
                {appointment.description && (
                  <div className="border-t pt-6">
                    <div className="text-sm text-muted-foreground mb-2">Description</div>
                    <div className="whitespace-pre-line">{appointment.description}</div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Participant Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  {appointment.farmerName && (
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Farmer</div>
                        <div className="font-medium">{appointment.farmerName}</div>
                      </div>
                    </div>
                  )}
                  
                  {appointment.traderName && (
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Trader</div>
                        <div className="font-medium">{appointment.traderName}</div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="text-sm text-muted-foreground pt-2">
                  <div>
                    Created on {new Date(appointment.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                  <div>
                    {isCreator ? "You created this appointment" : "This appointment was created for you"}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar - Status & Actions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>
                  Manage this appointment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {appointment.status === 'pending' && (
                  <>
                    <Button 
                      className="w-full"
                      onClick={() => setConfirmDialogOpen(true)}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Confirm Appointment
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="w-full"
                      onClick={() => setCancelDialogOpen(true)}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Decline Appointment
                    </Button>
                  </>
                )}
                
                {appointment.status === 'confirmed' && !isPast(appointment.date) && (
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => setCancelDialogOpen(true)}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel Appointment
                  </Button>
                )}
                
                {appointment.status === 'confirmed' && isPast(appointment.date) && (
                  <Button 
                    className="w-full"
                    onClick={() => setCompleteDialogOpen(true)}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Mark as Completed
                  </Button>
                )}
                
                {appointment.status === 'canceled' && (
                  <div className="bg-destructive/10 text-destructive p-4 rounded-md flex items-start gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <div>
                      <h4 className="font-medium">This appointment was canceled</h4>
                      <p className="text-sm">
                        You can create a new appointment if you need to reschedule.
                      </p>
                    </div>
                  </div>
                )}
                
                {appointment.status === 'completed' && (
                  <div className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 p-4 rounded-md flex items-start gap-2">
                    <Check className="h-5 w-5" />
                    <div>
                      <h4 className="font-medium">This appointment was completed</h4>
                      <p className="text-sm">
                        The appointment has been marked as completed.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Confirm Dialog */}
        <AlertDialog 
          open={confirmDialogOpen} 
          onOpenChange={setConfirmDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Appointment</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to confirm this appointment? The other party will be notified.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleUpdateStatus('confirmed')}>
                Confirm Appointment
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        {/* Cancel Dialog */}
        <AlertDialog 
          open={cancelDialogOpen} 
          onOpenChange={setCancelDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel this appointment? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => handleUpdateStatus('canceled')}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Yes, Cancel
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        {/* Complete Dialog */}
        <AlertDialog 
          open={completeDialogOpen} 
          onOpenChange={setCompleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Mark as Completed</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to mark this appointment as completed?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleUpdateStatus('completed')}>
                Mark as Completed
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </MainLayout>
    </AuthGuard>
  );
}
