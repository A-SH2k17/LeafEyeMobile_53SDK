import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomNav from '../../components/nonprimitive/BottomNav';

const soilColors = [
  'Black',
  'Red',
  'Medium Brown',
  'Dark Brown',
  'Light Brown',
  'Reddish Brown'
];

const cropTypes = [
  'Sugarcane',
  'Jowar',
  'Cotton',
  'Rice',
  'Wheat',
  'Groundnut',
  'Maize',
  'Tur',
  'Urad',
  'Moong',
  'Gram',
  'Masoor',
  'Soybean',
  'Ginger',
  'Turmeric',
  'Grapes'
];

export default function AdvancedFertilization() {
  const insets = useSafeAreaInsets();
  const [formData, setFormData] = useState({
    soil_color: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    ph: '',
    rainfall: '',
    temperature: '',
    crop: ''
  });
  const [showResults, setShowResults] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);
  const [serverResult, setServerResult] = useState<any>(null);
  
  // Modal state for improved dropdowns
  const [soilColorModalVisible, setSoilColorModalVisible] = useState(false);
  const [cropModalVisible, setCropModalVisible] = useState(false);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.soil_color) newErrors.soil_color = 'Soil color is required';
    if (!formData.nitrogen) newErrors.nitrogen = 'Nitrogen is required';
    if (!formData.phosphorus) newErrors.phosphorus = 'Phosphorus is required';
    if (!formData.potassium) newErrors.potassium = 'Potassium is required';
    if (!formData.ph) newErrors.ph = 'pH is required';
    if (!formData.rainfall) newErrors.rainfall = 'Rainfall is required';
    if (!formData.temperature) newErrors.temperature = 'Temperature is required';
    if (!formData.crop) newErrors.crop = 'Crop type is required';

    // Additional validation rules
    const ph = parseFloat(formData.ph);
    if (ph < 1.5 || ph > 8) {
      newErrors.ph = 'pH must be between 1.5 and 8';
    }

    const temp = parseInt(formData.temperature);
    if (temp > 50) {
      newErrors.temperature = 'Temperature must be less than 50°C';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerateRecommendation = async () => {
    if (!validateForm()) {
      return;
    }
    setShowResults(true);
    setLoading(true);
    setServerResult(null);
    try {
      const response = await axios.post('https://leafeye.eu-1.sharedwithexpose.com/api/fertilizer_recommendation', formData);
      setServerResult(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
      setServerResult({ error: 'Failed to fetch recommendation.' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      soil_color: '',
      nitrogen: '',
      phosphorus: '',
      potassium: '',
      ph: '',
      rainfall: '',
      temperature: '',
      crop: ''
    });
    setErrors({});
    setShowResults(false);
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#3D7054" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Advanced Fertilizer Recommendation</Text>
          <Text style={styles.headerSubtitle}>Find the perfect fertilizer for your plants</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {!showResults ? (
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Enter Soil and Climate Details</Text>
            
            {/* Soil Color Selector */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabel}>
                <Ionicons name="color-palette" size={22} color="#3D7054" />
                <Text style={styles.labelText}>Soil Color</Text>
              </View>
              <TouchableOpacity 
                style={[styles.selector, errors.soil_color && styles.inputError]}
                onPress={() => setSoilColorModalVisible(true)}
              >
                <Text style={formData.soil_color ? styles.selectorValue : styles.selectorPlaceholder}>
                  {formData.soil_color || 'Select soil color'}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#3D7054" />
              </TouchableOpacity>
              {errors.soil_color && <Text style={styles.errorText}>{errors.soil_color}</Text>}
            </View>

            {/* Nitrogen Input */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabel}>
                <Text style={styles.labelText}>Nitrogen (mg/kg)</Text>
              </View>
              <TextInput
                style={[styles.textInput, errors.nitrogen && styles.inputError]}
                value={formData.nitrogen}
                onChangeText={(value) => setFormData(prev => ({ ...prev, nitrogen: value }))}
                placeholder="Enter nitrogen content"
                keyboardType="numeric"
                placeholderTextColor="#AAA"
              />
              {errors.nitrogen && <Text style={styles.errorText}>{errors.nitrogen}</Text>}
            </View>

            {/* Phosphorus Input */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabel}>
                <Text style={styles.labelText}>Phosphorus (mg/kg)</Text>
              </View>
              <TextInput
                style={[styles.textInput, errors.phosphorus && styles.inputError]}
                value={formData.phosphorus}
                onChangeText={(value) => setFormData(prev => ({ ...prev, phosphorus: value }))}
                placeholder="Enter phosphorus content"
                keyboardType="numeric"
                placeholderTextColor="#AAA"
              />
              {errors.phosphorus && <Text style={styles.errorText}>{errors.phosphorus}</Text>}
            </View>

            {/* Potassium Input */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabel}>
                <Text style={styles.labelText}>Potassium (mg/kg)</Text>
              </View>
              <TextInput
                style={[styles.textInput, errors.potassium && styles.inputError]}
                value={formData.potassium}
                onChangeText={(value) => setFormData(prev => ({ ...prev, potassium: value }))}
                placeholder="Enter potassium content"
                keyboardType="numeric"
                placeholderTextColor="#AAA"
              />
              {errors.potassium && <Text style={styles.errorText}>{errors.potassium}</Text>}
            </View>

            {/* pH Input */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabel}>
                <Text style={styles.labelText}>pH</Text>
              </View>
              <TextInput
                style={[styles.textInput, errors.ph && styles.inputError]}
                value={formData.ph}
                onChangeText={(value) => setFormData(prev => ({ ...prev, ph: value }))}
                placeholder="Enter soil pH (1.5-8)"
                keyboardType="numeric"
                placeholderTextColor="#AAA"
              />
              {errors.ph && <Text style={styles.errorText}>{errors.ph}</Text>}
            </View>

            {/* Rainfall Input */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabel}>
                <Text style={styles.labelText}>Rainfall (mm)</Text>
              </View>
              <TextInput
                style={[styles.textInput, errors.rainfall && styles.inputError]}
                value={formData.rainfall}
                onChangeText={(value) => setFormData(prev => ({ ...prev, rainfall: value }))}
                placeholder="Enter rainfall"
                keyboardType="numeric"
                placeholderTextColor="#AAA"
              />
              {errors.rainfall && <Text style={styles.errorText}>{errors.rainfall}</Text>}
            </View>

            {/* Temperature Input */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabel}>
                <Text style={styles.labelText}>Temperature (°C)</Text>
              </View>
              <TextInput
                style={[styles.textInput, errors.temperature && styles.inputError]}
                value={formData.temperature}
                onChangeText={(value) => setFormData(prev => ({ ...prev, temperature: value }))}
                placeholder="Enter temperature (max 50°C)"
                keyboardType="numeric"
                placeholderTextColor="#AAA"
              />
              {errors.temperature && <Text style={styles.errorText}>{errors.temperature}</Text>}
            </View>

            {/* Crop Type Selector */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabel}>
                <Ionicons name="leaf" size={22} color="#3D7054" />
                <Text style={styles.labelText}>Crop Type</Text>
              </View>
              <TouchableOpacity 
                style={[styles.selector, errors.crop && styles.inputError]}
                onPress={() => setCropModalVisible(true)}
              >
                <Text style={formData.crop ? styles.selectorValue : styles.selectorPlaceholder}>
                  {formData.crop || 'Select crop type'}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#3D7054" />
              </TouchableOpacity>
              {errors.crop && <Text style={styles.errorText}>{errors.crop}</Text>}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.recommendButton}
              onPress={handleGenerateRecommendation}
            >
              <Ionicons name="flask" size={24} color="#FFFFFF" />
              <Text style={styles.recommendButtonText}>Get Recommendation</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.resultSection}>
            {loading ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                <ActivityIndicator size="large" color="#3D7054" />
                <Text style={{ marginTop: 16, color: '#3D7054' }}>Loading recommendation...</Text>
              </View>
            ) : serverResult && !serverResult.error ? (
              <>
                <Text style={styles.sectionTitle}>Recommended Fertilizer</Text>
                
                {/* Summary of inputs */}
                <View style={styles.inputSummary}>
                  <View style={styles.summaryItem}>
                    <Ionicons name="color-palette" size={18} color="#3D7054" />
                    <Text style={styles.summaryText}>Soil: {formData.soil_color}</Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryText}>N: {formData.nitrogen} mg/kg</Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryText}>P: {formData.phosphorus} mg/kg</Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryText}>K: {formData.potassium} mg/kg</Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryText}>pH: {formData.ph}</Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryText}>Rainfall: {formData.rainfall} mm</Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryText}>Temp: {formData.temperature}°C</Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Ionicons name="leaf" size={18} color="#3D7054" />
                    <Text style={styles.summaryText}>Crop: {formData.crop}</Text>
                  </View>
                </View>
                
                {/* Fertilizer details */}
                <View style={styles.fertilizerCard}>
                  <View style={styles.fertilizerHeader}>
                    <Ionicons name="flask" size={28} color="#3D7054" />
                    <Text style={styles.fertilizerName}>Custom Fertilizer Recommendation</Text>
                  </View>
                  
                  <View style={styles.npkContainer}>
                    <View style={styles.npkBadge}>
                      <Text style={styles.npkText}>{serverResult.fertilizer}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.fertilizerDetails}>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Soil Analysis:</Text>
                      <Text style={styles.detailValue}>{formData.soil_color} soil, pH {formData.ph}</Text>
                    </View>
                    
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Climate Conditions:</Text>
                      <Text style={styles.detailValue}>{formData.temperature}°C, {formData.rainfall}mm rainfall</Text>
                    </View>
                    
                    <View style={styles.detailNotes}>
                      <Text style={styles.notesLabel}>About the fertilizer:</Text>
                      <Text style={styles.notesText}>
                        Based on your {formData.crop} crop requirements and current soil conditions, 
                        we recommend {serverResult.fertilizer}.
                        {serverResult.description}
                      </Text>
                    </View>
                  </View>
                </View>
              </>
            ) : (
              <Text style={{ color: 'red', textAlign: 'center' }}>{serverResult?.error || 'No result.'}</Text>
            )}
            {/* Reset Button */}
            <TouchableOpacity
              style={styles.resetButton}
              onPress={resetForm}
            >
              <Text style={styles.resetButtonText}>Get Other Recommendation</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Soil Color Selection Modal */}
      <Modal
        visible={soilColorModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSoilColorModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setSoilColorModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Soil Color</Text>
            {soilColors.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={styles.modalItem}
                onPress={() => {
                  setFormData(prev => ({ ...prev, soil_color: color }));
                  setSoilColorModalVisible(false);
                }}
              >
                <Text style={styles.modalItemText}>{color}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Crop Selection Modal */}
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
            <Text style={styles.modalTitle}>Select Crop Type</Text>
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={true}
            >
              {cropTypes.map((crop, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalItem}
                  onPress={() => {
                    setFormData(prev => ({ ...prev, crop }));
                    setCropModalVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{crop}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    height: 400,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
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
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  inputError: {
    borderColor: '#ef4444',
  },
}); 