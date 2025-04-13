
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { GuestGuard } from "@/components/auth/GuestGuard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("farmer");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }
    
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await signup(name, email, password, role);
      if (success) {
        if (role === "farmer") {
          navigate("/profile/farmer");
        } else {
          navigate("/profile/trader");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GuestGuard>
      <div className="min-h-screen flex items-center justify-center bg-muted/20 py-6 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-2">
              <div className="bg-primary/10 p-2 rounded-full">
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">मंडी कनेक्ट - Mandi Connect</CardTitle>
            <CardDescription>
              Create your account to start trading
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  className="input-large"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="input-large"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-base">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  className="input-large"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Password must be at least 8 characters long
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-base">
                  Confirm Password
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm your password"
                  className="input-large"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {passwordError && (
                  <p className="text-sm text-red-500">{passwordError}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-base">I am registering as</Label>
                <RadioGroup
                  className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2"
                  defaultValue="farmer"
                  value={role}
                  onValueChange={(value) => setRole(value as UserRole)}
                  required
                >
                  <div>
                    <RadioGroupItem
                      value="farmer"
                      id="farmer"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="farmer"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <span className="text-base">Farmer</span>
                      <span className="text-sm text-muted-foreground">
                        I want to sell my produce
                      </span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="trader"
                      id="trader"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="trader"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <span className="text-base">Trader</span>
                      <span className="text-sm text-muted-foreground">
                        I want to buy produce
                      </span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button
                type="submit"
                className="w-full btn-large mb-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader className="mr-2" size="sm" /> : null}
                Create Account
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </GuestGuard>
  );
}
