import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { useColorScheme as useNativeColorScheme } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const nativeColorScheme = useNativeColorScheme();
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(nativeColorScheme ?? 'light');

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (nativeColorScheme) {
      setColorScheme(nativeColorScheme);
    }
  }, [nativeColorScheme]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(fertilizerreccomendation)" options={{ headerShown: false }} />
          <Stack.Screen name="(menu)" options={{ headerShown: false }} />
          <Stack.Screen name="(disease)" options={{ headerShown: false }} />
          <Stack.Screen name="(logreg)" options={{ headerShown: false }} />
          <Stack.Screen name="(plant_monitor)" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
