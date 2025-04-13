
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Filter, Plus, Search, Timer } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { LoadingOverlay } from "@/components/ui/loader";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function Appointments() {
  const { user } = useAuth();
  const { getMyAppointments, isLoading } = useData();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  
  // Get all appointments for the current user
  const appointments = getMyAppointments();
  
  // Filter appointments based on search term and filters
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      searchTerm === "" || 
      appointment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = 
      statusFilter === "" || 
      appointment.status === statusFilter;
      
    const matchesType = 
      typeFilter === "" || 
      appointment.type === typeFilter;
      
    return matchesSearch && matchesStatus && matchesType;
  });
  
  // Sort appointments by date (nearest first)
  const sortedAppointments = [...filteredAppointments].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Group appointments by date
  const appointmentsByDate: Record<string, typeof filteredAppointments> = {};
  
  sortedAppointments.forEach(appointment => {
    if (!appointmentsByDate[appointment.date]) {
      appointmentsByDate[appointment.date] = [];
    }
    appointmentsByDate[appointment.date].push(appointment);
  });
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };
  
  // Check if a date is today
  const isToday = (dateString: string) => {
    const today = new Date();
    const date = new Date(dateString);
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  
  return (
    <AuthGuard allowedRoles={["farmer", "trader", "admin"]}>
      <MainLayout>
        {isLoading && <LoadingOverlay />}
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
            <p className="text-muted-foreground">
              View and manage your appointments
            </p>
          </div>
          <Button 
            className="mt-4 md:mt-0" 
            onClick={() => navigate("/appointments/add")}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
        </div>
        
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Appointment Filters</CardTitle>
            <CardDescription>Find appointments by title, type, or status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-9"
                />
              </div>
              
              <div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Filter by Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    <SelectItem value="inspection">Inspection</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="delivery">Delivery</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="canceled">Canceled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                variant="outline" 
                className="h-9"
                onClick={() => {
                  setSearchTerm("");
                  setTypeFilter("");
                  setStatusFilter("");
                }}
              >
                <Filter className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {Object.keys(appointmentsByDate).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(appointmentsByDate).map(([date, appointments]) => (
              <Card key={date}>
                <CardHeader className="pb-3">
                  <div className="flex items-center">
                    <CardTitle className="text-lg">
                      {isToday(date) ? "Today" : formatDate(date)}
                    </CardTitle>
                    {isToday(date) && (
                      <Badge className="ml-2 bg-primary">Today</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {appointments.map((appointment, i) => (
                      <div key={appointment.id}>
                        {i > 0 && <Separator className="my-4" />}
                        <div 
                          className="cursor-pointer hover:bg-muted/40 -mx-6 px-6 py-2 rounded-md transition-colors"
                          onClick={() => navigate(`/appointments/${appointment.id}`)}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className="bg-primary/10 p-2 rounded">
                                <Calendar className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{appointment.title}</h3>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                  <span className="text-sm text-muted-foreground flex items-center">
                                    <Timer className="mr-1 h-3.5 w-3.5" />
                                    {appointment.time}
                                  </span>
                                  <StatusBadge status={appointment.status} />
                                  <Badge variant="outline" className="capitalize">
                                    {appointment.type}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              {user?.role === 'farmer' && appointment.traderName && (
                                <div className="text-sm">
                                  <span className="text-muted-foreground">Trader: </span>
                                  {appointment.traderName}
                                </div>
                              )}
                              {user?.role === 'trader' && appointment.farmerName && (
                                <div className="text-sm">
                                  <span className="text-muted-foreground">Farmer: </span>
                                  {appointment.farmerName}
                                </div>
                              )}
                              {appointment.location && (
                                <div className="text-sm text-muted-foreground mt-1">
                                  At {appointment.location}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {appointment.description && (
                            <div className="mt-2 ml-14 text-sm text-muted-foreground">
                              {appointment.description}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="mx-auto rounded-full bg-muted w-12 h-12 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No appointments found</h3>
              <p className="text-muted-foreground mb-4">
                {appointments.length > 0 
                  ? "Try changing your filters to see more appointments" 
                  : "You don't have any appointments scheduled"}
              </p>
              <Button onClick={() => navigate("/appointments/add")}>
                <Plus className="mr-2 h-4 w-4" />
                Schedule New Appointment
              </Button>
            </CardContent>
          </Card>
        )}
      </MainLayout>
    </AuthGuard>
  );
}
