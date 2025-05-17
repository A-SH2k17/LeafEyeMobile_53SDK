// SimplifiedFertilizerRecommendation.jsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  StatusBar,
  StyleSheet,
  Platform,
  TextInput,
  Alert,
  Modal
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import BottomNav from '@/components/nonprimitive/BottomNav';

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
type RootStackParamList = {
  Home: undefined;
  FertilizerRecommendation: undefined;
  // Add other screens as needed
};

type FertilizerRecommendationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'FertilizerRecommendation'
>;

interface FertilizerRecommendationProps {
  navigation: FertilizerRecommendationScreenNavigationProp;
}


const FertilizerRecommendation = ({ navigation }: FertilizerRecommendationProps) => {
  const insets = useSafeAreaInsets();
  const [soilType, setSoilType] = useState('');
  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [cropType, setCropType] = useState('');
  const [showResults, setShowResults] = useState(false);
  
  // Modal state for improved dropdowns
  const [soilModalVisible, setSoilModalVisible] = useState(false);
  const [cropModalVisible, setCropModalVisible] = useState(false);

  // Sample soil types
  const soilTypes = [
    'Clay',
    'Sandy',
    'Silt',
    'Loam',
    'Peat',
    'Chalky'
  ];
  
  // Sample crop types
  const cropTypes = [
    'Tomato',
    'Pepper',
    'Cucumber',
    'Lettuce',
    'Rose',
    'Succulent',
    'Fern',
    'Monstera',
    'Fiddle Leaf Fig'
  ];
  
  // Simplified fertilizer recommendation function
  const getFertilizerRecommendation = () => {
    // Use combination of inputs to determine recommendation
    if (soilType === 'Clay' && cropType === 'Tomato') {
      return {
        name: 'Super Tomato Boost',
        npk: '5-10-5',
        applicationRate: '1 tbsp per gallon of water',
        frequency: 'Every 2 weeks',
        notes: 'Ideal for clay soils that tend to retain nutrients but may lack proper drainage.'
      };
    } else if (soilType === 'Sandy' && cropType === 'Succulent') {
      return {
        name: 'Desert Bloom Formula',
        npk: '2-7-7',
        applicationRate: '1/2 tsp per gallon',
        frequency: 'Monthly',
        notes: 'Low nitrogen formula perfect for succulents in fast-draining sandy soil.'
      };
    } else {
      return {
        name: 'Universal Plant Food',
        npk: '10-10-10',
        applicationRate: '1 tbsp per gallon of water',
        frequency: 'Every 3-4 weeks',
        notes: 'Balanced formula suitable for most plants. Adjust frequency based on growth rate and season.'
      };
    }
  };

  const handleGenerateRecommendation = () => {
    // Simple validation
    if (!soilType || !temperature || !humidity || !cropType) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }
    
    setShowResults(true);
  };

  const resetForm = () => {
    setSoilType('');
    setTemperature('');
    setHumidity('');
    setCropType('');
    setShowResults(false);
  };

  // Simplified modal selection components
  const SoilSelectionModal = () => (
    <Modal
      visible={soilModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setSoilModalVisible(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={() => setSoilModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Soil Type</Text>
          {soilTypes.map((soil, index) => (
            <TouchableOpacity
              key={index}
              style={styles.modalItem}
              onPress={() => {
                setSoilType(soil);
                setSoilModalVisible(false);
              }}
            >
              <Text style={styles.modalItemText}>{soil}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const CropSelectionModal = () => (
    <Modal
      visible={cropModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setCropModalVisible(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={() => setCropModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Plant Type</Text>
          {cropTypes.map((crop, index) => (
            <TouchableOpacity
              key={index}
              style={styles.modalItem}
              onPress={() => {
                setCropType(crop);
                setCropModalVisible(false);
              }}
            >
              <Text style={styles.modalItemText}>{crop}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#3D7054" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
        >
          <SvgXml xml={iconBack} width={24} height={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Fertilizer Recommendation</Text>
          <Text style={styles.headerSubtitle}>Find the perfect fertilizer for your plants</Text>
        </View>
      </View>

      {/* Modals for Selection */}
      <SoilSelectionModal />
      <CropSelectionModal />

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {!showResults ? (
          /* Input Form */
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Enter Plant Details</Text>
            
            {/* Soil Type Selector */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabel}>
                <SvgXml xml={iconSoil} width={22} height={22} color="#3D7054" />
                <Text style={styles.labelText}>Soil Type</Text>
              </View>
              <TouchableOpacity 
                style={styles.selector}
                onPress={() => setSoilModalVisible(true)}
              >
                <Text style={soilType ? styles.selectorValue : styles.selectorPlaceholder}>
                  {soilType || 'Select soil type'}
                </Text>
                <SvgXml xml={iconDropdown} width={20} height={20} color="#3D7054" />
              </TouchableOpacity>
            </View>
            
            {/* Temperature Input */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabel}>
                <SvgXml xml={iconTemp} width={22} height={22} color="#3D7054" />
                <Text style={styles.labelText}>Temperature (°F)</Text>
              </View>
              <TextInput
                style={styles.textInput}
                value={temperature}
                onChangeText={setTemperature}
                placeholder="Enter temperature"
                keyboardType="numeric"
                placeholderTextColor="#AAA"
              />
            </View>
            
            {/* Humidity Input */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabel}>
                <SvgXml xml={iconHumidity} width={22} height={22} color="#3D7054" />
                <Text style={styles.labelText}>Humidity (%)</Text>
              </View>
              <TextInput
                style={styles.textInput}
                value={humidity}
                onChangeText={setHumidity}
                placeholder="Enter humidity"
                keyboardType="numeric"
                placeholderTextColor="#AAA"
              />
            </View>
            
            {/* Crop Type Selector */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabel}>
                <SvgXml xml={iconPlant} width={22} height={22} color="#3D7054" />
                <Text style={styles.labelText}>Plant Type</Text>
              </View>
              <TouchableOpacity 
                style={styles.selector}
                onPress={() => setCropModalVisible(true)}
              >
                <Text style={cropType ? styles.selectorValue : styles.selectorPlaceholder}>
                  {cropType || 'Select plant type'}
                </Text>
                <SvgXml xml={iconDropdown} width={20} height={20} color="#3D7054" />
              </TouchableOpacity>
            </View>
            
            {/* Submit Button */}
            <TouchableOpacity
              style={styles.recommendButton}
              onPress={handleGenerateRecommendation}
            >
              <SvgXml xml={iconFert} width={24} height={24} color="#FFFFFF" />
              <Text style={styles.recommendButtonText}>Get Recommendation</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Results Section */
          <View style={styles.resultSection}>
            <Text style={styles.sectionTitle}>Recommended Fertilizer</Text>
            
            {/* Summary of inputs */}
            <View style={styles.inputSummary}>
              <View style={styles.summaryItem}>
                <SvgXml xml={iconSoil} width={18} height={18} color="#3D7054" />
                <Text style={styles.summaryText}>{soilType}</Text>
              </View>
              <View style={styles.summaryItem}>
                <SvgXml xml={iconTemp} width={18} height={18} color="#3D7054" />
                <Text style={styles.summaryText}>{temperature}°F</Text>
              </View>
              <View style={styles.summaryItem}>
                <SvgXml xml={iconHumidity} width={18} height={18} color="#3D7054" />
                <Text style={styles.summaryText}>{humidity}%</Text>
              </View>
              <View style={styles.summaryItem}>
                <SvgXml xml={iconPlant} width={18} height={18} color="#3D7054" />
                <Text style={styles.summaryText}>{cropType}</Text>
              </View>
            </View>
            
            {/* Fertilizer details */}
            {(() => {
              const recommendation = getFertilizerRecommendation();
              return (
                <View style={styles.fertilizerCard}>
                  <View style={styles.fertilizerHeader}>
                    <SvgXml xml={iconFert} width={28} height={28} color="#3D7054" />
                    <Text style={styles.fertilizerName}>{recommendation.name}</Text>
                  </View>
                  
                  <View style={styles.npkContainer}>
                    <View style={styles.npkBadge}>
                      <Text style={styles.npkText}>NPK: {recommendation.npk}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.fertilizerDetails}>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Application Rate:</Text>
                      <Text style={styles.detailValue}>{recommendation.applicationRate}</Text>
                    </View>
                    
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Frequency:</Text>
                      <Text style={styles.detailValue}>{recommendation.frequency}</Text>
                    </View>
                    
                    <View style={styles.detailNotes}>
                      <Text style={styles.notesLabel}>Notes:</Text>
                      <Text style={styles.notesText}>{recommendation.notes}</Text>
                    </View>
                  </View>
                </View>
              );
            })()}
            
            {/* Reset Button */}
            <TouchableOpacity
              style={styles.resetButton}
              onPress={resetForm}
            >
              <Text style={styles.resetButtonText}>Try Different Parameters</Text>
            </TouchableOpacity>
          </View>
        )}
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
    paddingBottom: 120, // Extra space for the tab bar
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  labelText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#3D7054',
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selector: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectorValue: {
    fontSize: 16,
    color: '#333333',
  },
  selectorPlaceholder: {
    fontSize: 16,
    color: '#AAA',
  },
  // Modal styles for selection
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#3D7054',
    textAlign: 'center',
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  recommendButton: {
    backgroundColor: '#3D7054',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginTop: 16,
  },
  recommendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  resultSection: {
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
  inputSummary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    width: '48%',
  },
  summaryText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#424242',
  },
  fertilizerCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  fertilizerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  fertilizerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginLeft: 8,
  },
  npkContainer: {
    marginBottom: 16,
  },
  npkBadge: {
    backgroundColor: '#3D7054',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  npkText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  fertilizerDetails: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 8,
  },
  detailLabel: {
    fontWeight: '500',
    color: '#424242',
    fontSize: 15,
  },
  detailValue: {
    color: '#3D7054',
    fontWeight: '500',
    fontSize: 15,
  },
  detailNotes: {
    marginTop: 4,
  },
  notesLabel: {
    fontWeight: '500',
    color: '#424242',
    fontSize: 15,
    marginBottom: 4,
  },
  notesText: {
    color: '#757575',
    fontSize: 14,
    lineHeight: 20,
  },
  resetButton: {
    backgroundColor: '#A6C5A7',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginTop: 8,
  },
  resetButtonText: {
    color: '#3D7054',
    fontSize: 16,
    fontWeight: '600',
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#A6C5A7',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabItemCenter: {
    width: 60,
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: '#3D7054',
    fontWeight: '500',
  },
  activeTab: {
    backgroundColor: 'rgba(61, 112, 84, 0.1)',
    borderRadius: 8,
    paddingVertical: 4,
  },
  activeTabText: {
    fontWeight: '700',
  },
  identifyButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 50 : 30,
    alignSelf: 'center',
    backgroundColor: '#3D7054',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  identifyText: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 4,
    alignSelf: 'center',
    fontSize: 12,
    fontWeight: '500',
    color: '#3D7054',
  }
});

export default FertilizerRecommendation;