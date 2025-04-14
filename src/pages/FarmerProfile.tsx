
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import DashboardSidebar from '@/components/DashboardSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, CheckCheck, Copy, File, FilePlus, ImagePlus, Loader2, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from '@/lib/utils';
import { Document } from '@/types/document';
import { safeTableOperation } from '@/utils/safeTableUtil';

const FarmerProfile = () => {
  const navigate = useNavigate();
  const { user, profile, updateProfile } = useAuth();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile?.name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [address, setAddress] = useState(profile?.address || '');
  const [city, setCity] = useState(profile?.city || '');
  const [state, setState] = useState(profile?.state || '');
  const [pincode, setPincode] = useState(profile?.pincode || '');

  const [documents, setDocuments] = useState<Document[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [newDocument, setNewDocument] = useState({
    name: '',
    type: '',
    url: ''
  });

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setPhone(profile.phone || '');
      setAddress(profile.address || '');
      setCity(profile.city || '');
      setState(profile.state || '');
      setPincode(profile.pincode || '');
    }
  }, [profile]);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!profile?.id) return;
    
      try {
        setLoadingDocs(true);
        // @ts-ignore - Using safeTableOperation for documents
        const { data, error } = await safeTableOperation<Document>('documents')
          .select('*')
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        // @ts-ignore - Safe type cast
        setDocuments(data || []);
      } catch (error) {
        console.error('Error fetching documents:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your documents',
          variant: 'destructive'
        });
      } finally {
        setLoadingDocs(false);
      }
    };

    fetchDocuments();
  }, [profile?.id]);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setName(profile?.name || '');
    setPhone(profile?.phone || '');
    setAddress(profile?.address || '');
    setCity(profile?.city || '');
    setState(profile?.state || '');
    setPincode(profile?.pincode || '');
  };

  const handleSaveProfile = async () => {
    try {
      if (!user || !profile) return;

      // @ts-ignore - Using safeTableOperation for profiles
      const { error } = await safeTableOperation('profiles')
        .update({
          name: name,
          phone: phone,
          address: address,
          city: city,
          state: state,
          pincode: pincode
        })
        .eq('id', profile.id);

      if (error) throw error;

      updateProfile({
        ...profile,
        name: name,
        phone: phone,
        address: address,
        city: city,
        state: state,
        pincode: pincode
      });

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      });
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setIsCalendarOpen(false);
  };

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocument.name || !newDocument.url || !newDocument.type) {
      toast({
        title: 'Missing Information',
        description: 'Please fill out all fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      setUploadingDoc(true);
      // @ts-ignore - Using safeTableOperation for documents
      const { error } = await safeTableOperation('documents')
        .insert({
          user_id: profile?.id,
          name: newDocument.name,
          type: newDocument.type,
          url: newDocument.url,
          size: 0
        });

      if (error) throw error;
      
      setNewDocument({
        name: '',
        type: '',
        url: ''
      });
      
      // @ts-ignore - Using safeTableOperation for documents
      const { data: updatedDocs, error: fetchError } = await safeTableOperation<Document>('documents')
        .select('*')
        .eq('user_id', profile?.id)
        .order('created_at', { ascending: false });
        
      if (fetchError) throw fetchError;
      
      // @ts-ignore - Safe type cast
      setDocuments(updatedDocs || []);
      
      toast({
        title: 'Document Uploaded',
        description: 'Your document has been uploaded successfully',
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload document. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      setLoadingDocs(true);
      // @ts-ignore - Using safeTableOperation for documents
      const { error } = await safeTableOperation('documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;

      // @ts-ignore - Using safeTableOperation for documents
      const { data: updatedDocs, error: fetchError } = await safeTableOperation<Document>('documents')
        .select('*')
        .eq('user_id', profile?.id)
        .order('created_at', { ascending: false });
        
      if (fetchError) throw fetchError;
      
      // @ts-ignore - Safe type cast
      setDocuments(updatedDocs || []);

      toast({
        title: 'Document Deleted',
        description: 'The document has been deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: 'Deletion Failed',
        description: 'Failed to delete document. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoadingDocs(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar userRole="farmer" />
      <main className="flex-1 p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Profile</h1>
          {profile && (
            <Avatar className="h-12 w-12">
              <AvatarImage src={`https://avatar.vercel.sh/${profile.name}.png`} />
              <AvatarFallback>{profile.name?.charAt(0)}</AvatarFallback>
            </Avatar>
          )}
        </div>

        {isEditing ? (
          <Card className="space-y-4">
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <div className="flex justify-end space-x-2 p-6">
              <Button variant="ghost" onClick={handleCancelEdit}>Cancel</Button>
              <Button onClick={handleSaveProfile}>Save</Button>
            </div>
          </Card>
        ) : (
          <Card className="space-y-4">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>View your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <div className="text-lg font-semibold">{name}</div>
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <div>{phone}</div>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <div>{address}</div>
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <div>{city}</div>
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <div>{state}</div>
              </div>
              <div className="space-y-2">
                <Label>Pincode</Label>
                <div>{pincode}</div>
              </div>
            </CardContent>
            <div className="flex justify-end p-6">
              <Button onClick={handleEditProfile}>Edit Profile</Button>
            </div>
          </Card>
        )}

        <Card className="space-y-4">
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription>Upload and manage your important documents</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUploadDocument} className="mb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="document_name">Document Name</Label>
                  <Input
                    id="document_name"
                    type="text"
                    value={newDocument.name}
                    onChange={(e) => setNewDocument(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="document_type">Document Type</Label>
                  <Select
                    onValueChange={(value) => setNewDocument(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ID">ID</SelectItem>
                      <SelectItem value="Address Proof">Address Proof</SelectItem>
                      <SelectItem value="Certification">Certification</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="document_url">Document URL</Label>
                  <Input
                    id="document_url"
                    type="url"
                    value={newDocument.url}
                    onChange={(e) => setNewDocument(prev => ({ ...prev, url: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <Button type="submit" disabled={uploadingDoc}>
                {uploadingDoc ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FilePlus className="mr-2 h-4 w-4" />
                    Upload Document
                  </>
                )}
              </Button>
            </form>

            {loadingDocs ? (
              <div className="flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documents.map((doc) => (
                  <Card key={doc.id}>
                    <CardHeader>
                      <CardTitle>{doc.name}</CardTitle>
                      <CardDescription>{doc.type}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p>
                        URL: <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{doc.url}</a>
                      </p>
                      <p>Uploaded: {new Date(doc.created_at).toLocaleDateString()}</p>
                    </CardContent>
                    <div className="flex justify-end space-x-2 p-6">
                      <Button variant="destructive" onClick={() => handleDeleteDocument(doc.id)} disabled={loadingDocs}>
                        {loadingDocs ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="space-y-4">
          <CardHeader>
            <CardTitle>Schedule Appointment</CardTitle>
            <CardDescription>Select a date for your next appointment</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) =>
                    date < new Date()
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default FarmerProfile;
