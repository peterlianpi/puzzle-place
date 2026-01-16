"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Users,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import Link from "next/link";

interface Event {
  EventID: string;
  EventName: string;
  Description: string | null;
  IsActive: boolean;
  CreatedAt: string;
  prizePools?: any[];
}

interface MorphicEventCardProps {
  event: Event;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function MorphicEventCard({ event, onView, onEdit, onDelete }: MorphicEventCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [accessCount, setAccessCount] = useState(0);

  // Track usage in localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`event-${event.EventID}-access`);
    const count = stored ? parseInt(stored, 10) : 0;
    setAccessCount(count);
  }, [event.EventID]);

  const handleView = () => {
    const newCount = accessCount + 1;
    setAccessCount(newCount);
    localStorage.setItem(`event-${event.EventID}-access`, newCount.toString());
    onView();
  };

  // Mouse position for subtle motion
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-300, 300], [15, -15]);
  const rotateY = useTransform(mouseX, [-300, 300], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  // Determine if card should be expanded based on access count
  const isFrequentlyAccessed = accessCount > 5;

  return (
    <motion.div
      className="relative"
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        animate={{
          background: isHovered
            ? "linear-gradient(135deg, hsl(var(--primary)/0.1), hsl(var(--accent)/0.1))"
            : "linear-gradient(135deg, hsl(var(--background)), hsl(var(--muted)/0.5))",
        }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden border-0 shadow-lg backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <motion.div
                animate={{ fontSize: isFrequentlyAccessed || isHovered ? "1.125rem" : "1rem" }}
                transition={{ duration: 0.2 }}
              >
                <CardTitle className="text-lg leading-tight">{event.EventName}</CardTitle>
              </motion.div>
              <Badge variant={event.IsActive ? "default" : "secondary"}>
                {event.IsActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <motion.p
              className="text-sm text-muted-foreground mt-2"
              animate={{
                opacity: isHovered || isFrequentlyAccessed ? 1 : 0.7,
                height: isHovered || isFrequentlyAccessed ? "auto" : "3rem",
                overflow: "hidden",
              }}
              transition={{ duration: 0.3 }}
            >
              {event.Description || "No description"}
            </motion.p>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <motion.div
                className="flex items-center gap-1"
                animate={{ scale: isHovered ? 1.05 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <Calendar className="h-4 w-4" />
                {new Date(event.CreatedAt).toLocaleDateString()}
              </motion.div>
              <motion.div
                className="flex items-center gap-1"
                animate={{ scale: isHovered ? 1.05 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <Users className="h-4 w-4" />
                {event.prizePools?.length || 0} prizes
              </motion.div>
              {isFrequentlyAccessed && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-1 text-primary"
                >
                  <Eye className="h-4 w-4" />
                  Frequently accessed
                </motion.div>
              )}
            </div>

            <motion.div
              className="flex gap-2"
              animate={{
                flexDirection: isHovered || isFrequentlyAccessed ? "column" : "row",
                gap: isHovered || isFrequentlyAccessed ? "0.5rem" : "0.5rem",
              }}
              transition={{ duration: 0.3 }}
            >
              <Button
                variant="outline"
                size="sm"
                asChild
                className="flex-1"
                onClick={handleView}
              >
                <Link href={`/events/${event.EventID}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="flex-1"
                onClick={onEdit}
              >
                <Link href={`/events/${event.EventID}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}