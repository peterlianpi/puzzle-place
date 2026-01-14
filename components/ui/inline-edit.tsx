import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface InlineEditProps {
  label: string;
  value: string;
  placeholder: string;
  type?: string;
  validator?: (value: string) => string | null;
  onSave: (value: string) => Promise<void>;
  buttonText?: string;
}

export function InlineEdit({
  label,
  value,
  placeholder,
  type = "text",
  validator,
  onSave,
  buttonText = "Save",
}: InlineEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(value);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue("");
  };

  const handleSave = async () => {
    const validationError = validator ? validator(editValue) : null;
    if (validationError) {
      throw new Error(validationError);
    }

    setIsLoading(true);
    try {
      await onSave(editValue.trim());
      setIsEditing(false);
      setEditValue("");
    } catch (error) {
      // Error is handled in onSave
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-3">
        <Input
          type={type}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          autoFocus
          className="text-base"
          aria-label={`Edit ${label.toLowerCase()}`}
        />
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            {isLoading ? "Saving..." : buttonText}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Button
        variant="outline"
        className="w-full justify-start text-left h-auto py-3 px-4 transition-all duration-200 hover:bg-accent hover:shadow-sm hover:scale-[1.02]"
        onClick={handleEdit}
        aria-label={`Edit ${label.toLowerCase()}`}
      >
        <div className="flex items-center justify-between w-full">
          <span className="font-medium">{label}</span>
          <span className="text-muted-foreground text-sm truncate ml-2 transition-colors">
            {value || placeholder}
          </span>
        </div>
      </Button>
    </div>
  );
}