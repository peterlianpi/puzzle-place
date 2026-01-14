import { useQuery } from "@tanstack/react-query";

interface Attendee {
  userId: string;
  username: string;
  name: string;
  avatar?: string;
  joinedAt: string;
}

// Mock data for now, replace with actual API call
const mockAttendees: Attendee[] = [
  {
    userId: "1",
    username: "john_doe",
    name: "John Doe",
    avatar: "/avatars/john.jpg",
    joinedAt: "2023-01-01T00:00:00Z",
  },
  {
    userId: "2",
    username: "jane_smith",
    name: "Jane Smith",
    avatar: "/avatars/jane.jpg",
    joinedAt: "2023-01-02T00:00:00Z",
  },
  // Add more mocks as needed
];

export function useGetAttendees(eventId: string) {
  return useQuery({
    queryKey: ["event-attendees", eventId],
    queryFn: async () => {
      // TODO: Replace with actual API call
      // const response = await honoClient.events[":id"].attendees.$get({ param: { id: eventId } });
      // return response.json();

      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return { attendees: mockAttendees };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}