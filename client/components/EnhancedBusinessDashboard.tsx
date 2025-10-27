import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  Users,
  GraduationCap,
  DollarSign,
  Calendar,
  Bell,
  Settings,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Award,
  Target,
  Zap,
  Clock,
  BookOpen,
  MessageSquare,
  Globe,
  Shield,
  Sparkles,
  ChevronRight,
  Eye,
  Download,
  Share
} from "lucide-react";
import { Link } from "react-router-dom";

export default function EnhancedBusinessDashboard() {
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

  // Enhanced mock data with realistic values
  const dashboardStats = [
    {
      title: "Total Revenue",
      value: "₹2,45,680",
      change: "+12.5%",
      trend: "up",
      icon: <DollarSign className="w-6 h-6" />,
      color: "emerald",
      subtext: "This month"
    },
    {
      title: "Active Students",
      value: "1,247",
      change: "+8.2%",
      trend: "up", 
      icon: <Users className="w-6 h-6" />,
      color: "blue",
      subtext: "Enrolled students"
    },
    {
      title: "Course Completion",
      value: "87.3%",
      change: "+3.1%",
      trend: "up",
      icon: <GraduationCap className="w-6 h-6" />,
      color: "purple",
      subtext: "Average rate"
    },
    {
      title: "Monthly Growth",
      value: "+15.8%",
      change: "+2.4%",
      trend: "up",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "orange",
      subtext: "vs last month"
    }
  ];

  const recentActivity = [
    {
      action: "New student enrolled",
      user: "Priya Sharma",
      time: "2 minutes ago",
      type: "enrollment",
      avatar: "/placeholder.svg"
    },
    {
      action: "Course completed",
      user: "Rajesh Kumar", 
      time: "15 minutes ago",
      type: "completion",
      avatar: "/placeholder.svg"
    },
    {
      action: "Payment received",
      user: "Sneha Patel",
      time: "1 hour ago", 
      type: "payment",
      avatar: "/placeholder.svg"
    },
    {
      action: "New review posted",
      user: "Amit Singh",
      time: "3 hours ago",
      type: "review", 
      avatar: "/placeholder.svg"
    }
  ];

  const enhancedTemplates = [
    {
      id: 1,
      name: "Modern Academy",
      description: "Professional design for academic institutions",
      preview: "/placeholder.svg",
      features: ["Responsive Design", "LMS Integration", "Student Portal", "Payment Gateway"],
      category: "Academic",
      color: "blue",
      gradient: "from-blue-500 to-cyan-500",
      popular: true,
      price: "₹15,999/year"
    },
    {
      id: 2, 
      name: "Tech Institute",
      description: "Perfect for coding bootcamps and tech courses",
      preview: "/placeholder.svg",
      features: ["Code Editor", "Project Showcase", "Mentor System", "Career Support"],
      category: "Technology",
      color: "purple",
      gradient: "from-purple-500 to-indigo-500",
      popular: false,
      price: "₹18,999/year"
    },
    {
      id: 3,
      name: "Creative Studio",
      description: "Ideal for art, design and creative courses",
      preview: "/placeholder.svg", 
      features: ["Portfolio Gallery", "Creative Tools", "Collaboration", "Showcase"],
      category: "Creative",
      color: "pink",
      gradient: "from-pink-500 to-rose-500",
      popular: false,
      price: "₹16,999/year"
    },
    {
      id: 4,
      name: "Business School",
      description: "Corporate training and business education",
      preview: "/placeholder.svg",
      features: ["Case Studies", "Networking", "Certifications", "Analytics"],
      category: "Business", 
      color: "emerald",
      gradient: "from-emerald-500 to-teal-500",
      popular: false,
      price: "₹22,999/year"
    }
  ];

  const quickActions = [
    {
      title: "Add New Course",
      description: "Create and publish a new course",
      icon: <Plus className="w-5 h-5" />,
      color: "blue",
      action: () => console.log("Add course")
    },
    {
      title: "Student Analytics", 
      description: "View detailed student reports",
      icon: <BarChart3 className="w-5 h-5" />,
      color: "purple",
      action: () => console.log("View analytics")
    },
    {
      title: "Manage Pricing",
      description: "Update course pricing and plans",
      icon: <DollarSign className="w-5 h-5" />,
      color: "emerald",
      action: () => console.log("Manage pricing")
    },
    {
      title: "Marketing Tools",
      description: "Promote your courses effectively",
      icon: <Sparkles className="w-5 h-5" />,
      color: "orange",
      action: () => console.log("Marketing")
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900/80">
      {/* Enhanced Header with Glassmorphism */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Business Dashboard</h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back, Admin</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        {/* Enhanced Stats Cards with Animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardStats.map((stat, index) => (
            <Card key={index} className="group relative overflow-hidden rounded-2xl border-0 shadow-lg hover:shadow-xl dark:shadow-slate-900/50 dark:hover:shadow-slate-900/70 transition-all duration-500 hover:scale-105 bg-white dark:bg-slate-800">
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-500/5 to-${stat.color}-600/10 dark:from-${stat.color}-400/10 dark:to-${stat.color}-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              <CardContent className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30 text-${stat.color}-600 dark:text-${stat.color}-400 group-hover:scale-110 transition-transform duration-300`}>
                    {stat.icon}
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${stat.trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {stat.change}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{stat.subtext}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Main Content with Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4 bg-white dark:bg-slate-800 rounded-xl p-1 shadow-lg">
            <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
            <TabsTrigger value="templates" className="rounded-lg">Templates</TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-lg">Analytics</TabsTrigger>
            <TabsTrigger value="settings" className="rounded-lg">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Quick Actions */}
              <div className="lg:col-span-1 space-y-6">
                <Card className="rounded-2xl border-0 shadow-lg dark:shadow-slate-900/50 bg-white dark:bg-slate-800">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">Quick Actions</CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400">Manage your institute efficiently</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {quickActions.map((action, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start h-auto p-4 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl group"
                        onClick={action.action}
                      >
                        <div className={`p-2 rounded-lg bg-${action.color}-100 dark:bg-${action.color}-900/30 text-${action.color}-600 dark:text-${action.color}-400 mr-3 group-hover:scale-110 transition-transform duration-300`}>
                          {action.icon}
                        </div>
                        <div className="text-left flex-1">
                          <p className="font-medium text-slate-900 dark:text-slate-100">{action.title}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{action.description}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                {/* Performance Summary */}
                <Card className="rounded-2xl border-0 shadow-lg dark:shadow-slate-900/50 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Target className="w-6 h-6" />
                      <h3 className="font-semibold">Monthly Goals</h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Revenue Target</span>
                          <span>78%</span>
                        </div>
                        <Progress value={78} className="h-2 bg-white/20" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Student Enrollment</span>
                          <span>92%</span>
                        </div>
                        <Progress value={92} className="h-2 bg-white/20" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <Card className="rounded-2xl border-0 shadow-lg dark:shadow-slate-900/50 bg-white dark:bg-slate-800">
                  <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">Recent Activity</CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400">Latest updates from your institute</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400">
                      View All
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={activity.avatar} />
                          <AvatarFallback>{activity.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            <span className="text-blue-600 dark:text-blue-400">{activity.user}</span> {activity.action}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{activity.time}</p>
                        </div>
                        <Badge variant={activity.type === 'payment' ? 'default' : 'secondary'} className="text-xs">
                          {activity.type}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Enhanced Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Choose Your Template</h2>
                <p className="text-slate-600 dark:text-slate-400">Select a professional template for your institute</p>
              </div>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Custom Template
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {enhancedTemplates.map((template) => (
                <Card key={template.id} className="group relative overflow-hidden rounded-2xl border-0 shadow-lg hover:shadow-2xl dark:shadow-slate-900/50 dark:hover:shadow-slate-900/70 transition-all duration-500 hover:scale-105 bg-white dark:bg-slate-800">
                  {template.popular && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                        <Star className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    </div>
                  )}
                  
                  {/* Template Preview */}
                  <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${template.gradient} opacity-20`}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-slate-600 dark:text-slate-300">
                        <Eye className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">Preview Available</p>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">{template.name}</h3>
                        <Badge variant="secondary" className={`text-${template.color}-600 dark:text-${template.color}-400 bg-${template.color}-100 dark:bg-${template.color}-900/30`}>
                          {template.category}
                        </Badge>
                      </div>
                      <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{template.price}</p>
                    </div>
                    
                    <p className="text-slate-600 dark:text-slate-400 mb-4">{template.description}</p>
                    
                    <div className="space-y-3 mb-4">
                      {template.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <div className={`w-1.5 h-1.5 rounded-full bg-${template.color}-500 dark:bg-${template.color}-400`}></div>
                          <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 hover:bg-slate-50 dark:hover:bg-slate-700"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      <Button 
                        size="sm" 
                        className={`flex-1 bg-gradient-to-r ${template.gradient} hover:opacity-90 text-white`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        {selectedTemplate === template.id ? 'Selected' : 'Choose'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="rounded-2xl border-0 shadow-lg dark:shadow-slate-900/50 bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-slate-100">Analytics Dashboard</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">Detailed insights and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-400">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4" />
                    <p>Analytics dashboard coming soon...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="rounded-2xl border-0 shadow-lg dark:shadow-slate-900/50 bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-slate-100">Institute Settings</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">Manage your institute configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-400">
                  <div className="text-center">
                    <Settings className="w-12 h-12 mx-auto mb-4" />
                    <p>Settings panel coming soon...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}