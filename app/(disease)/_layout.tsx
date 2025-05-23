import { Stack } from "expo-router";



export default function FertLayout() {

  return (
   <Stack>
        <Stack.Screen name="index" options={{headerShown:false}}/>
   </Stack>
  );
}