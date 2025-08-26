import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Building, Globe, Link as LinkIcon, Shield } from "lucide-react";
import { CentersAPI } from "@/Api/api";

// Local type replacing missing @shared/api
type CreateCenterRequest = {
  name: string;
  domain: string;
  website: string;
  superAdminPath: string;
};

const createSubCenterSchema = z.object({
  name: z
    .string()
    .min(1, "Sub center name is required")
    .min(2, "Sub center name must be at least 2 characters"),
  domain: z
    .string()
    .min(1, "Domain name is required")
    .regex(
      /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid domain (e.g., example.com)",
    ),
  website: z
    .string()
    .min(1, "Website is required")
    .url("Please enter a valid URL"),
  superAdminPath: z
    .string()
    .min(1, "Super Admin Path is required")
    .regex(/^\//, "Path must start with /"),
});

type CreateSubCenterForm = z.infer<typeof createSubCenterSchema>;

export default function CreateCenter() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<CreateSubCenterForm>({
    resolver: zodResolver(createSubCenterSchema),
    defaultValues: {
      name: "",
      domain: "",
      website: "",
      superAdminPath: "/admin",
    },
  });

  const onSubmit = async (data: CreateSubCenterForm) => {
    setIsSubmitting(true);
    try {
      await CentersAPI.create(data as CreateCenterRequest);

      toast({
        title: "Success!",
        description: "Sub center created successfully.",
      });

      form.reset();
    } catch (error) {
      console.error("Error creating sub center:", error);
      toast({
        title: "Error",
        description: "Failed to create sub center. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Add Sub Center</h2>
          <p className="text-muted-foreground">
            Add a new educational sub center to your dashboard
          </p>
        </div>

        {/* Form Card */}
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Center Information
            </CardTitle>
            <CardDescription>
              Fill out the form below to create a new educational center
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Center Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        Name of Center
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter center name" {...field} />
                      </FormControl>
                      <FormDescription>
                        The display name for your educational center
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Domain Name */}
                <FormField
                  control={form.control}
                  name="domain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Domain Name of Center
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="example.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        The domain name where your center will be accessible
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Website */}
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <LinkIcon className="h-4 w-4" />
                        Website
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        The full website URL for your educational center
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Super Admin Path */}
                <FormField
                  control={form.control}
                  name="superAdminPath"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Super Admin Path
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="/admin" {...field} />
                      </FormControl>
                      <FormDescription>
                        The path to access the super admin panel (must start
                        with /)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating Center..." : "Create Center"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
