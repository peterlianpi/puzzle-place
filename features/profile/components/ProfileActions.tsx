import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, LogOut, Trash2, GamepadIcon, BarChart3 } from "lucide-react";

interface ProfileActionsProps {
  isCurrentUser: boolean;
  onSignOut: () => void;
  onDeleteAccount: () => void;
}

export function ProfileActions({ isCurrentUser, onSignOut, onDeleteAccount }: ProfileActionsProps) {
  const router = useRouter();

  if (!isCurrentUser) {
    return (
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <GamepadIcon className="h-5 w-5 text-blue-600" />
            Get Started
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button
              className="w-full h-12 transition-all duration-200 hover:scale-105 hover:shadow-md"
              onClick={() => router.push("/auth/login")}
            >
              Login to View More
            </Button>
            <Button
              variant="outline"
              className="w-full h-12 transition-all duration-200 hover:scale-105 hover:shadow-md"
              onClick={() => router.push("/")}
            >
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="h-5 w-5 text-gray-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 gap-3">
            <Button
              className="w-full h-12 transition-all duration-200 hover:scale-105 hover:shadow-md"
              onClick={() => router.push("/dashboard")}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Button>
            <Button
              variant="outline"
              className="w-full h-12 transition-all duration-200 hover:scale-105 hover:shadow-md hover:border-primary"
              onClick={() => router.push("/auth/change-password")}
            >
              <Settings className="h-4 w-4 mr-2" />
              Change Password
            </Button>
            <Button
              variant="outline"
              className="w-full h-12 sm:col-span-2 transition-all duration-200 hover:scale-105 hover:shadow-md hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700 dark:hover:bg-orange-950/20"
              onClick={onSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-red-700 dark:text-red-400">
            <Trash2 className="h-5 w-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-red-600 dark:text-red-400">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button
              variant="destructive"
              className="w-full h-12 transition-all duration-200 hover:scale-105 hover:shadow-md"
              onClick={onDeleteAccount}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}