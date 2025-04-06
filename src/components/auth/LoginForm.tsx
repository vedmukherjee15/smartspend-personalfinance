
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface LoginFormProps {
  onLoginSuccess: () => void;
}

const USERS = {
  "admin": "password123",
  "user": "mypassword"
};

const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (username in USERS && USERS[username as keyof typeof USERS] === password) {
        toast.success(`Welcome back, ${username}!`);
        localStorage.setItem("authenticated", "true");
        localStorage.setItem("user", username);
        onLoginSuccess();
        navigate("/");
      } else {
        toast.error("Invalid username or password");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <BarChart3 className="h-12 w-12 text-finance-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">SmartSpend</CardTitle>
          <CardDescription>Master your money. Master your life.</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Username"
                  className="pl-10"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  type="password"
                  placeholder="Password"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full bg-finance-primary hover:bg-finance-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log in"}
            </Button>
          </CardFooter>
        </form>
        <div className="p-4 text-center text-sm text-muted-foreground">
          <p>Try with: admin / password123</p>
        </div>
      </Card>
    </div>
  );
};

export default LoginForm;
