// import { useAuth, useUser } from "@clerk/expo";
// import { View, Text, ScrollView, Pressable } from "react-native";
// import { Image } from "expo-image";
// import { Ionicons } from "@expo/vector-icons";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// const MENU_SECTIONS = [
//   {
//     title: "Account",
//     items: [
//       { icon: "person-outline", label: "Edit Profile", color: "#F4A261" },
//       { icon: "shield-checkmark-outline", label: "Privacy & Security", color: "#10B981" },
//       { icon: "notifications-outline", label: "Notifications", value: "On", color: "#8B5CF6" },
//     ],
//   },
//   {
//     title: "Preferences",
//     items: [
//       { icon: "moon-outline", label: "Dark Mode", value: "On", color: "#6366F1" },
//       { icon: "language-outline", label: "Language", value: "English", color: "#EC4899" },
//       { icon: "cloud-outline", label: "Data & Storage", value: "1.2 GB", color: "#14B8A6" },
//     ],
//   },
//   {
//     title: "Support",
//     items: [
//       { icon: "help-circle-outline", label: "Help Center", color: "#F59E0B" },
//       { icon: "chatbubble-outline", label: "Contact Us", color: "#3B82F6" },
//       { icon: "star-outline", label: "Rate the App", color: "#F4A261" },
//     ],
//   },
// ];

// const ProfileTab = () => {
//   const { signOut } = useAuth();
//   const { user } = useUser();
//   const { top } = useSafeAreaInsets();

//   return (
//     <ScrollView
//       className="bg-surface-dark"
//       contentInsetAdjustmentBehavior="automatic"
//       showsVerticalScrollIndicator={false}
//       // indicatorStyle="white"
//       contentContainerStyle={{ paddingBottom: 40 }}
//     >
//       {/* HEADER  */}
//       <View className="relative">
//         <View className="items-center" style={{ marginTop: top + 8 }}>
//           <View className="relative">
//             <View className="rounded-full border-2 border-primary">
//               <Image
//                 source={user?.imageUrl}
//                 style={{ width: 100, height: 100, borderRadius: 999 }}
//               />
//             </View>

//             <Pressable className="absolute bottom-1 right-1 w-8 h-8 bg-primary rounded-full items-center justify-center border-2 border-surface-dark">
//               <Ionicons name="camera" size={16} color="#0D0D0F" />
//             </Pressable>
//           </View>

//           {/* NAME & EMAIL */}
//           <Text className="text-2xl font-bold text-foreground mt-4">
//             {user?.firstName} {user?.lastName}
//           </Text>

//           <Text className="text-muted-foreground mt-1">
//             {user?.emailAddresses[0]?.emailAddress}
//           </Text>

//           <View className="flex-row items-center mt-3 bg-green-500/20 px-3 py-1.5 rounded-full">
//             <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
//             <Text className="text-green-500 text-sm font-medium">Online</Text>
//           </View>
//         </View>
//       </View>

//       {/* MENU SECTIONS */}
//       {MENU_SECTIONS.map((section) => (
//         <View key={section.title} className="mt-6 mx-5">
//           <Text className="text-subtle-foreground text-xs font-semibold uppercase tracking-wider mb-2 ml-1">
//             {section.title}
//           </Text>
//           <View className="bg-surface-card rounded-2xl overflow-hidden">
//             {section.items.map((item, index) => (
//               <Pressable
//                 key={item.label}
//                 className={`flex-row items-center px-4 py-3.5 active:bg-surface-light ${
//                   index < section.items.length - 1 ? "border-b border-surface-light" : ""
//                 }`}
//               >
//                 <View
//                   className="w-9 h-9 rounded-xl items-center justify-center"
//                   style={{ backgroundColor: `${item.color}20` }}
//                 >
//                   <Ionicons name={item.icon as any} size={20} color={item.color} />
//                 </View>
//                 <Text className="flex-1 ml-3 text-foreground font-medium">{item.label}</Text>
//                 {item.value && (
//                   <Text className="text-subtle-foreground text-sm mr-1">{item.value}</Text>
//                 )}
//                 <Ionicons name="chevron-forward" size={18} color="#6B6B70" />
//               </Pressable>
//             ))}
//           </View>
//         </View>
//       ))}

//       {/* Logout Button */}
//       <Pressable
//         className="mx-5 mt-8 bg-red-500/10 rounded-2xl py-4 items-center active:opacity-70 border border-red-500/20"
//         onPress={() => signOut()}
//       >
//         <View className="flex-row items-center">
//           <Ionicons name="log-out-outline" size={20} color="#EF4444" />
//           <Text className="ml-2 text-red-500 font-semibold">Log Out</Text>
//         </View>
//       </Pressable>
//     </ScrollView>
//   );
// };

// export default ProfileTab;



import { useAuth, useUser } from "@clerk/expo";
import { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, Switch, Modal, TextInput, Linking, Alert } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";

const NOTIFICATIONS_KEY = "notifications_enabled";

const ProfileTab = () => {
  const { signOut } = useAuth();
  const { user } = useUser();
  const { top } = useSafeAreaInsets();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [editVisible, setEditVisible] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync(NOTIFICATIONS_KEY).then((value) => {
      if (value !== null) setNotificationsEnabled(value === "true");
    });
  }, []);

  const toggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    await SecureStore.setItemAsync(NOTIFICATIONS_KEY, String(value));
  };

  const openEditProfile = () => {
    setFirstName(user?.firstName ?? "");
    setLastName(user?.lastName ?? "");
    setEditVisible(true);
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      await user?.update({ firstName, lastName });
      setEditVisible(false);
    } catch (err) {
      Alert.alert("Update failed", "Could not update your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const contactUs = () => {
    Linking.openURL("mailto:support@pingapp.com?subject=Ping%20Support");
  };

  return (
    <ScrollView
      className="bg-surface-dark"
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* HEADER  */}
      <View className="relative">
        <View className="items-center" style={{ marginTop: top + 8 }}>
          <View className="relative">
            <View className="rounded-full border-2 border-primary">
              <Image
                source={user?.imageUrl}
                style={{ width: 100, height: 100, borderRadius: 999 }}
              />
            </View>
          </View>

          <Text className="text-2xl font-bold text-foreground mt-4">
            {user?.firstName} {user?.lastName}
          </Text>

          <Text className="text-muted-foreground mt-1">
            {user?.emailAddresses[0]?.emailAddress}
          </Text>

          <View className="flex-row items-center mt-3 bg-green-500/20 px-3 py-1.5 rounded-full">
            <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
            <Text className="text-green-500 text-sm font-medium">Online</Text>
          </View>
        </View>
      </View>

      {/* ACCOUNT */}
      <View className="mt-6 mx-5">
        <Text className="text-subtle-foreground text-xs font-semibold uppercase tracking-wider mb-2 ml-1">
          Account
        </Text>
        <View className="bg-surface-card rounded-2xl overflow-hidden">
          <Pressable
            className="flex-row items-center px-4 py-3.5 active:bg-surface-light border-b border-surface-light"
            onPress={openEditProfile}
          >
            <View
              className="w-9 h-9 rounded-xl items-center justify-center"
              style={{ backgroundColor: "#F4A26120" }}
            >
              <Ionicons name="person-outline" size={20} color="#F4A261" />
            </View>
            <Text className="flex-1 ml-3 text-foreground font-medium">Edit Profile</Text>
            <Ionicons name="chevron-forward" size={18} color="#6B6B70" />
          </Pressable>

          <View className="flex-row items-center px-4 py-3.5">
            <View
              className="w-9 h-9 rounded-xl items-center justify-center"
              style={{ backgroundColor: "#8B5CF620" }}
            >
              <Ionicons name="notifications-outline" size={20} color="#8B5CF6" />
            </View>
            <Text className="flex-1 ml-3 text-foreground font-medium">Notifications</Text>
            <Switch value={notificationsEnabled} onValueChange={toggleNotifications} />
          </View>
        </View>
      </View>

      {/* SUPPORT */}
      <View className="mt-6 mx-5">
        <Text className="text-subtle-foreground text-xs font-semibold uppercase tracking-wider mb-2 ml-1">
          Support
        </Text>
        <View className="bg-surface-card rounded-2xl overflow-hidden">
          <Pressable
            className="flex-row items-center px-4 py-3.5 active:bg-surface-light"
            onPress={contactUs}
          >
            <View
              className="w-9 h-9 rounded-xl items-center justify-center"
              style={{ backgroundColor: "#3B82F620" }}
            >
              <Ionicons name="chatbubble-outline" size={20} color="#3B82F6" />
            </View>
            <Text className="flex-1 ml-3 text-foreground font-medium">Contact Us</Text>
            <Ionicons name="chevron-forward" size={18} color="#6B6B70" />
          </Pressable>
        </View>
      </View>

      {/* Logout Button */}
      <Pressable
        className="mx-5 mt-8 bg-red-500/10 rounded-2xl py-4 items-center active:opacity-70 border border-red-500/20"
        onPress={() => signOut()}
      >
        <View className="flex-row items-center">
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text className="ml-2 text-red-500 font-semibold">Log Out</Text>
        </View>
      </Pressable>

      {/* EDIT PROFILE MODAL */}
      <Modal visible={editVisible} animationType="slide" transparent onRequestClose={() => setEditVisible(false)}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-surface-card rounded-t-3xl p-5">
            <Text className="text-foreground text-lg font-bold mb-4">Edit Profile</Text>

            <Text className="text-subtle-foreground text-xs mb-1 ml-1">First Name</Text>
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              className="bg-surface-light text-foreground rounded-xl px-4 py-3 mb-3"
              placeholder="First name"
              placeholderTextColor="#6B6B70"
            />

            <Text className="text-subtle-foreground text-xs mb-1 ml-1">Last Name</Text>
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              className="bg-surface-light text-foreground rounded-xl px-4 py-3 mb-5"
              placeholder="Last name"
              placeholderTextColor="#6B6B70"
            />

            <View className="flex-row gap-3">
              <Pressable
                className="flex-1 py-3.5 rounded-xl items-center bg-surface-light active:opacity-70"
                onPress={() => setEditVisible(false)}
              >
                <Text className="text-foreground font-semibold">Cancel</Text>
              </Pressable>
              <Pressable
                className="flex-1 py-3.5 rounded-xl items-center bg-primary active:opacity-70"
                onPress={saveProfile}
                disabled={saving}
              >
                <Text className="text-surface-dark font-semibold">{saving ? "Saving..." : "Save"}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default ProfileTab;
