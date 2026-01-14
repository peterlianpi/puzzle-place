"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Share2, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonProps {
  eventId: string;
  eventName: string;
}

export const ShareButton: React.FC<ShareButtonProps> = React.memo(({ eventId, eventName }) => {
  const [copied, setCopied] = React.useState(false);

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/events/${eventId}`;

  const handleShare = async () => {
    const shareData = {
      title: eventName,
      text: `Join the event: ${eventName}`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Event shared successfully!");
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast.error("Failed to share event");
        }
      }
    } else {
      // Fallback to copy to clipboard
      handleCopy();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Event link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback for older browsers or permission denied
      try {
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        toast.success("Event link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackError) {
        toast.error("Failed to copy link. Please copy manually: " + shareUrl);
      }
    }
  };

  return (
    <Button
      onClick={handleShare}
      variant="outline"
      className="flex items-center gap-2"
      aria-label={`Share event ${eventName}`}
    >
      {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
      <span className="hidden sm:inline">
        {copied ? "Copied!" : 'share' in navigator ? "Share" : "Copy Link"}
      </span>
    </Button>
  );
});

ShareButton.displayName = "ShareButton";