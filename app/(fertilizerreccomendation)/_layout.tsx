import { Stack } from "expo-router";



export default function FertLayout() {

  return (
   <Stack>
        <Stack.Screen name="index" options={{headerShown:false}}/>
        <Stack.Screen name="advanced-fertilization" options={{headerShown:false}}/>
   </Stack>
  );
}