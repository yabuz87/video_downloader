import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          height: 30,
          backgroundColor: "lightblue",
        },
        // headerShadowVisible: false,
        headerTintColor: "white",
      }}
    />
  );
}