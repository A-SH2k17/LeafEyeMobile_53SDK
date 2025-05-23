// SimplifiedFertilizerRecommendation.jsx
import BottomNav from '@/components/nonprimitive/BottomNav';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

// SVG icons as XML strings - simplified set
const iconBack = `
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M19 12H5M12 19l-7-7 7-7"/>
</svg>
`;

const iconFert = `
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M20,4 C15,1 6,1 4,10 C2,19 10,22 18,16 C18,16 20,5 12,10 M4,10 C4,10 8,12 12,10 M12,10 C12,10 16,8 18,16 M12,10 L12,21"/>
</svg>
`;

const iconDropdown = `
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="6 9 12 15 18 9"></polyline>
</svg>
`;

const iconSoil = `
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M2 22h20"/>
  <path d="M5 13c.7-1.7 1.3-3.3 2-5 .6-1.5 1-3 3-3s2.4 1.5 3 3c.7 1.7 1.3 3.3 2 5 .6 1.5 1 3 3 3s2.4-1.5 3-3"/>
</svg>
`;

const iconPlant = `
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M15 2c-1.35 4-4 6-8 6"/>
  <path d="M17 8c4 0 6 2.65 6 4 0 1.35-2 4-6 4"/>
  <path d="M9 10c-4 0-6 2.65-6 4 0 1.35 2 4 6 4"/>
  <path d="M8 22l4-10 4 10"/>
</svg>
`;

const iconTemp = `
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
</svg>
`;

const iconHumidity = `
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
</svg>
`;

const iconLeaf = `
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M11 20A7 7 0 0 1 4 13C4 9.25 7 6 11 7h1a8 8 0 0 0 8 8c0 4.75-3.25 7.75-7 7.75h-2z"/>
  <path d="M6.59 11.41a4.07 4.07 0 0 0 0 5.66 4.07 4.07 0 0 0 5.66 0"/>
</svg>
`;

const iconUser = `
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
  <circle cx="12" cy="7" r="4"/>
</svg>
`;

const iconCamera = `
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
  <circle cx="12" cy="13" r="4"/>
</svg>
`;

const iconMessage = `
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
</svg>
`;

// Add type for image data
interface ImageData {
  uri: string;
  type: string;
  name: string;
}

type FileInfoWithSize = {
  exists: boolean;
  uri: string;
  size?: number;
  isDirectory: boolean;
};

type RootStackParamList = {
  Home: undefined;
  DiseaseDetection: undefined;
  // Add other screens as needed
};

type DiseaseDetectionScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'DiseaseDetection'
>;

interface DiseaseDetectionProps {
  navigation: DiseaseDetectionScreenNavigationProp;
}

const DiseaseDetection = ({ navigation }: DiseaseDetectionProps) => {
  const insets = useSafeAreaInsets();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access your photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      analyzeImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access your camera');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      analyzeImage(result.assets[0].uri);
    }
  };

  const analyzeImage = async (imageUri: string) => {
    setLoading(true);
    setResult(null);
    try {
      // Check file size
      const fileInfo = await FileSystem.getInfoAsync(imageUri) as FileInfoWithSize;
      let finalImageUri = imageUri;

      if (fileInfo.exists && fileInfo.size) {
        // If file size is greater than 2048KB (2MB)
        if (fileInfo.size > 2048 * 1024) {
          console.log('Image size is greater than 2MB, compressing...');
          // Compress the image
          const manipResult = await ImageManipulator.manipulateAsync(
            imageUri,
            [{ resize: { width: 1024 } }], // Resize to 1024px width while maintaining aspect ratio
            { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // Compress with 70% quality
          );
          finalImageUri = manipResult.uri;
          
          // Log the new file size
          const newFileInfo = await FileSystem.getInfoAsync(finalImageUri) as FileInfoWithSize;
          console.log('New image size:', newFileInfo.size ? newFileInfo.size / 1024 + 'KB' : 'unknown');
        }
      }

      // Create form data
      const formData = new FormData();
      const imageData: ImageData = {
        uri: finalImageUri,
        type: 'image/jpeg',
        name: 'image.jpg',
      };
      
      // Log the image data for debugging
      console.log('Image Data:', imageData);
      
      formData.append('image', imageData as any);

      // Log the form data for debugging
      console.log('Form Data:', formData);

      // Make API request
      const response = await axios.post('https://leafeye.eu-1.sharedwithexpose.com/api/disease_detection', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
      });

      if (response.data) {
        setResult(response.data);
      } else {
        throw new Error('No data received from server');
      }
    } catch (error: any) {
      console.error('Error analyzing image:', error);
      
      // Log detailed error information
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error Response Data:', error.response.data);
        console.error('Error Response Status:', error.response.status);
        console.error('Error Response Headers:', error.response.headers);
        
        Alert.alert(
          'Error',
          `Failed to analyze image: ${error.response.data.message || 'Server error'}`,
          [{ text: 'OK' }]
        );
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error Request:', error.request);
        Alert.alert(
          'Error',
          'No response from server. Please check your internet connection.',
          [{ text: 'OK' }]
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error Message:', error.message);
        Alert.alert(
          'Error',
          'Failed to analyze image. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#3D7054" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <SvgXml xml={iconBack} width={24} height={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Disease Detection</Text>
          <Text style={styles.headerSubtitle}>Upload a leaf image to detect diseases</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formSection}>
          {/* Image Upload Section */}
          <View style={styles.imageUploadSection}>
            <View style={styles.imageContainer}>
              {selectedImage ? (
                <Image 
                  source={{ uri: selectedImage }} 
                  style={styles.selectedImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.placeholderImage}>
                  <SvgXml xml={iconCamera} width={40} height={40} color="#3D7054" />
                  <Text style={styles.placeholderText}>No image selected</Text>
                </View>
              )}
            </View>
            <View style={styles.imageButtonsContainer}>
              <TouchableOpacity 
                style={styles.imageButton}
                onPress={pickImage}
              >
                <SvgXml xml={iconCamera} width={20} height={20} color="#FFFFFF" />
                <Text style={styles.imageButtonText}>Upload Image</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.imageButton}
                onPress={takePhoto}
              >
                <SvgXml xml={iconCamera} width={20} height={20} color="#FFFFFF" />
                <Text style={styles.imageButtonText}>Take Photo</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Results Section */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3D7054" />
              <Text style={styles.loadingText}>Analyzing image...</Text>
            </View>
          ) : result ? (
            <View style={styles.resultSection}>
              <Text style={styles.resultTitle}>Detection Results</Text>
              <View style={styles.resultCard}>
                {result.disease && result.disease.includes('___') ? (
                  <>
                    <Text style={styles.plantType}>Plant Type: {result.disease.split('___')[0]}</Text>
                    <Text style={styles.diseaseName}>Disease: {result.disease.split('___')[1]}</Text>
                  </>
                ) : (
                  <Text style={styles.diseaseName}>{result.disease}</Text>
                )}
                <Text style={styles.confidenceText}>Confidence: {result.confidence}</Text>
                <Text style={styles.descriptionText}>{result.description}</Text>
                <Text style={styles.treatmentTitle}>Recommended Treatment:</Text>
                {result.recommendations && result.recommendations.map((recommendation: string, index: number) => (
                  <View key={index} style={styles.recommendationItem}>
                    <Text style={styles.recommendationBullet}>•</Text>
                    <Text style={styles.recommendationText}>{recommendation}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>
      
      <BottomNav />
    </SafeAreaView>
  );
};

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
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 120,
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  imageUploadSection: {
    marginBottom: 20,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 16,
    color: '#757575',
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  imageButton: {
    flex: 1,
    backgroundColor: '#3D7054',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  imageButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#3D7054',
  },
  resultSection: {
    marginTop: 20,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  resultCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
  },
  plantType: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 8,
  },
  diseaseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  confidenceText: {
    fontSize: 16,
    color: '#3D7054',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    color: '#424242',
    marginBottom: 16,
    lineHeight: 24,
  },
  treatmentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 8,
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 8,
  },
  recommendationBullet: {
    fontSize: 16,
    color: '#3D7054',
    marginRight: 8,
  },
  recommendationText: {
    flex: 1,
    fontSize: 16,
    color: '#424242',
    lineHeight: 24,
  },
});

export default DiseaseDetection;