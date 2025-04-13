
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { FullPageLoader } from "@/components/ui/loader";

interface GuestGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function GuestGuard({
  children,
  redirectTo = "/"
}: GuestGuardProps) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      // Redirect based on user role
      if (user.role === 'farmer') {
        navigate('/farmer/dashboard', { replace: true });
      } else if (user.role === 'trader') {
        navigate('/trader/dashboard', { replace: true });
      } else {
        navigate(redirectTo, { replace: true });
      }
    }
  }, [user, isLoading, navigate, redirectTo]);

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (user) {
    return null;
  }

  return <>{children}</>;
}
