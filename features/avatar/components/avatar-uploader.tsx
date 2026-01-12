"use client";

import { useRef } from "react";
import { useUploadAvatar } from "../api/use-upload-avatar";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";

interface AvatarUploaderProps {
  onUploadSuccess?: (url: string) => void;
}

export function AvatarUploader({ onUploadSuccess }: AvatarUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadAvatar();

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const result = (await uploadMutation.mutateAsync({
          imageData: base64,
        })) as { success: boolean; imageUrl?: string };
        if (result.success && result.imageUrl) {
          // Refresh the session to update avatar in sidebar
          await authClient.getSession();
          onUploadSuccess?.(result.imageUrl);
        }
      } catch (error) {
        console.error("Upload failed:", error);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploadMutation.isPending}
      >
        {uploadMutation.isPending ? "Uploading..." : "Upload Avatar"}
      </Button>
    </div>
  );
}
