// import { useApi } from "../lib/axios";
// import { User } from "../types";
// import { useMutation, useQuery } from "@tanstack/react-query";

// export const useAuthCallback = () => {
//   const { apiWithAuth } = useApi();

//   return useMutation({
//     mutationFn: async () => {
//       const { data } = await apiWithAuth<User>({ method: "POST", url: "/auth/callback" });
//       return data;
//     },
//   });
// };

// export const useCurrentUser = () => {
//   const { apiWithAuth } = useApi();

//   return useQuery({
//     queryKey: ["currentUser"],
//     queryFn: async () => {
//       const { data } = await apiWithAuth<User>({ method: "GET", url: "/auth/me" });
//       return data;
//     },
//   });
// };

import { useApi } from "../lib/axios";
import { User } from "../types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAuthCallback = () => {
  const { apiWithAuth } = useApi();

  return useMutation({
    mutationFn: async () => {
      const { data } = await apiWithAuth<User>({ method: "POST", url: "/auth/callback" });
      return data;
    },
  });
};

export const useCurrentUser = () => {
  const { apiWithAuth } = useApi();

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const { data } = await apiWithAuth<User>({ method: "GET", url: "/auth/me" });
      return data;
    },
  });
};

export const useUpdateProfile = () => {
  const { apiWithAuth } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      const { data } = await apiWithAuth<User>({
        method: "PATCH",
        url: "/users/me",
        data: { name },
      });
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], data);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};