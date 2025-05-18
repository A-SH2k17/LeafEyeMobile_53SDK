import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

export default function PlantMonitorLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="monitor" />
      </Stack>
    </View>
  );
} 