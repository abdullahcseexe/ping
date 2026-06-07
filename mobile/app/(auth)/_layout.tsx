// import { useAuth } from '@clerk/expo'
// import { Redirect, Stack } from "expo-router";

// const AuthLayout = () => {
//   const { isSignedIn, isLoaded } = useAuth();

//   if (!isLoaded) return null;

//   if (isSignedIn) return <Redirect href={"/(tabs)"} />;

//   return <Stack screenOptions={{ headerShown: false }} />;
// };

// export default AuthLayout;

import { useAuth } from '@clerk/expo'
import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";

const AuthLayout = () => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0D0D0F", alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#F4A261" />
      </View>
    );
  }

  if (isSignedIn) return <Redirect href={"/(tabs)"} />;

  return <Stack screenOptions={{ headerShown: false }} />;
};

export default AuthLayout;