

// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { useApi } from "../lib/axios";
// import type { Message } from "../types";

// export const useMessages = (chatId: string) => {
//   const { apiWithAuth } = useApi();

//   return useQuery({
//     queryKey: ["messages", chatId],
//     queryFn: async (): Promise<Message[]> => {
//       const { data } = await apiWithAuth<Message[]>({
//         method: "GET",
//         url: `/messages/chat/${chatId}`,
//       });
//       return data;
//     },
//     enabled: !!chatId,
//   });
// };

// export const useDeleteMessage = (chatId: string) => {
//   const { apiWithAuth } = useApi();
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (messageId: string) => {
//       await apiWithAuth({
//         method: "DELETE",
//         url: `/messages/${messageId}`,
//       });
//       return messageId;
//     },
//     onSuccess: (messageId) => {
//       queryClient.setQueryData<Message[]>(["messages", chatId], (old) => {
//         if (!old) return old;
//         return old.filter((m) => m._id !== messageId);
//       });
//     },
//   });
// };


import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../lib/axios";
import { addDeletedForMeId, getDeletedForMeIds } from "../lib/deletedMessages";
import type { Message } from "../types";

export const useMessages = (chatId: string) => {
  const { apiWithAuth } = useApi();

  return useQuery({
    queryKey: ["messages", chatId],
    queryFn: async (): Promise<Message[]> => {
      const { data } = await apiWithAuth<Message[]>({
        method: "GET",
        url: `/messages/chat/${chatId}`,
      });

      const deletedIds = await getDeletedForMeIds(chatId);
      if (deletedIds.size === 0) return data;

      return data.filter((m) => !deletedIds.has(m._id));
    },
    enabled: !!chatId,
  });
};

export const useDeleteMessage = (chatId: string) => {
  const { apiWithAuth } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string) => {
      await apiWithAuth({
        method: "DELETE",
        url: `/messages/${messageId}`,
      });
      return messageId;
    },
    onSuccess: (messageId) => {
      queryClient.setQueryData<Message[]>(["messages", chatId], (old) => {
        if (!old) return old;
        return old.filter((m) => m._id !== messageId);
      });
    },
  });
};

export const useDeleteForMe = (chatId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string) => {
      await addDeletedForMeId(chatId, messageId);
      return messageId;
    },
    onSuccess: (messageId) => {
      queryClient.setQueryData<Message[]>(["messages", chatId], (old) => {
        if (!old) return old;
        return old.filter((m) => m._id !== messageId);
      });
    },
  });
};