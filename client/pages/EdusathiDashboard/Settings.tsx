import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Edit, Save, X } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
}

export default function Settings() {
  const { toast } = useToast();
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([
    {
      id: "1",
      name: "1 Year Plan",
      description: "Perfect for institutes starting their journey",
      price: 5000,
      features: ["From Control", "Home Page", "AI-Chatbot"],
    },
    {
      id: "2", 
      name: "3 Year Plan",
      description: "For institutes with medium-term commitment",
      price: 7000,
      features: ["From Control", "Home Page", "AI-Chatbot"],
    },
    {
      id: "3",
      name: "5 Year Plan", 
      description: "For institutes with long-term vision",
      price: 10000,
      features: ["From Control", "Home Page", "AI-Chatbot"],
    },
  ]);

  const [editForm, setEditForm] = useState<PricingPlan>({
    id: "",
    name: "",
    description: "",
    price: 0,
    features: [],
  });

  const handleEditPlan = (plan: PricingPlan) => {
    setEditingPlan(plan.id);
    setEditForm({ ...plan });
  };

  const handleSavePlan = () => {
    setPricingPlans(plans => 
      plans.map(plan => 
        plan.id === editForm.id ? editForm : plan
      )
    );
    setEditingPlan(null);
    toast({
      title: "Plan Updated",
      description: "Pricing plan has been updated successfully.",
    });
  };

  const handleCancelEdit = () => {
    setEditingPlan(null);
    setEditForm({ id: "", name: "", description: "", price: 0, features: [] });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...editForm.features];
    newFeatures[index] = value;
    setEditForm({ ...editForm, features: newFeatures });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and application preferences.</p>

      {/* Pricing Plans Management */}
      <Card className="transition-shadow duration-200 hover:shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Pricing Plans Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Edit your pricing plans that appear on the pricing page.
          </p>
          
          <div className="grid gap-4">
            {pricingPlans.map((plan) => (
              <Card key={plan.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  {editingPlan === plan.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="planName">Plan Name</Label>
                          <Input
                            id="planName"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="planPrice">Price (₹)</Label>
                          <Input
                            id="planPrice"
                            type="number"
                            value={editForm.price}
                            onChange={(e) => setEditForm({ ...editForm, price: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="planDescription">Description</Label>
                        <Textarea
                          id="planDescription"
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label>Features</Label>
                        <div className="space-y-2 mt-2">
                          {editForm.features.map((feature, index) => (
                            <Input
                              key={index}
                              value={feature}
                              onChange={(e) => handleFeatureChange(index, e.target.value)}
                              placeholder={`Feature ${index + 1}`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={handleSavePlan} size="sm">
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button onClick={handleCancelEdit} variant="outline" size="sm">
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{plan.name}</h3>
                          <Badge variant="secondary">₹{plan.price}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {plan.features.map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button
                        onClick={() => handleEditPlan(plan)}
                        variant="outline"
                        size="sm"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Separator />

      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="transition-shadow duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle></CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            
          </CardContent>
        </Card>

        <Card className="transition-shadow duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle></CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            
          </CardContent>
        </Card>

        <Card className="transition-shadow duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle></CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            
          </CardContent>
        </Card>

        <Card className="transition-shadow duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle></CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            
          </CardContent>
        </Card>
      </div>
      </div>
    </DashboardLayout>
  );
}