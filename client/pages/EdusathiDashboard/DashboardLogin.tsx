import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, Lock, User, Eye, EyeOff } from 'lucide-react';
import { AuthAPI } from '@/Api/api';

export default function DashboardLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Static login credentials from environment variables
  const staticCredentials = {
    email: import.meta.env.VITE_ADMIN_EMAIL || 'admin@edusathi.com',
    password: import.meta.env.VITE_ADMIN_PASSWORD || 'edusathi2025'
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(async () => {
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
        // Also try to obtain backend JWT for admin APIs (pricing management, etc.)
        try {
          // Try login first
          let data: any | undefined;
          try {
            data = await AuthAPI.login({ email, password, role: 'admin' });
            if (data?.user?.role !== 'admin') {
              data = await AuthAPI.register({ name: 'Admin User', email, password, role: 'admin' });
            }
          } catch (_e) {
            // If login fails (user may not exist), attempt register as admin
            try {
              data = await AuthAPI.register({ name: 'Admin User', email, password, role: 'admin' });
            } catch (_e2) {
              data = undefined;
            }
          }
          if (data?.access_token) {
            // Persist tokens for api.ts to pick up
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token || '');
            localStorage.setItem('accessToken', data.access_token);
            localStorage.setItem('refreshToken', data.refresh_token || '');
            if (data.user) {
              localStorage.setItem('user', JSON.stringify(data.user));
              localStorage.setItem('userRole', data.user.role || 'admin');
            }
          }
        } catch (_err) {
          // Non-blocking: continue with dashboard even if server auth fails
        }
        
        navigate('/dashboard/overview');
      } else {
        toast({
          title: 'Login Failed',
          description: 'Invalid email or password. Please check your credentials.',
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <GraduationCap className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Dashboard Login</CardTitle>
          <CardDescription>
            Sign in to access the Edusathi admin dashboard
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
              {isLoading ? 'Signing in...' : 'Sign In to Dashboard'}
            </Button>
          </form>


          <div className="text-center text-sm text-slate-600 mt-4">
            <button 
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Home
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
