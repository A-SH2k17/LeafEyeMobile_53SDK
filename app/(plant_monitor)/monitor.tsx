import BottomNav from '@/components/nonprimitive/BottomNav';
import { styles as baseStyles } from '@/stylesheet/styles';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

// Back arrow icon
const backArrowIcon = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M19 12H5M12 19l-7-7 7-7"/>
</svg>
`;

interface Plant{
  image:string,
  datePlanted:string,
  id:number,
}

const PlantDetailsScreen = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { plantType, datePlanted, image, id } = params;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [images, setImages] = useState<Plant[]>([]);

  useEffect(() => {
    getPlants();
  }, []);

  const getPlants = async () => {
    try {
      const response = await axios.post('https://leafeye.eu-1.sharedwithexpose.com/api/monitor_images', {
        monitor_id: id,
      });
      console.log(response.data.message);
      setImages(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const handleImagePress = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <SvgXml xml={backArrowIcon} width={24} height={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Plant Details</Text>
          <View style={styles.backButton} /> 
        </View>
      </View>

      <TouchableOpacity onPress={() => handleImagePress(image as string)}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: image as string }}
            style={styles.plantImage}
            resizeMode="cover"
          />
        </View>
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Text style={styles.plantName}>{plantType}</Text>
        <Text style={styles.plantDate}>Planted on: {datePlanted}</Text>
        
        {/* Add more plant details here as needed */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Monitor Details</Text>
          {/* Add more plant information here */}
        </View>
      </View>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {images.map((plant) => (
          <View 
            key={plant.id} 
            style={styles.monitorCard}
          >
            <TouchableOpacity onPress={() => handleImagePress(plant.image)}>
              <Image 
                source={{ uri: plant.image }} 
                style={styles.monitorImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
            <View style={styles.monitorInfo}>
              <Text style={styles.monitorDate}>Planted on {plant.datePlanted}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeModal}
        >
          <View style={styles.modalContent}>
            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                style={styles.expandedImage}
                resizeMode="contain"
              />
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  ...baseStyles,
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#3D7054',
    paddingVertical: 12,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    width: '100%',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageContainer: {
    width: '100%',
    height: 150,
    backgroundColor: '#F5F5F5',
  },
  plantImage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: 20,
  },
  plantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  plantDate: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
  },
  detailsSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  monitorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  monitorImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
  },
  monitorInfo: {
    padding: 8,
  },
  monitorDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandedImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.8,
  },
});

export default PlantDetailsScreen;