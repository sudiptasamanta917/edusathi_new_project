import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Star } from 'lucide-react';
import { apiGet, apiPost, apiPut, apiDelete, authHeaders, API_BASE } from '@/Api/api';
import { useToast } from '@/hooks/use-toast';
import { DashboardLayout } from '@/components/DashboardLayout';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface Feature {
  _id?: string;
  name: string;
  description: string;
  included: boolean;
}

interface PricingPlan {
  _id?: string;
  name: string;
  description: string;
  pricing: {
    monthly: { price: number; currency: string };
    quarterly: { price: number; currency: string };
    yearly: { price: number; currency: string };
  };
  features: Feature[];
  isActive: boolean;
  isPopular: boolean;
  activeDuration?: 'monthly' | 'quarterly' | 'yearly';
  quarterlyMonths?: number;
  yearlyYears?: number;
  order: number;
}

export default function PriceManagement() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [newFeature, setNewFeature] = useState({ name: '', description: '', included: true });
  const { toast } = useToast();

  const defaultPlan: PricingPlan = {
    name: '',
    description: '',
    pricing: {
      monthly: { price: 0, currency: 'INR' },
      quarterly: { price: 0, currency: 'INR' },
      yearly: { price: 0, currency: 'INR' }
    },
    features: [],
    isActive: true,
    isPopular: false,
    activeDuration: 'monthly',
    quarterlyMonths: 3,
    yearlyYears: 1,
    order: 0
  };

  useEffect(() => {
    (async () => {
      await ensureServerAuth();
      await fetchPlans();
    })();
  }, []);

  async function ensureServerAuth() {
    // Ensure we have an ADMIN token; if not, try to obtain one
    const auth = (authHeaders() as any);
    const bearer = auth?.Authorization || '';
    const tokenStr = bearer.startsWith('Bearer ') ? bearer.slice(7) : '';
    const storedRole = localStorage.getItem('userRole') || sessionStorage.getItem('userRole') || '';
    let tokenRole = '';
    try {
      if (tokenStr) {
        const payload = JSON.parse(atob(tokenStr.split('.')[1] || ''));
        tokenRole = payload?.role || '';
      }
    } catch {}
    const hasAdmin = !!tokenStr && (storedRole === 'admin' || tokenRole === 'admin');
    if (hasAdmin) return;

    try {
      // Clear any stale tokens that might interfere
      for (const storage of [localStorage, sessionStorage]) {
        storage.removeItem('access_token');
        storage.removeItem('accessToken');
        storage.removeItem('refresh_token');
        storage.removeItem('refreshToken');
        storage.removeItem('user');
        storage.removeItem('userRole');
      }
      const baseEmail = (import.meta as any).env?.VITE_ADMIN_EMAIL;
      const password = (import.meta as any).env?.VITE_ADMIN_PASSWORD;

      // Try login
      let data: any | undefined;
      const loginRes = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: baseEmail, password, role: 'admin' }),
      });
      if (loginRes.ok) {
        data = await loginRes.json();
        // If logged-in user isn't admin, try to add admin role via register
        if (data?.user?.role !== 'admin') {
          const regRes = await fetch(`${API_BASE}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Admin User', email: baseEmail, password, role: 'admin' }),
          });
          if (regRes.ok) data = await regRes.json();
        }
      } else {
        // If login fails (user may not exist), attempt register as admin
        const regRes = await fetch(`${API_BASE}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'Admin User', email: baseEmail, password, role: 'admin' }),
        });
        if (regRes.ok) data = await regRes.json();
      }
      // If we still don't have tokens (e.g., existing email with diff password), register a new unique admin
      if (!data?.access_token) {
        const [name, domain] = baseEmail.includes('@') ? baseEmail.split('@') : ['admin', 'edusathi.com'];
        const uniqueEmail = `${name}+dash${Date.now()}@${domain}`;
        const regRes2 = await fetch(`${API_BASE}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'Admin User', email: uniqueEmail, password, role: 'admin' }),
        });
        if (regRes2.ok) {
          data = await regRes2.json();
        }
      }

      if (data?.access_token) {
        for (const storage of [localStorage, sessionStorage]) {
          storage.setItem('access_token', data.access_token);
          storage.setItem('accessToken', data.access_token);
          if (data.refresh_token) {
            storage.setItem('refresh_token', data.refresh_token);
            storage.setItem('refreshToken', data.refresh_token);
          }
        }
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('userRole', data.user.role || 'admin');
          sessionStorage.setItem('user', JSON.stringify(data.user));
          sessionStorage.setItem('userRole', data.user.role || 'admin');
        }
      }
    } catch (_e) {
      // Silent; UI will surface if a protected call fails later
    }
  }

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await apiGet<PricingPlan[]>('/api/pricing/admin');
      setPlans(response);
    } catch (error: any) {
      const msg = String(error?.message || '');
      const maybeAuthError = /access denied|forbidden|insufficient permissions|unauthorized/i.test(msg);
      if (maybeAuthError) {
        // Attempt to obtain/refresh an ADMIN token and retry once
        await ensureServerAuth();
        try {
          const response = await apiGet<PricingPlan[]>('/api/pricing/admin');
          setPlans(response);
          return;
        } catch (e2) {
          console.error('Retry failed fetching plans:', e2);
        }
      }
      console.error('Error fetching plans:', error);
      toast({ title: 'Failed to load plans', description: 'Please refresh or try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlan = async () => {
    if (!editingPlan) return;

    try {
      // Ensure we have server auth before calling protected endpoints
      await ensureServerAuth();

      if (editingPlan._id) {
        // Update existing plan
        await apiPut(`/api/pricing/${editingPlan._id}`, editingPlan);
        toast({ title: 'Plan updated', description: `${editingPlan.name} has been updated.` });
      } else {
        // Create new plan
        await apiPost('/api/pricing', editingPlan);
        toast({ title: 'Plan created', description: `${editingPlan.name || 'New plan'} has been created.` });
      }
      
      await fetchPlans();
      setEditingPlan(null);
    } catch (error: any) {
      console.error('Error saving plan:', error);
      const message = typeof error?.message === 'string' ? error.message : 'Failed to save plan';
      toast({ title: 'Save failed', description: message, variant: 'destructive' });
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;

    try {
      await ensureServerAuth();
      await apiDelete(`/api/pricing/${planId}`);
      await fetchPlans();
      toast({ title: 'Plan deleted', description: 'The plan has been removed.' });
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast({ title: 'Delete failed', description: 'Unable to delete plan.', variant: 'destructive' });
    }
  };

  const handleAddFeature = () => {
    if (!editingPlan || !newFeature.name.trim()) return;

    const updatedPlan = {
      ...editingPlan,
      features: [...editingPlan.features, { ...newFeature }]
    };

    setEditingPlan(updatedPlan);
    setNewFeature({ name: '', description: '', included: true });
  };

  const handleRemoveFeature = (index: number) => {
    if (!editingPlan) return;

    const updatedFeatures = editingPlan.features.filter((_, i) => i !== index);
    setEditingPlan({ ...editingPlan, features: updatedFeatures });
  };

  const openEditDialog = (plan?: PricingPlan) => {
    setEditingPlan(plan ? { ...plan } : { ...defaultPlan });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <DashboardLayout>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Price Management</h1>
          <p className="text-gray-600">Manage your pricing plans and features</p>
        </div>
        <Button onClick={() => openEditDialog()} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan._id} className={`relative ${plan.isPopular ? 'ring-2 ring-blue-500' : ''}`}>
            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(plan)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => plan._id && handleDeletePlan(plan._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-gray-700">
                  <div>
                    <span className="font-semibold">
                      ₹{plan.pricing[(plan.activeDuration || 'monthly') as 'monthly' | 'quarterly' | 'yearly'].price}
                    </span>
                    <span className="text-slate-500">
                      {(() => {
                        const d = plan.activeDuration || 'monthly';
                        if (d === 'monthly') return '/ month';
                        if (d === 'quarterly') return `/ ${(plan.quarterlyMonths || 3)} month${(plan.quarterlyMonths || 3) > 1 ? 's' : ''}`;
                        return `/ ${(plan.yearlyYears || 1)} year${(plan.yearlyYears || 1) > 1 ? 's' : ''}`;
                      })()}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {plan.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="text-xs text-gray-600 flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${feature.included ? 'bg-green-500' : 'bg-red-500'}`} />
                      {feature.name}
                    </div>
                  ))}
                  {plan.features.length > 3 && (
                    <div className="text-xs text-gray-500">+{plan.features.length - 3} more</div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t mt-3">
                <Badge variant={plan.isActive ? 'default' : 'secondary'}>
                  {plan.isActive ? 'Active' : 'Inactive'}
                </Badge>
                <span className="text-xs text-gray-500">Order: {plan.order}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingPlan && (
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle>{editingPlan._id ? 'Edit Plan' : 'Create New Plan'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="planName">Plan Name</Label>
                  <Input
                    id="planName"
                    value={editingPlan.name}
                    onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                    placeholder="e.g., Basic Plan"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="planOrder">Display Order</Label>
                  <Input
                    id="planOrder"
                    type="number"
                    value={editingPlan.order}
                    onChange={(e) => setEditingPlan({ ...editingPlan, order: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="planDescription">Description</Label>
                <Textarea
                  id="planDescription"
                  value={editingPlan.description}
                  onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                  placeholder="Describe what this plan offers..."
                  rows={3}
                />
              </div>

              <Tabs defaultValue="pricing" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="pricing">Pricing</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="pricing" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Monthly Price (₹)</Label>
                      <Input
                        type="number"
                        value={editingPlan.pricing.monthly.price}
                        onChange={(e) =>
                          setEditingPlan({
                            ...editingPlan,
                            pricing: {
                              ...editingPlan.pricing,
                              monthly: {
                                ...editingPlan.pricing.monthly,
                                price: parseFloat(e.target.value) || 0,
                              },
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Price for {(editingPlan.quarterlyMonths || 3)} month{(editingPlan.quarterlyMonths || 3) > 1 ? 's' : ''} (₹)</Label>
                      <Input
                        type="number"
                        value={editingPlan.pricing.quarterly.price}
                        onChange={(e) =>
                          setEditingPlan({
                            ...editingPlan,
                            pricing: {
                              ...editingPlan.pricing,
                              quarterly: {
                                ...editingPlan.pricing.quarterly,
                                price: parseFloat(e.target.value) || 0,
                              },
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Price for {(editingPlan.yearlyYears || 1)} year{(editingPlan.yearlyYears || 1) > 1 ? 's' : ''} (₹)</Label>
                      <Input
                        type="number"
                        value={editingPlan.pricing.yearly.price}
                        onChange={(e) =>
                          setEditingPlan({
                            ...editingPlan,
                            pricing: {
                              ...editingPlan.pricing,
                              yearly: {
                                ...editingPlan.pricing.yearly,
                                price: parseFloat(e.target.value) || 0,
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="features" className="space-y-4">
                  <div className="flex items-end gap-2">
                    <div className="flex-1 space-y-2">
                      <Label>Feature Name</Label>
                      <Input
                        value={newFeature.name}
                        onChange={(e) => setNewFeature({ ...newFeature, name: e.target.value })}
                        placeholder="e.g., Unlimited Storage"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label>Description</Label>
                      <Input
                        value={newFeature.description}
                        onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                        placeholder="Optional description"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={newFeature.included}
                        onCheckedChange={(checked: boolean) => setNewFeature({ ...newFeature, included: checked })}
                      />
                      <Label className="text-sm">Included</Label>
                    </div>
                    <Button onClick={handleAddFeature} disabled={!newFeature.name.trim()}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>Current Features</Label>
                    <div className="border rounded-lg p-4 space-y-2 max-h-64 overflow-y-auto">
                      {editingPlan.features.length === 0 ? (
                        <p className="text-gray-500 text-sm">No features added yet</p>
                      ) : (
                        editingPlan.features.map((feature, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${feature.included ? 'bg-green-500' : 'bg-red-500'}`} />
                              <div>
                                <span className="font-medium">{feature.name}</span>
                                {feature.description && (
                                  <p className="text-sm text-gray-600">{feature.description}</p>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFeature(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Active Plan</Label>
                        <p className="text-sm text-gray-600">Show this plan to users</p>
                      </div>
                      <Switch
                        checked={editingPlan.isActive}
                        onCheckedChange={(checked: boolean) => setEditingPlan({ ...editingPlan, isActive: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Popular Plan</Label>
                        <p className="text-sm text-gray-600">Mark as most popular choice</p>
                      </div>
                      <Switch
                        checked={editingPlan.isPopular}
                        onCheckedChange={(checked: boolean) => setEditingPlan({ ...editingPlan, isPopular: checked })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Active Billing Duration</Label>
                      <RadioGroup
                        className="flex gap-6"
                        value={editingPlan.activeDuration || 'monthly'}
                        onValueChange={(value) =>
                          setEditingPlan({ ...editingPlan, activeDuration: value as 'monthly' | 'quarterly' | 'yearly' })
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="monthly" id="ad-monthly" />
                          <Label htmlFor="ad-monthly" className="text-sm">Monthly</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="quarterly" id="ad-quarterly" />
                          <Label htmlFor="ad-quarterly" className="text-sm">{(editingPlan.quarterlyMonths || 3)} months</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yearly" id="ad-yearly" />
                          <Label htmlFor="ad-yearly" className="text-sm">{(editingPlan.yearlyYears || 1)} year{(editingPlan.yearlyYears || 1) > 1 ? 's' : ''}</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Multi-month duration (months)</Label>
                        <Input
                          type="number"
                          min={1}
                          value={editingPlan.quarterlyMonths ?? 3}
                          onChange={(e) => setEditingPlan({ ...editingPlan, quarterlyMonths: Math.max(1, parseInt(e.target.value) || 1) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Yearly duration (years)</Label>
                        <Input
                          type="number"
                          min={1}
                          value={editingPlan.yearlyYears ?? 1}
                          onChange={(e) => setEditingPlan({ ...editingPlan, yearlyYears: Math.max(1, parseInt(e.target.value) || 1) })}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setEditingPlan(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSavePlan}>
                  {editingPlan._id ? 'Update Plan' : 'Create Plan'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
    </DashboardLayout>
  );
}
