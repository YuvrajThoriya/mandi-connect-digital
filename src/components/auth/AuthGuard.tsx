
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { FullPageLoader } from "@/components/ui/loader";
import { toast } from "sonner";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireVerification?: boolean;
  redirectTo?: string;
}

export function AuthGuard({
  children,
  allowedRoles,
  requireVerification = false,
  redirectTo = "/login"
}: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        toast.error("Please login to access this page");
        navigate(redirectTo, { replace: true });
        return;
      }

      if (allowedRoles && !allowedRoles.includes(user.role)) {
        toast.error("You do not have permission to access this page");
        navigate("/", { replace: true });
        return;
      }

      if (requireVerification && !user.isVerified) {
        toast.error("Your account needs verification to access this page");
        navigate("/profile/verification", { replace: true });
        return;
      }
    }
  }, [user, isLoading, allowedRoles, requireVerification, navigate, redirectTo]);

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (!user || (allowedRoles && !allowedRoles.includes(user.role)) || (requireVerification && !user.isVerified)) {
    return null;
  }

  return <>{children}</>;
}
