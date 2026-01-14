import { useMemo } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { AvatarUploader } from "@/features/avatar/components/avatar-uploader";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { InlineEdit } from "@/components/ui/inline-edit";
import { useUpdateProfile } from "@/features/profile/api/use-update-profile";
import { useGetProfile } from "@/features/profile/api/use-get-profile";

interface ProfileHeaderProps {
  user?: {
    id: string;
    name: string | null;
    email: string;
    username: string | null;
    emailVerified?: boolean | null;
    image?: string | null;
    createdAt: Date;
  };
  isCurrentUser?: boolean;
  isLoading?: boolean;
  bio?: string;
  stats?: {
    events: number;
    puzzles: number;
    achievements: number;
  };
  onAvatarUpload?: () => void;
}

export function ProfileHeader({
  user,
  isCurrentUser = false,
  isLoading = false,
  bio,
  stats = { events: 0, puzzles: 0, achievements: 0 },
  onAvatarUpload,
}: ProfileHeaderProps) {
  const queryClient = useQueryClient();
  const { data: profile } = useGetProfile();
  const updateProfile = useUpdateProfile();

  const currentBio =
    profile?.profile?.bio ||
    (bio ??
      "Welcome to Puzzle Place! Join our community of puzzle enthusiasts and challenge yourself with exciting games and events.");

  const handleAvatarUpload = () => {
    queryClient.invalidateQueries({ queryKey: ["user"] });
    onAvatarUpload?.();
  };

  const displayName = useMemo(() => user?.name || "Unknown", [user]);
  const displayUsername = useMemo(
    () => (user?.username ? `@${user.username}` : null),
    [user]
  );
  const initials = useMemo(
    () => displayName.charAt(0).toUpperCase() || "?",
    [displayName]
  );

  if (isLoading) {
    return (
      <div className="relative">
        <Skeleton className="h-32 sm:h-48 rounded-t-xl" />
        <Card className="relative -mt-16 mx-4 sm:mx-6 lg:mx-8 border-0 shadow-2xl">
          <CardContent className="pt-20 pb-6 px-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <Skeleton className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full -mt-16 sm:-mt-12" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-16 w-full max-w-md" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="relative">
      {/* Hero Background */}
      <div className="h-32 sm:h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-t-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Profile Content */}
      <Card className="relative -mt-16 mx-4 sm:mx-6 lg:mx-8 border-0 shadow-2xl bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <CardContent className="pt-20 pb-6 px-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar Section */}
            <div className="relative -mt-16 sm:-mt-12">
              <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 bg-primary rounded-full flex items-center justify-center ring-8 ring-background shadow-xl overflow-hidden transition-all duration-300 hover:ring-primary/50">
                {user.image ? (
                  <Image
                    width={144}
                    height={144}
                    src={user.image}
                    alt={`${displayName}'s avatar`}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    priority
                    quality={85}
                  />
                ) : (
                  <span className="text-4xl sm:text-5xl text-primary-foreground font-bold">
                    {initials}
                  </span>
                )}
              </div>
              {isCurrentUser && (
                <div className="absolute -bottom-2 -right-2 transition-transform duration-200 hover:scale-110">
                  <AvatarUploader onUploadSuccess={handleAvatarUpload} />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left space-y-3">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                  {displayName}
                </h1>
                {displayUsername && (
                  <p className="text-xl text-muted-foreground font-medium">
                    {displayUsername}
                  </p>
                )}
                {isCurrentUser && (
                  <p className="text-muted-foreground break-all mt-1 text-sm">
                    {user.email}
                  </p>
                )}
              </div>

              {/* Bio */}
              <div className="max-w-md mx-auto sm:mx-0">
                <p className="text-muted-foreground leading-relaxed">{bio}</p>
              </div>

              {/* Quick Stats */}
              <div className="flex justify-center sm:justify-start gap-6 pt-2">
                <div className="text-center transition-transform duration-200 hover:scale-105">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.events}
                  </div>
                  <div className="text-xs text-muted-foreground">Events</div>
                </div>
                <div className="text-center transition-transform duration-200 hover:scale-105">
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.puzzles}
                  </div>
                  <div className="text-xs text-muted-foreground">Puzzles</div>
                </div>
                <div className="text-center transition-transform duration-200 hover:scale-105">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.achievements}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Achievements
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
