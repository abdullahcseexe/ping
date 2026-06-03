import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
<<<<<<< HEAD
import "../global.css"
=======
import "../../global.css"
>>>>>>> b470985a4dc24f47fd4f8a9ccb5fc7f10dd5bdc6

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
  <QueryClientProvider client={queryClient}>
    <Stack screenOptions={{headerShown: false}}/>
  </QueryClientProvider>
  )
}
<<<<<<< HEAD
=======

>>>>>>> b470985a4dc24f47fd4f8a9ccb5fc7f10dd5bdc6
