"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCreateGameEvent } from "../api/use-create-game-event";
import { useUpdateGameEvent } from "../api/use-update-game-event";
import { useRouter } from "next/navigation";

const prizeSchema = z.object({
  name: z.string().min(1, "Prize name is required"),
  value: z.number().min(0, "Value must be non-negative"),
  isBlank: z.boolean().default(false),
});

const createEventSchema = z.object({
  eventName: z.string().min(1, "Event name is required"),
  description: z.string().optional(),
  prizes: z
    .array(prizeSchema)
    .min(5, "At least 5 prizes required")
    .refine(
      (prizes) => prizes.some((p) => !p.isBlank),
      "At least one non-blank prize required"
    ),
});

type CreateEventFormData = z.infer<typeof createEventSchema>;

interface GameEventFormProps {
  mode: 'create' | 'update';
  event?: {
    eventId: string;
    eventName: string;
    description?: string | null;
    prizes: { name: string; value: number; isBlank: boolean; }[];
  };
}

export default function CreateEventForm({ mode, event }: GameEventFormProps) {
  const router = useRouter();
  const createEvent = useCreateGameEvent();
  const updateEvent = useUpdateGameEvent();

  const defaultValues: CreateEventFormData = mode === 'update' && event ? {
    eventName: event.eventName,
    description: event.description || "",
    prizes: event.prizes,
  } : {
    eventName: "",
    description: "",
    prizes: [
      { name: "Grand Prize", value: 100, isBlank: false },
      { name: "Second Prize", value: 50, isBlank: false },
      { name: "", value: 0, isBlank: true },
      { name: "", value: 0, isBlank: true },
      { name: "", value: 0, isBlank: true },
    ],
  };

  const form = useForm({
    resolver: zodResolver(createEventSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "prizes",
  });

  const onSubmit = async (data: CreateEventFormData) => {
    if (mode === 'create') {
      // Sort prizes high to low value
      const sortedPrizes = [...data.prizes].sort((a, b) => b.value - a.value);

      const result = await createEvent.mutateAsync({
        eventName: data.eventName,
        description: data.description,
        prizes: sortedPrizes,
      });

      if (result && 'eventId' in result) {
        router.push(`/my-events/${result.eventId}`);
      }
    } else if (mode === 'update' && event) {
      await updateEvent.mutateAsync({
        id: event.eventId,
        eventName: data.eventName,
        description: data.description,
        prizes: data.prizes,
      });
      router.push(`/my-events/${event.eventId}`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="eventName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter event name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter event description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {
          <div>
            <FormLabel>Prizes</FormLabel>
            <p className="text-sm text-muted-foreground mb-4">
              Add prizes sorted from highest to lowest value. At least 5 prizes
              required, with at least 1 non-blank prize.
            </p>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <Card key={field.id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Prize {index + 1}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <FormField
                      control={form.control}
                      name={`prizes.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Prize name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`prizes.${index}.value`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Value</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`prizes.${index}.isBlank`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>This is a blank/joke prize</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    {fields.length > 5 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => remove(index)}
                      >
                        Remove Prize
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            {form.formState.errors.prizes &&
              typeof form.formState.errors.prizes.message === "string" && (
                <p className="text-destructive text-sm">
                  {form.formState.errors.prizes.message}
                </p>
              )}
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() => append({ name: "", value: 0, isBlank: false })}
            >
              Add Prize
            </Button>
          </div>
        }

        <Button
          type="submit"
          disabled={createEvent.isPending || updateEvent.isPending}
          className="w-full"
        >
          {mode === 'create' ? (createEvent.isPending ? "Creating..." : "Create Event") : (updateEvent.isPending ? "Updating..." : "Update Event")}
        </Button>
      </form>
    </Form>
  );
}
