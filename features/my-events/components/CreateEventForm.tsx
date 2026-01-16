"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useCreateGameEvent } from "../api/use-create-game-event";
import { useUpdateGameEvent } from "../api/use-update-game-event";
import { useRouter } from "next/navigation";
import {
  Trophy,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  Info,
  ArrowLeft
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

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
  const [prizesExpanded, setPrizesExpanded] = useState(false);

  const defaultValues: CreateEventFormData = mode === 'update' && event ? {
    eventName: event.eventName,
    description: event.description || "",
    prizes: event.prizes,
  } : {
    eventName: "",
    description: "",
    prizes: [
      { name: "Grand Prize", value: 100, isBlank: false },
      { name: "Second Prize", value: 80, isBlank: false },
      { name: "Third Price", value: 60, isBlank: false },
      { name: "Fourth Price", value: 40, isBlank: false },
      { name: "Fifth Price", value: 0, isBlank: true },
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

  // Calculate form validation status
  const hasValidEventName = form.watch("eventName")?.trim().length > 0;
  const hasValidPrizes = fields.length >= 5 && fields.some((_, index) => {
    const prize = form.watch(`prizes.${index}`);
    return prize?.name?.trim() && !prize?.isBlank;
  });
  const isFormValid = hasValidEventName && hasValidPrizes;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">

        {/* Event Details Section */}
        <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Info className="h-5 w-5 text-primary" />
              Event Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6">
            <FormField
              control={form.control}
              name="eventName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Event Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a catchy event name"
                      className="text-base h-12"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Choose a name that will excite your players
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your event, rules, or special instructions..."
                      className="min-h-[100px] text-base resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Help players understand what makes this event special
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Prizes Section with Collapsible Design */}
        <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader
            className="pb-4 cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => setPrizesExpanded(!prizesExpanded)}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Trophy className="h-5 w-5 text-amber-500" />
                Prize Pool Setup
                <Badge variant={hasValidPrizes ? "default" : "secondary"} className="ml-2">
                  {hasValidPrizes ? (
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                  ) : (
                    <AlertCircle className="h-3 w-3 mr-1" />
                  )}
                  {fields.length} prizes
                </Badge>
              </CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="p-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setPrizesExpanded(!prizesExpanded);
                }}
              >
                {prizesExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              Configure your prize pool (minimum 5 prizes, at least 1 non-blank prize)
            </div>
          </CardHeader>

          <AnimatePresence>
            {prizesExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <CardContent className="pt-0 space-y-6">
                  {/* Validation Alert */}
                  {form.formState.errors.prizes && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {typeof form.formState.errors.prizes.message === "string"
                          ? form.formState.errors.prizes.message
                          : "Please fix the prize configuration errors below."}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Prize List */}
                  <div className="grid gap-4 md:gap-6">
                    {fields.map((field, index) => {
                      const prize = form.watch(`prizes.${index}`);
                      const isValid = prize?.name?.trim() || prize?.isBlank;

                      return (
                        <motion.div
                          key={field.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className={`border transition-all duration-200 ${isValid ? 'border-border' : 'border-destructive/50 bg-destructive/5'
                            }`}>
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg flex items-center gap-2">
                                  Prize {index + 1}
                                  {prize?.isBlank && (
                                    <Badge variant="secondary" className="text-xs">
                                      Blank
                                    </Badge>
                                  )}
                                </CardTitle>
                                {fields.length > 5 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => remove(index)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name={`prizes.${index}.name`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Name {!prize?.isBlank && "*"}</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder={prize?.isBlank ? "Optional (blank prize)" : "e.g., $100 Cash Prize"}
                                          disabled={prize?.isBlank}
                                          {...field}
                                        />
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
                                      <FormLabel>Value {!prize?.isBlank && "*"}</FormLabel>
                                      <FormControl>
                                        <div className="relative">
                                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                                          <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            className="pl-8"
                                            disabled={prize?.isBlank}
                                            {...field}
                                            onChange={(e) =>
                                              field.onChange(parseFloat(e.target.value) || 0)
                                            }
                                          />
                                        </div>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              <FormField
                                control={form.control}
                                name={`prizes.${index}.isBlank`}
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border p-3 bg-muted/20">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="text-sm font-medium cursor-pointer">
                                        This is a blank/joke prize
                                      </FormLabel>
                                      <FormDescription className="text-xs">
                                        Blank prizes have no value and are used to build suspense
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                )}
                              />
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Add Prize Button */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => append({ name: "", value: 0, isBlank: false })}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Prize
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      className="flex-1"
                      onClick={() => append({ name: "", value: 0, isBlank: true })}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Blank Prize
                    </Button>
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Form Validation Summary */}
        {!isFormValid && (
          <Alert className="border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              {!hasValidEventName && !hasValidPrizes && "Please provide an event name and set up at least 5 prizes (including 1 non-blank prize)."}
              {!hasValidEventName && hasValidPrizes && "Please provide an event name."}
              {hasValidEventName && !hasValidPrizes && "Please set up at least 5 prizes with at least 1 non-blank prize."}
            </AlertDescription>
          </Alert>
        )}

        {/* Submit Button */}
        <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm border-t pt-4 -mx-6 px-6 mb-3">
          <Button
            type="submit"
            disabled={!isFormValid || createEvent.isPending || updateEvent.isPending}
            className="w-full h-12 mt-4 text-base font-medium"
            size="lg"
          >
            {mode === 'create' ? (
              createEvent.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                  Creating Event...
                </>
              ) : (
                <>
                  <Trophy className="h-5 w-5 mr-2" />
                  Create Event
                </>
              )
            ) : (
              updateEvent.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                  Updating Event...
                </>
              ) : (
                <>
                  <Trophy className="h-5 w-5 mr-2" />
                  Update Event
                </>
              )
            )}
          </Button>

          <Link href="/my-events" className="block mt-2">
            <Button className="w-full h-12 text-base font-medium" variant="outline" size="lg">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Events
            </Button>
          </Link>

        </div>
      </form>
    </Form>
  );
}
