import BottomNav from '@/components/nonprimitive/BottomNav';
import axios from 'axios';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
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

// Define the Plant interface to match the API response
interface Plant {
  monitor_id: string;
  plantType: string;
  datePlanted: string;
  image: string;
  collection_name: string;
}

// Back arrow icon
const backArrowIcon = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M19 12H5M12 19l-7-7 7-7"/>
</svg>
`;

export default function PlantMonitor() {
  // Initialize state with proper typing
  const [plants, setPlants] = useState<Plant[]>([]);

  const handlePlantPress = (plant: Plant) => {
    router.push({
      pathname: '/(plant_monitor)/monitor',
      params: {
        plantType: plant.plantType,
        datePlanted: plant.datePlanted,
        image: plant.image,
        id: plant.monitor_id,
        collection_name: plant.collection_name
      }
    });
  };

  useEffect(() => {
    getPlants();
  }, []);

  const getPlants = async () => {
    try {
      const response = await axios.get<{ message: Plant[] }>('https://leafeye.eu-1.sharedwithexpose.com/api/plants_monitor');
      console.log(response.data.message);
      setPlants(response.data.message);
    } catch (error) {
      console.log(error);
    }
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
            key={plant.monitor_id} 
            style={styles.plantCard}
            onPress={() => handlePlantPress(plant)}
          >
            <Image 
              source={{ uri: plant.image }} 
              style={styles.plantImage}
              resizeMode="cover"
            />
            <View style={styles.plantInfo}>
              <Text style={styles.plantType}>{plant.collection_name || plant.plantType}</Text>
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