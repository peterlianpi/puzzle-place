import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/api/hono-client";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api)["testimonials"][":id"]["$delete"]
>;
type RequestType = InferRequestType<
  (typeof client.api)["testimonials"][":id"]["$delete"]
>;

export const useDeleteTestimonial = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType["param"]>({
    mutationFn: async (param) => {
      const response = await client.api["testimonials"][":id"]["$delete"]({
        param,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Testimonial deleted");
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
    onError: (error) => {
      toast.error("Failed to delete testimonial");
      console.error("Delete error:", error);
    },
  });

  return mutation;
};