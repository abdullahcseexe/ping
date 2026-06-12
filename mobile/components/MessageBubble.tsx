// import { Message } from "../types";
// import { View, Text } from "react-native";

// function MessageBubble({ message, isFromMe }: { message: Message; isFromMe: boolean }) {
//   return (
//     <View className={`flex-row ${isFromMe ? "justify-end" : "justify-start"}`}>
//       <View
//         className={`max-w-[80%] px-3 py-2 rounded-2xl ${
//           isFromMe
//             ? "bg-primary rounded-br-sm"
//             : "bg-surface-card rounded-bl-sm border border-surface-light"
//         }`}
//       >
//         <Text className={`text-sm ${isFromMe ? "text-surface-dark" : "text-foreground"}`}>
//           {message.text}
//         </Text>
//       </View>
//     </View>
//   );
// }

// export default MessageBubble;

import { Message } from "../types";
import { View, Text, Pressable, Alert, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

interface MessageBubbleProps {
  message: Message;
  isFromMe: boolean;
  onDelete?: (messageId: string) => void;
}

function MessageBubble({ message, isFromMe, onDelete }: MessageBubbleProps) {
  const [showDelete, setShowDelete] = useState(false);
  const { width: screenWidth } = useWindowDimensions();
  const maxBubbleWidth = screenWidth * 0.72;

  const handleLongPress = () => {
    if (isFromMe && onDelete) setShowDelete(true);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Message",
      "This message will be deleted for everyone.",
      [
        { text: "Cancel", style: "cancel", onPress: () => setShowDelete(false) },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setShowDelete(false);
            onDelete?.(message._id);
          },
        },
      ]
    );
  };

  return (
    <View style={{
      flexDirection: "row",
      justifyContent: isFromMe ? "flex-end" : "flex-start",
      alignItems: "center",
      paddingHorizontal: 12,
    }}>
      {/* Trash icon — left of bubble for sent messages */}
      {isFromMe && showDelete && (
        <Pressable
          onPress={handleDelete}
          style={{
            width: 28, height: 28, borderRadius: 14,
            backgroundColor: "rgba(239,68,68,0.15)",
            alignItems: "center", justifyContent: "center",
            marginRight: 6,
          }}
        >
          <Ionicons name="trash-outline" size={14} color="#EF4444" />
        </Pressable>
      )}

      <Pressable
        onLongPress={handleLongPress}
        onPress={() => showDelete && setShowDelete(false)}
        delayLongPress={350}
        style={{ maxWidth: maxBubbleWidth }}
      >
        <View style={{
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 18,
          opacity: showDelete ? 0.7 : 1,
          ...(isFromMe
            ? { backgroundColor: "#F4A261", borderBottomRightRadius: 4 }
            : { backgroundColor: "#1C1C1E", borderBottomLeftRadius: 4, borderWidth: 1, borderColor: "#2C2C2E" }),
        }}>
          <Text style={{ fontSize: 14, color: isFromMe ? "#0D0D0F" : "#F5F5F5" }}>
            {message.text}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

export default MessageBubble;
