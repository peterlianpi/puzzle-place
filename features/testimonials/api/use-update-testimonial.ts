import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/api/hono-client";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api)["testimonials"][":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api)["testimonials"][":id"]["$patch"]
>["json"];

export const useUpdateTestimonial = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType & { id: string }
  >({
    mutationFn: async (data) => {
      const { id, ...json } = data;
      const response = await client.api["testimonials"][":id"]["$patch"]({
        json,
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Testimonial updated");
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
    onError: () => {
      toast.error("Failed to update testimonial");
    },
  });
  return mutation;
};