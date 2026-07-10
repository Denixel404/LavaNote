import { Stack } from "expo-router";
import * as ScreenSizer from "@bam.tech/react-native-screen-sizer"
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

ScreenSizer.setup();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ScreenSizer.Wrapper devices={[...ScreenSizer.defaultDevices.all, "hostDevice"]}>

        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <Toast/>
      </ScreenSizer.Wrapper>
    </SafeAreaProvider>
  );
}
