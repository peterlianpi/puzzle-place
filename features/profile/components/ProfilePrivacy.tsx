import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Shield, Download, Eye, EyeOff, Database, Trash2 } from "lucide-react";

import { toast } from "sonner";
import { client } from "@/lib/api/hono-client";
import { useGetProfile } from "../api/use-get-profile";
import { useUpdateProfile } from "../api/use-update-profile";

interface ProfilePrivacyProps {
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  isCurrentUser: boolean;
}

export function ProfilePrivacy({ user, isCurrentUser }: ProfilePrivacyProps) {
  const { data: profile, isLoading } = useGetProfile();
  const updateProfile = useUpdateProfile();

  if (!isCurrentUser) return null;

  const handlePrivacySettingChange = (key: string, value: boolean) => {
    updateProfile.mutate({ [key]: value });
  };

  const handleDataExport = async () => {
    try {
      const response = await client.api.profile["export"].$get();
      if (!response.ok) {
        throw new Error("Failed to export data");
      }
      const data = await response.json();

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `puzzle-place-data-${user.id}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Data export completed");
    } catch (error) {
      toast.error("Failed to export data");
    }
  };

  return (
    <div className="space-y-6">
      {/* Privacy Settings */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5 text-blue-600" />
            Privacy Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="profile-public"
              checked={Boolean(profile?.profile?.isProfilePublic ?? true)}
              onCheckedChange={(checked) =>
                typeof checked === "boolean" && handlePrivacySettingChange("isProfilePublic", checked)
              }
              disabled={isLoading || updateProfile.isPending}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="profile-public" className="text-base font-medium">
                Public Profile
              </Label>
              <p className="text-sm text-muted-foreground">
                Allow others to view your profile and activity
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-start space-x-3">
            <Checkbox
              id="show-email"
              checked={Boolean(profile?.profile?.showEmail ?? false)}
              onCheckedChange={(checked) =>
                typeof checked === "boolean" && handlePrivacySettingChange("showEmail", checked)
              }
              disabled={isLoading || updateProfile.isPending}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="show-email" className="text-base font-medium">
                Show Email Address
              </Label>
              <p className="text-sm text-muted-foreground">
                Display your email on your public profile
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-start space-x-3">
            <Checkbox
              id="show-stats"
              checked={Boolean(profile?.profile?.showStats ?? true)}
              onCheckedChange={(checked) =>
                typeof checked === "boolean" && handlePrivacySettingChange("showStats", checked)
              }
              disabled={isLoading || updateProfile.isPending}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="show-stats" className="text-base font-medium">
                Show Statistics
              </Label>
              <p className="text-sm text-muted-foreground">
                Display your gaming statistics on your profile
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-start space-x-3">
            <Checkbox
              id="show-activity"
              checked={Boolean(profile?.profile?.showActivity ?? true)}
              onCheckedChange={(checked) =>
                typeof checked === "boolean" && handlePrivacySettingChange("showActivity", checked)
              }
              disabled={isLoading || updateProfile.isPending}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="show-activity" className="text-base font-medium">
                Show Activity
              </Label>
              <p className="text-sm text-muted-foreground">
                Display your recent activity and achievements
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-start space-x-3">
            <Checkbox
              id="allow-export"
              checked={Boolean(profile?.profile?.allowDataExport ?? true)}
              onCheckedChange={(checked) =>
                typeof checked === "boolean" && handlePrivacySettingChange("allowDataExport", checked)
              }
              disabled={isLoading || updateProfile.isPending}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="allow-export" className="text-base font-medium">
                Allow Data Export
              </Label>
              <p className="text-sm text-muted-foreground">
                Enable data export functionality
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Database className="h-5 w-5 text-green-600" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-start gap-4">
              <Download className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1 space-y-2">
                <h4 className="font-medium">Export Your Data</h4>
                <p className="text-sm text-muted-foreground">
                  Download a copy of all your personal data, including profile
                  information and activity history.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDataExport}
                  disabled={!profile?.profile?.allowDataExport}
                  className="w-full sm:w-auto"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-4">
              <Eye className="h-5 w-5 text-orange-600 mt-0.5" />
              <div className="flex-1 space-y-2">
                <h4 className="font-medium">Data Retention</h4>
                <p className="text-sm text-muted-foreground">
                  Your data is retained according to our privacy policy. Contact
                  support to request data deletion.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                  onClick={() =>
                    toast.info(
                      "Contact support@puzzleplace.com for data deletion"
                    )
                  }
                >
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <EyeOff className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h4 className="font-medium text-amber-900 dark:text-amber-100">
                Privacy Information
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Your privacy settings control how your information is displayed
                and shared. Changes may take a few minutes to take effect across
                the platform.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
