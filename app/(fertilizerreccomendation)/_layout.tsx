import { Stack } from "expo-router";



export default function LogRegLayout() {

  return (
   <Stack>
        <Stack.Screen name="index" options={{headerShown:false}}/>
   </Stack>
  );
}