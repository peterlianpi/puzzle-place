import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/api/hono-client";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api)["testimonials"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api)["testimonials"]["$post"]
>["json"];

export const useCreateTestimonial = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api["testimonials"]["$post"]({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Testimonial created");
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
    onError: () => {
      toast.error("Failed to create testimonial");
    },
  });
  return mutation;
};