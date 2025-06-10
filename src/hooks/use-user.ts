import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/actions/auth";

export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: getCurrentUser,
    enabled: true,
    staleTime: Infinity,
  })
}