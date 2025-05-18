import BottomNav from '@/components/nonprimitive/BottomNav';
import { router } from 'expo-router';
import React from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

// Back arrow icon
const backArrowIcon = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M19 12H5M12 19l-7-7 7-7"/>
</svg>
`;

// Mock data - replace with actual data from your backend
const plants = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1463154545680-d59320fd685d',
    type: 'Monstera Deliciosa',
    datePlanted: '2024-03-15'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1525498128493-380d1990a112',
    type: 'Snake Plant',
    datePlanted: '2024-03-10'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09',
    type: 'Peace Lily',
    datePlanted: '2024-03-05'
  }
];

export default function PlantMonitor() {
  

  const handlePlantPress = (plant: typeof plants[0]) => {
    router.push({
      pathname: '/(plant_monitor)/monitor',
      params: {
        plantType: plant.type,
        datePlanted: plant.datePlanted,
        image: plant.image,
        id: plant.id
      }
    });
  };

  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <SvgXml xml={backArrowIcon} width={24} height={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Plant Monitor</Text>
          <Text style={styles.headerSubtitle}>Track and manage your plants</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {plants.map((plant) => (
          <TouchableOpacity 
            key={plant.id} 
            style={styles.plantCard}
            onPress={() => handlePlantPress(plant)}
          >
            <Image 
              source={{ uri: plant.image }} 
              style={styles.plantImage}
              resizeMode="cover"
            />
            <View style={styles.plantInfo}>
              <Text style={styles.plantType}>{plant.type}</Text>
              <Text style={styles.plantDate}>Planted on {plant.datePlanted}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6FFF7',
  },
  header: {
    backgroundColor: '#3D7054',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  backButton: {
    marginRight: 12,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E8F5E9',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  plantCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  plantImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#E8F5E9',
  },
  plantInfo: {
    padding: 16,
  },
  plantType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  plantDate: {
    fontSize: 14,
    color: '#757575',
  }
});