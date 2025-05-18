import { Text, TouchableOpacity, View } from "react-native";
import { SvgXml } from 'react-native-svg';
import { router } from "expo-router";
import { styles } from '../../stylesheet/styles';
import React from "react";
const iconLeaf = `
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M11 20A7 7 0 0 1 4 13C4 9.25 7 6 11 7h1a8 8 0 0 0 8 8c0 4.75-3.25 7.75-7 7.75h-2z"/>
  <path d="M6.59 11.41a4.07 4.07 0 0 0 0 5.66 4.07 4.07 0 0 0 5.66 0"/>
  <path d="M5 10c4.58-3.25 6.25-3.17 15-5"/>
</svg>
`;

const iconMessage = `
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
</svg>
`;

const iconCamera = `
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
  <circle cx="12" cy="13" r="3"/>
</svg>
`;

const iconUser = `
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
  <circle cx="12" cy="7" r="4"/>
</svg>
`;

const iconFert = `
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <!-- Leaf shape with stem -->
  <path d="M20,4 C15,1 6,1 4,10 C2,19 10,22 18,16 C18,16 20,5 12,10 M4,10 C4,10 8,12 12,10 M12,10 C12,10 16,8 18,16 M12,10 L12,21"/>
</svg>
`;

export default function BottomNav(){
    return(
    <>
    <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={()=>router.push('/(menu)')}>
          <SvgXml xml={iconLeaf} width={24} height={24} color="#3D7054" />
          <Text style={styles.tabText}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem}>
          <SvgXml xml={iconMessage} width={24} height={24} color="#3D7054" />
          <Text style={styles.tabText}>AI Chat</Text>
        </TouchableOpacity>
        
        {/* Placeholder for the center button */}
        <View style={styles.tabItemCenter} />
        
        <TouchableOpacity style={styles.tabItem} onPress={()=>router.push('/(fertilizerreccomendation)')}>
          <SvgXml xml={iconFert} width={24} height={24} color="#3D7054" />
          <Text style={styles.tabText}>Fertilizer</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem} onPress={()=>router.push('/profile')}>
          <SvgXml xml={iconUser} width={24} height={24} color="#3D7054" />
          <Text style={styles.tabText}>Profile</Text>
        </TouchableOpacity>
      </View>
      
      {/* Floating identify button */}
      <TouchableOpacity style={styles.identifyButton}>
        <SvgXml xml={iconCamera} width={28} height={28} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.identifyText}>Diagnose</Text>
    </>
    )
}