


// import EmptyUI from "../../components/EmptyUI";
// import MessageBubble from "../../components/MessageBubble";
// import { useCurrentUser } from "../../hooks/useAuth";
// import { useMessages, useDeleteMessage } from "../../hooks/useMessages";
// import { useSocketStore } from "../../lib/socket";
// import { MessageSender } from "../../types";
// import { Ionicons } from "@expo/vector-icons";
// import { Image } from "expo-image";
// import { router, useLocalSearchParams } from "expo-router";
// import { useCallback, useEffect, useRef, useState } from "react";
// import Animated, { useAnimatedKeyboard, useAnimatedStyle } from "react-native-reanimated";
// import {
//   View,
//   Text,
//   Pressable,
//   ScrollView,
//   ActivityIndicator,
//   TextInput,
// } from "react-native";

// import { SafeAreaView } from "react-native-safe-area-context";

// type ChatParams = {
//   id: string;
//   participantId: string;
//   name: string;
//   avatar: string;
// };

// const ChatDetailScreen = () => {
//   const { id: chatId, avatar, name, participantId } = useLocalSearchParams<ChatParams>();

//   const [messageText, setMessageText] = useState("");
//   const [isSending, setIsSending] = useState(false);
//   const scrollViewRef = useRef<ScrollView>(null);

//   const { data: currentUser } = useCurrentUser();
//   const { data: messages, isLoading } = useMessages(chatId);

//   const { joinChat, leaveChat, sendMessage, sendTyping, isConnected, onlineUsers, typingUsers, notifyMessageDeleted } =
//     useSocketStore();

//   const deleteMessageMutation = useDeleteMessage(chatId);

//   const handleDeleteMessage = useCallback(
//     (messageId: string) => {
//       deleteMessageMutation.mutate(messageId, {
//         onSuccess: () => {
//           notifyMessageDeleted(chatId, messageId);
//         },
//       });
//     },
//     [chatId, deleteMessageMutation, notifyMessageDeleted]
//   );

//   const isOnline = participantId ? onlineUsers.has(participantId) : false;
//   const isTyping = typingUsers.get(chatId) === participantId;

//   const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

//   const keyboard = useAnimatedKeyboard();
//   const inputBarAnimatedStyle = useAnimatedStyle(() => ({
//     paddingBottom: keyboard.height.value,
//   }));

//   // join chat room on mount, leave on unmount
//   useEffect(() => {
//     if (chatId && isConnected) joinChat(chatId);

//     return () => {
//       if (chatId) leaveChat(chatId);
//     };
//   }, [chatId, isConnected, joinChat, leaveChat]);

//   // scroll to bottom when new messages arrive
//   useEffect(() => {
//     if (messages && messages.length > 0) {
//       setTimeout(() => {
//         scrollViewRef.current?.scrollToEnd({ animated: true });
//       }, 100);
//     }
//   }, [messages]);

//   const handleTyping = useCallback(
//     (text: string) => {
//       setMessageText(text);

//       if (!isConnected || !chatId) return;

//       // send typing start
//       if (text.length > 0) {
//         sendTyping(chatId, true);

//         // clear existing timeout
//         if (typingTimeoutRef.current) {
//           clearTimeout(typingTimeoutRef.current);
//         }

//         // stop typing after 2 seconds of no input
//         typingTimeoutRef.current = setTimeout(() => {
//           sendTyping(chatId, false);
//         }, 2000);
//       } else {
//         // text cleared, stop typing
//         if (typingTimeoutRef.current) {
//           clearTimeout(typingTimeoutRef.current);
//         }
//         sendTyping(chatId, false);
//       }
//     },
//     [chatId, isConnected, sendTyping]
//   );

//   const handleSend = () => {
//     if (!messageText.trim() || isSending || !isConnected || !currentUser) return;

//     // stop typing indicator
//     if (typingTimeoutRef.current) {
//       clearTimeout(typingTimeoutRef.current);
//     }
//     sendTyping(chatId, false);

//     setIsSending(true);
//     sendMessage(chatId, messageText.trim(), {
//       _id: currentUser._id,
//       name: currentUser.name,
//       email: currentUser.email,
//       avatar: currentUser.avatar,
//     });
//     setMessageText("");
//     setIsSending(false);

//     setTimeout(() => {
//       scrollViewRef.current?.scrollToEnd({ animated: true });
//     }, 100);
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-surface" edges={["top", "bottom"]}>
//       {/* Header */}
//       <View className="flex-row items-center px-4 py-2 bg-surface border-b border-surface-light">
//         <Pressable onPress={() => router.back()}>
//           <Ionicons name="arrow-back" size={24} color="#F4A261" />
//         </Pressable>
//         <View className="flex-row items-center flex-1 ml-2">
//           {avatar && <Image source={avatar} style={{ width: 40, height: 40, borderRadius: 999 }} />}
//           <View className="ml-3">
//             <Text className="text-foreground font-semibold text-base" numberOfLines={1}>
//               {name}
//             </Text>
//             <Text className={`text-xs ${isTyping ? "text-primary" : "text-muted-foreground"}`}>
//               {isTyping ? "typing..." : isOnline ? "Online" : "Offline"}
//             </Text>
//           </View>
//         </View>
//       </View>

//       {/* Message + Keyboard input */}
//       <View className="flex-1">
//         <View className="flex-1 bg-surface">
//           {isLoading ? (
//             <View className="flex-1 items-center justify-center">
//               <ActivityIndicator size="large" color="#F4A261" />
//             </View>
//           ) : !messages || messages.length === 0 ? (
//             <EmptyUI
//               title="No messages yet"
//               subtitle="Start the conversation!"
//               iconName="chatbubbles-outline"
//               iconColor="#6B6B70"
//               iconSize={64}
//             />
//           ) : (
//             <ScrollView
//               ref={scrollViewRef}
//               contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}
//               onContentSizeChange={() => {
//                 scrollViewRef.current?.scrollToEnd({ animated: false });
//               }}
//             >
//               {messages.map((message) => {
//                 const senderId = (message.sender as MessageSender)._id;
//                 const isFromMe = currentUser ? senderId === currentUser._id : false;

//                 return (
//                   <MessageBubble
//                     key={message._id}
//                     message={message}
//                     isFromMe={isFromMe}
//                     onDelete={handleDeleteMessage}
//                   />
//                 );
//               })}
//             </ScrollView>
//           )}

//           {/* Input bar */}
//           <Animated.View className="px-3 pt-2 bg-surface border-t border-surface-light" style={inputBarAnimatedStyle}>
//             <View
//               className="flex-row items-end bg-surface-card rounded-3xl pl-4 pr-1.5 py-1.5 gap-2 mb-3 border border-surface-light"
//               style={{
//                 shadowColor: "#000",
//                 shadowOffset: { width: 0, height: 2 },
//                 shadowOpacity: 0.15,
//                 shadowRadius: 4,
//                 elevation: 2,
//               }}
//             >
//               <TextInput
//                 placeholder="Type a message"
//                 placeholderTextColor="#6B6B70"
//                 className="flex-1 text-foreground text-sm py-1.5"
//                 multiline
//                 style={{ maxHeight: 100 }}
//                 value={messageText}
//                 onChangeText={handleTyping}
//                 onSubmitEditing={handleSend}
//                 editable={!isSending}
//               />

//               <Pressable
//                 className="w-9 h-9 rounded-full items-center justify-center bg-primary"
//                 onPress={handleSend}
//                 disabled={!messageText.trim() || isSending}
//                 style={{ opacity: !messageText.trim() || isSending ? 0.5 : 1 }}
//               >
//                 {isSending ? (
//                   <ActivityIndicator size="small" color="#0D0D0F" />
//                 ) : (
//                   <Ionicons name="send" size={18} color="#0D0D0F" />
//                 )}
//               </Pressable>
//             </View>
//           </Animated.View>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default ChatDetailScreen;




import EmptyUI from "../../components/EmptyUI";
import MessageBubble from "../../components/MessageBubble";
import { useCurrentUser } from "../../hooks/useAuth";
import { useMessages, useDeleteMessage, useDeleteForMe } from "../../hooks/useMessages";
import { useSocketStore } from "../../lib/socket";
import { MessageSender } from "../../types";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import Animated, { useAnimatedKeyboard, useAnimatedStyle } from "react-native-reanimated";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

type ChatParams = {
  id: string;
  participantId: string;
  name: string;
  avatar: string;
};

const ChatDetailScreen = () => {
  const { id: chatId, avatar, name, participantId } = useLocalSearchParams<ChatParams>();

  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const { data: currentUser } = useCurrentUser();
  const { data: messages, isLoading } = useMessages(chatId);

  const { joinChat, leaveChat, sendMessage, sendTyping, isConnected, onlineUsers, typingUsers, } =
    useSocketStore();

  const deleteMessageMutation = useDeleteMessage(chatId);
  const deleteForMeMutation = useDeleteForMe(chatId);

  const handleDeleteMessage = useCallback(
    (messageId: string) => {
      deleteMessageMutation.mutate(messageId);
    },
    [deleteMessageMutation]
  );

  const handleDeleteForMe = useCallback(
    (messageId: string) => {
      deleteForMeMutation.mutate(messageId);
    },
    [deleteForMeMutation]
  );

  const isOnline = participantId ? onlineUsers.has(participantId) : false;
  const isTyping = typingUsers.get(chatId) === participantId;

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const keyboard = useAnimatedKeyboard();
  const inputBarAnimatedStyle = useAnimatedStyle(() => ({
    paddingBottom: keyboard.height.value,
  }));

  // join chat room on mount, leave on unmount
  useEffect(() => {
    if (chatId && isConnected) joinChat(chatId);

    return () => {
      if (chatId) leaveChat(chatId);
    };
  }, [chatId, isConnected, joinChat, leaveChat]);

  // scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages && messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleTyping = useCallback(
    (text: string) => {
      setMessageText(text);

      if (!isConnected || !chatId) return;

      // send typing start
      if (text.length > 0) {
        sendTyping(chatId, true);

        // clear existing timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        // stop typing after 2 seconds of no input
        typingTimeoutRef.current = setTimeout(() => {
          sendTyping(chatId, false);
        }, 2000);
      } else {
        // text cleared, stop typing
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        sendTyping(chatId, false);
      }
    },
    [chatId, isConnected, sendTyping]
  );

  const handleSend = () => {
    if (!messageText.trim() || isSending || !isConnected || !currentUser) return;

    // stop typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    sendTyping(chatId, false);

    setIsSending(true);
    sendMessage(chatId, messageText.trim(), {
      _id: currentUser._id,
      name: currentUser.name,
      email: currentUser.email,
      avatar: currentUser.avatar,
    });
    setMessageText("");
    setIsSending(false);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top", "bottom"]}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-2 bg-surface border-b border-surface-light">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#F4A261" />
        </Pressable>
        <View className="flex-row items-center flex-1 ml-2">
          {avatar && <Image source={avatar} style={{ width: 40, height: 40, borderRadius: 999 }} />}
          <View className="ml-3">
            <Text className="text-foreground font-semibold text-base" numberOfLines={1}>
              {name}
            </Text>
            <Text className={`text-xs ${isTyping ? "text-primary" : "text-muted-foreground"}`}>
              {isTyping ? "typing..." : isOnline ? "Online" : "Offline"}
            </Text>
          </View>
        </View>
      </View>

      {/* Message + Keyboard input */}
      <View className="flex-1">
        <View className="flex-1 bg-surface">
          {isLoading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#F4A261" />
            </View>
          ) : !messages || messages.length === 0 ? (
            <EmptyUI
              title="No messages yet"
              subtitle="Start the conversation!"
              iconName="chatbubbles-outline"
              iconColor="#6B6B70"
              iconSize={64}
            />
          ) : (
            <ScrollView
              ref={scrollViewRef}
              contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}
              onContentSizeChange={() => {
                scrollViewRef.current?.scrollToEnd({ animated: false });
              }}
            >
              {messages.map((message) => {
                const senderId = (message.sender as MessageSender)._id;
                const isFromMe = currentUser ? senderId === currentUser._id : false;

                return (
                  <MessageBubble
                    key={message._id}
                    message={message}
                    isFromMe={isFromMe}
                    onDeleteForEveryone={handleDeleteMessage}
                    onDeleteForMe={handleDeleteForMe}
                  />
                );
              })}
            </ScrollView>
          )}

          {/* Input bar */}
          <Animated.View className="px-3 pt-2 bg-surface border-t border-surface-light" style={inputBarAnimatedStyle}>
            <View
              className="flex-row items-end bg-surface-card rounded-3xl pl-4 pr-1.5 py-1.5 gap-2 mb-3 border border-surface-light"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <TextInput
                placeholder="Type a message"
                placeholderTextColor="#6B6B70"
                className="flex-1 text-foreground text-sm py-1.5"
                multiline
                style={{ maxHeight: 100 }}
                value={messageText}
                onChangeText={handleTyping}
                onSubmitEditing={handleSend}
                editable={!isSending}
              />

              <Pressable
                className="w-9 h-9 rounded-full items-center justify-center bg-primary"
                onPress={handleSend}
                disabled={!messageText.trim() || isSending}
                style={{ opacity: !messageText.trim() || isSending ? 0.5 : 1 }}
              >
                {isSending ? (
                  <ActivityIndicator size="small" color="#0D0D0F" />
                ) : (
                  <Ionicons name="send" size={18} color="#0D0D0F" />
                )}
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChatDetailScreen;