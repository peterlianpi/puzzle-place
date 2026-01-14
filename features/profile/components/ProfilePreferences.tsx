import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Palette, Globe, Bell, Monitor, Sun, Moon, Laptop } from "lucide-react";
import { useGetProfile } from "@/features/profile/api/use-get-profile";
import { useUpdateProfile } from "@/features/profile/api/use-update-profile";
import { useTheme } from "next-themes";

interface ProfilePreferencesProps {
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  isCurrentUser: boolean;
}

export function ProfilePreferences({
  user,
  isCurrentUser,
}: ProfilePreferencesProps) {
  const { data: profile, isLoading } = useGetProfile();
  const updateProfile = useUpdateProfile();
  const { theme, setTheme } = useTheme();

  if (!isCurrentUser) return null;

  const handleStringPreferenceChange = (
    key: keyof Pick<
      Parameters<typeof updateProfile.mutate>[0],
      "language" | "timezone"
    >,
    value: string | null
  ) => {
    if (value !== null) {
      updateProfile.mutate({ [key]: value });
    }
  };

  const handleBooleanPreferenceChange = (
    key: keyof Pick<
      Parameters<typeof updateProfile.mutate>[0],
      "marketingEmails" | "securityEmails"
    >,
    value: boolean
  ) => {
    updateProfile.mutate({ [key]: value });
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    updateProfile.mutate({ theme: newTheme });
  };

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "es", label: "Español" },
    { value: "fr", label: "Français" },
    { value: "de", label: "Deutsch" },
    { value: "it", label: "Italiano" },
    { value: "pt", label: "Português" },
    { value: "ja", label: "日本語" },
    { value: "ko", label: "한국어" },
    { value: "zh", label: "中文" },
  ];

  const timezoneOptions = [
    { value: "UTC", label: "UTC" },
    { value: "America/New_York", label: "Eastern Time" },
    { value: "America/Chicago", label: "Central Time" },
    { value: "America/Denver", label: "Mountain Time" },
    { value: "America/Los_Angeles", label: "Pacific Time" },
    { value: "Europe/London", label: "London" },
    { value: "Europe/Paris", label: "Paris" },
    { value: "Europe/Berlin", label: "Berlin" },
    { value: "Asia/Tokyo", label: "Tokyo" },
    { value: "Asia/Shanghai", label: "Shanghai" },
    { value: "Asia/Kolkata", label: "India" },
    { value: "Australia/Sydney", label: "Sydney" },
  ];

  return (
    <div className="space-y-6">
      {/* Appearance */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Palette className="h-5 w-5 text-purple-600" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6">
          <div className="space-y-3">
            <Label className="text-base font-medium">Theme</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                className="h-20 flex-col gap-2"
                onClick={() => handleThemeChange("light")}
              >
                <Sun className="h-6 w-6" />
                Light
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                className="h-20 flex-col gap-2"
                onClick={() => handleThemeChange("dark")}
              >
                <Moon className="h-6 w-6" />
                Dark
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                className="h-20 flex-col gap-2"
                onClick={() => handleThemeChange("system")}
              >
                <Monitor className="h-6 w-6" />
                System
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label htmlFor="language" className="text-base font-medium">
              Language
            </Label>
            <Select
              value={profile?.profile?.language ?? "en"}
              onValueChange={(value) =>
                handleStringPreferenceChange("language", value)
              }
              disabled={isLoading || updateProfile.isPending}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label htmlFor="timezone" className="text-base font-medium">
              Timezone
            </Label>
            <Select
              value={profile?.profile?.timezone ?? "UTC"}
              onValueChange={(value) =>
                handleStringPreferenceChange("timezone", value)
              }
              disabled={isLoading || updateProfile.isPending}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timezoneOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="h-5 w-5 text-orange-600" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="security-emails"
              checked={profile?.profile?.securityEmails ?? true}
              onCheckedChange={(checked) =>
                typeof checked === "boolean" && handleBooleanPreferenceChange("securityEmails", checked)
              }
              disabled={isLoading || updateProfile.isPending}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="security-emails"
                className="text-base font-medium"
              >
                Security Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive emails about security events and login attempts
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-start space-x-3">
            <Checkbox
              id="marketing-emails"
              checked={profile?.profile?.marketingEmails ?? false}
              onCheckedChange={(checked) =>
                typeof checked === "boolean" && handleBooleanPreferenceChange("marketingEmails", checked)
              }
              disabled={isLoading || updateProfile.isPending}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="marketing-emails"
                className="text-base font-medium"
              >
                Marketing Communications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive newsletters and promotional content
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Globe className="h-5 w-5 text-green-600" />
            Accessibility
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox id="high-contrast" defaultChecked={false} disabled />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="high-contrast"
                  className="text-base font-medium"
                >
                  High Contrast Mode
                </Label>
                <p className="text-sm text-muted-foreground">
                  Coming soon - Enhanced contrast for better visibility
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start space-x-3">
              <Checkbox id="reduced-motion" defaultChecked={false} disabled />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="reduced-motion"
                  className="text-base font-medium"
                >
                  Reduced Motion
                </Label>
                <p className="text-sm text-muted-foreground">
                  Coming soon - Minimize animations and transitions
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
