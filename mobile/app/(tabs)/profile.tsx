


// import { useAuth, useUser } from "@clerk/expo";
// import { useState } from "react";
// import { View, Text, ScrollView, Pressable, Modal, TextInput, Linking, Alert } from "react-native";
// import { Image } from "expo-image";
// import { Ionicons } from "@expo/vector-icons";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { useApi } from "../../lib/axios";

// const ProfileTab = () => {
//   const { signOut } = useAuth();
//   const { user } = useUser();
//   const { top } = useSafeAreaInsets();
//   const { apiWithAuth } = useApi();

//   const [editVisible, setEditVisible] = useState(false);
//   const [deleteVisible, setDeleteVisible] = useState(false);
//   const [firstName, setFirstName] = useState(user?.firstName ?? "");
//   const [lastName, setLastName] = useState(user?.lastName ?? "");
//   const [saving, setSaving] = useState(false);
//   const [deleting, setDeleting] = useState(false);

//   const openEditProfile = () => {
//     setFirstName(user?.firstName ?? "");
//     setLastName(user?.lastName ?? "");
//     setEditVisible(true);
//   };

//   const saveProfile = async () => {
//     try {
//       setSaving(true);
//       await user?.update({ firstName, lastName });
//       setEditVisible(false);
//     } catch (err) {
//       Alert.alert("Update failed", "Could not update your profile. Please try again.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const deleteAccount = async () => {
//     try {
//       setDeleting(true);
//       // Backend cleans up MongoDB data AND deletes the Clerk account
//       await apiWithAuth({ method: "DELETE", url: "/users/me" });
//       // Sign out locally after backend confirms deletion
//       await signOut();
//     } catch (err: any) {
//       const msg = err?.response?.data?.message || err?.message || "Unknown error";
//       Alert.alert("Delete failed", msg);
//     } finally {
//       setDeleting(false);
//       setDeleteVisible(false);
//     }
//   };

//   const contactUs = () => {
//     Linking.openURL("mailto:abduladilcse.exe@gmail.com?subject=Ping%20Support");
//   };

//   return (
//     <ScrollView
//       className="bg-surface-dark"
//       contentInsetAdjustmentBehavior="automatic"
//       showsVerticalScrollIndicator={false}
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
//           </View>

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

//       {/* ACCOUNT */}
//       <View className="mt-6 mx-5">
//         <Text className="text-subtle-foreground text-xs font-semibold uppercase tracking-wider mb-2 ml-1">
//           Account
//         </Text>
//         <View className="bg-surface-card rounded-2xl overflow-hidden">
//           <Pressable
//             className="flex-row items-center px-4 py-3.5 active:bg-surface-light border-b border-surface-light"
//             onPress={openEditProfile}
//           >
//             <View
//               className="w-9 h-9 rounded-xl items-center justify-center"
//               style={{ backgroundColor: "#F4A26120" }}
//             >
//               <Ionicons name="person-outline" size={20} color="#F4A261" />
//             </View>
//             <Text className="flex-1 ml-3 text-foreground font-medium">Edit Profile</Text>
//             <Ionicons name="chevron-forward" size={18} color="#6B6B70" />
//           </Pressable>

//         </View>
//       </View>

//       {/* SUPPORT */}
//       <View className="mt-6 mx-5">
//         <Text className="text-subtle-foreground text-xs font-semibold uppercase tracking-wider mb-2 ml-1">
//           Support
//         </Text>
//         <View className="bg-surface-card rounded-2xl overflow-hidden">
//           <Pressable
//             className="flex-row items-center px-4 py-3.5 active:bg-surface-light"
//             onPress={contactUs}
//           >
//             <View
//               className="w-9 h-9 rounded-xl items-center justify-center"
//               style={{ backgroundColor: "#3B82F620" }}
//             >
//               <Ionicons name="chatbubble-outline" size={20} color="#3B82F6" />
//             </View>
//             <Text className="flex-1 ml-3 text-foreground font-medium">Contact Us</Text>
//             <Ionicons name="chevron-forward" size={18} color="#6B6B70" />
//           </Pressable>
//         </View>
//       </View>

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

//       {/* Delete Account Button */}
//       <Pressable
//         className="mx-5 mt-3 mb-2 rounded-2xl py-4 items-center active:opacity-70"
//         onPress={() => setDeleteVisible(true)}
//       >
//         <Text className="text-subtle-foreground text-sm font-medium underline">Delete Account</Text>
//       </Pressable>

//       {/* EDIT PROFILE MODAL */}
//       <Modal visible={editVisible} animationType="slide" transparent onRequestClose={() => setEditVisible(false)}>
//         <View className="flex-1 justify-end bg-black/50">
//           <View className="bg-surface-card rounded-t-3xl p-5">
//             <Text className="text-foreground text-lg font-bold mb-4">Edit Profile</Text>

//             <Text className="text-subtle-foreground text-xs mb-1 ml-1">First Name</Text>
//             <TextInput
//               value={firstName}
//               onChangeText={setFirstName}
//               className="bg-surface-light text-foreground rounded-xl px-4 py-3 mb-3"
//               placeholder="First name"
//               placeholderTextColor="#6B6B70"
//             />

//             <Text className="text-subtle-foreground text-xs mb-1 ml-1">Last Name</Text>
//             <TextInput
//               value={lastName}
//               onChangeText={setLastName}
//               className="bg-surface-light text-foreground rounded-xl px-4 py-3 mb-5"
//               placeholder="Last name"
//               placeholderTextColor="#6B6B70"
//             />

//             <View className="flex-row gap-3">
//               <Pressable
//                 className="flex-1 py-3.5 rounded-xl items-center bg-surface-light active:opacity-70"
//                 onPress={() => setEditVisible(false)}
//               >
//                 <Text className="text-foreground font-semibold">Cancel</Text>
//               </Pressable>
//               <Pressable
//                 className="flex-1 py-3.5 rounded-xl items-center bg-primary active:opacity-70"
//                 onPress={saveProfile}
//                 disabled={saving}
//               >
//                 <Text className="text-surface-dark font-semibold">{saving ? "Saving..." : "Save"}</Text>
//               </Pressable>
//             </View>
//           </View>
//         </View>
//       </Modal>
//       {/* DELETE ACCOUNT MODAL */}
//       <Modal visible={deleteVisible} animationType="fade" transparent onRequestClose={() => setDeleteVisible(false)}>
//         <View className="flex-1 justify-center items-center bg-black/60 px-6">
//           <View className="bg-surface-card rounded-3xl p-6 w-full">
//             <View className="items-center mb-4">
//               <View className="w-14 h-14 rounded-full bg-red-500/15 items-center justify-center mb-3">
//                 <Ionicons name="trash-outline" size={28} color="#EF4444" />
//               </View>
//               <Text className="text-foreground text-xl font-bold">Delete Account</Text>
//             </View>

//             <Text className="text-muted-foreground text-center text-sm leading-5 mb-6">
//               This will permanently delete your account, messages, and all data. This action cannot be undone.
//             </Text>

//             <View className="gap-3">
//               <Pressable
//                 className="py-3.5 rounded-xl items-center bg-red-500 active:opacity-70"
//                 onPress={deleteAccount}
//                 disabled={deleting}
//               >
//                 <Text className="text-white font-semibold">{deleting ? "Deleting..." : "Yes, Delete My Account"}</Text>
//               </Pressable>
//               <Pressable
//                 className="py-3.5 rounded-xl items-center bg-surface-light active:opacity-70"
//                 onPress={() => setDeleteVisible(false)}
//                 disabled={deleting}
//               >
//                 <Text className="text-foreground font-semibold">Cancel</Text>
//               </Pressable>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </ScrollView>
//   );
// };

// export default ProfileTab;


import { useAuth, useUser } from "@clerk/expo";
import { useState } from "react";
import { View, Text, ScrollView, Pressable, Modal, TextInput, Linking, Alert } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApi } from "../../lib/axios";
import { useUpdateProfile } from "../../hooks/useAuth";

const ProfileTab = () => {
  const { signOut } = useAuth();
  const { user } = useUser();
  const { top } = useSafeAreaInsets();
  const { apiWithAuth } = useApi();
  const updateProfileMutation = useUpdateProfile();

  const [editVisible, setEditVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const openEditProfile = () => {
    setFirstName(user?.firstName ?? "");
    setLastName(user?.lastName ?? "");
    setEditVisible(true);
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      await user?.update({ firstName, lastName });

      // Keep backend (and thus other users' view of this user) in sync
      const fullName = `${firstName} ${lastName}`.trim();
      if (fullName) {
        await updateProfileMutation.mutateAsync(fullName);
      }

      setEditVisible(false);
    } catch (err) {
      Alert.alert("Update failed", "Could not update your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const deleteAccount = async () => {
    try {
      setDeleting(true);
      // Backend cleans up MongoDB data AND deletes the Clerk account
      await apiWithAuth({ method: "DELETE", url: "/users/me" });
      // Sign out locally after backend confirms deletion
      await signOut();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Unknown error";
      Alert.alert("Delete failed", msg);
    } finally {
      setDeleting(false);
      setDeleteVisible(false);
    }
  };

  const contactUs = () => {
    Linking.openURL("mailto:abduladilcse.exe@gmail.com?subject=Ping%20Support");
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

      {/* Delete Account Button */}
      <Pressable
        className="mx-5 mt-3 mb-2 rounded-2xl py-4 items-center active:opacity-70"
        onPress={() => setDeleteVisible(true)}
      >
        <Text className="text-subtle-foreground text-sm font-medium underline">Delete Account</Text>
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
      {/* DELETE ACCOUNT MODAL */}
      <Modal visible={deleteVisible} animationType="fade" transparent onRequestClose={() => setDeleteVisible(false)}>
        <View className="flex-1 justify-center items-center bg-black/60 px-6">
          <View className="bg-surface-card rounded-3xl p-6 w-full">
            <View className="items-center mb-4">
              <View className="w-14 h-14 rounded-full bg-red-500/15 items-center justify-center mb-3">
                <Ionicons name="trash-outline" size={28} color="#EF4444" />
              </View>
              <Text className="text-foreground text-xl font-bold">Delete Account</Text>
            </View>

            <Text className="text-muted-foreground text-center text-sm leading-5 mb-6">
              This will permanently delete your account, messages, and all data. This action cannot be undone.
            </Text>

            <View className="gap-3">
              <Pressable
                className="py-3.5 rounded-xl items-center bg-red-500 active:opacity-70"
                onPress={deleteAccount}
                disabled={deleting}
              >
                <Text className="text-white font-semibold">{deleting ? "Deleting..." : "Yes, Delete My Account"}</Text>
              </Pressable>
              <Pressable
                className="py-3.5 rounded-xl items-center bg-surface-light active:opacity-70"
                onPress={() => setDeleteVisible(false)}
                disabled={deleting}
              >
                <Text className="text-foreground font-semibold">Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default ProfileTab;