
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Settings, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NotificationsModule } from '@/components/NotificationsModule';
import { useAuth } from '@/context/AuthContext';

interface DashboardHeaderProps {
  title: string;
  userName: string;
  userRole: 'farmer' | 'trader';
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, userName, userRole }) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const getUserInitials = () => {
    if (!userName) return 'U';
    return userName.split(' ').map((n) => n[0]).join('').toUpperCase();
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const roleColor = userRole === 'farmer' ? 'text-green-600' : 'text-blue-600';

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex items-center gap-4">
        <NotificationsModule />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/avatar-placeholder.png" alt={userName} />
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{userName}</p>
                <p className={`text-xs font-medium ${roleColor}`}>
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate(`/${userRole}/profile`)}>
              <UserCircle className="mr-2 h-4 w-4" />
              <span>My Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/${userRole}/settings`)}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default DashboardHeader;
