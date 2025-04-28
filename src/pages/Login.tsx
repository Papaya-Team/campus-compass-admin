
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple validation - this would be replaced by Supabase auth
    if (email === "admin@example.com" && password === "password") {
      // Store a flag in localStorage to simulate authenticated state
      localStorage.setItem("isAuthenticated", "true");
      
      toast({
        title: "Login successful",
        description: "Welcome back to Campus Compass!",
      });
      
      navigate("/students");
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="mx-auto max-w-md w-full px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary">Campus Compass</h1>
          <p className="mt-2 text-muted-foreground">Online Tutoring Admin Portal</p>
        </div>
        
        <div className="rounded-lg border bg-card p-8 shadow-sm">
          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </div>
          </form>
          
          <div className="mt-6">
            <p className="text-center text-sm text-muted-foreground">
              <span className="block sm:inline">Demo credentials:</span>{" "}
              <span className="block sm:inline">Email: admin@example.com / Password: password</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
