import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, Lock, User, Eye, EyeOff } from 'lucide-react';

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Static login credentials
  const staticCredentials = {
    email: 'admin@edusathi.com',
    password: 'edusathi2025'
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      if (email === staticCredentials.email && password === staticCredentials.password) {
        toast({
          title: 'Success!',
          description: 'Welcome to Edusathi Dashboard',
        });
        
        // Store login state
        localStorage.setItem('edusathi_logged_in', 'true');
        localStorage.setItem('edusathi_user', JSON.stringify({
          email: email,
          name: 'Admin User',
          role: 'Administrator'
        }));
        
        onOpenChange(false);
        navigate('/dashboard');
      } else {
        toast({
          title: 'Login Failed',
          description: 'Invalid email or password. Try admin@edusathi.com / edusathi2025',
          variant: 'destructive',
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const fillDemoCredentials = () => {
    setEmail(staticCredentials.email);
    setPassword(staticCredentials.password);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <GraduationCap className="h-6 w-6" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold">Welcome to Edusathi</DialogTitle>
          <DialogDescription>
            Sign in to access your dashboard
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleLogin} className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-slate-50 rounded-lg border">
          <h4 className="text-sm font-medium text-slate-900 mb-2">Demo Credentials:</h4>
          <div className="text-sm text-slate-600 space-y-1">
            <p><strong>Email:</strong> admin@edusathi.com</p>
            <p><strong>Password:</strong> edusathi2025</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fillDemoCredentials}
            className="mt-3 w-full"
          >
            Fill Demo Credentials
          </Button>
        </div>

        <div className="text-center text-sm text-slate-600 mt-4">
          Don't have an account?{' '}
          <button className="text-blue-600 hover:text-blue-800 font-medium">
            Sign up for free
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
