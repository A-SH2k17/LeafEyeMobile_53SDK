import BottomNav from '@/components/nonprimitive/BottomNav';
import { styles as baseStyles } from '@/stylesheet/styles';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Image, Modal, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { crops } from '../(fertilizerreccomendation)/cropsData';

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
  disease_id?: string,
  disease?: string,
  collection_name?: string,
  treatment?: string,
}

const PlantDetailsScreen = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { plantType, datePlanted, image, id, collection_name } = params;
  
  // Add logging to check params
  console.log('Route params:', params);
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [images, setImages] = useState<Plant[]>([]);
  const [currentCollectionName, setCurrentCollectionName] = useState<string | undefined>(collection_name as string);
  const [tabIndex, setTabIndex] = useState(0);
  const [routes] = useState([
    { key: 'timeline', title: 'Timeline' },
    { key: 'info', title: 'Plant Info' },
    { key: 'care', title: 'Plant Care' },
  ]);

  useEffect(() => {
    getPlants();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getPlants();
    }, [])
  );

  const getPlants = async () => {
    try {
      const response = await axios.post('https://leafeye.eu-1.sharedwithexpose.com/api/monitor_images', {
        monitor_id: id,
      });
      console.log('API Response:', JSON.stringify(response.data.message, null, 2));
      setImages(response.data.message);
    } catch (error) {
      console.log('API Error:', error);
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

  // Helper to map plantType to crop name
  function getCropData(plantType: string) {
    // Normalize plantType for matching
    const normalized = plantType.toLowerCase().replace(/\s*\(.*\)/, '').replace('pepper bell', 'bell pepper');
    return crops.find(crop => crop.name.toLowerCase() === normalized);
  }

  // Timeline Tab
  const TimelineRoute = () => {
    const [treatmentModalVisible, setTreatmentModalVisible] = useState(false);
    const [treatmentText, setTreatmentText] = useState('');
    return (
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={{ position: 'relative', paddingLeft: 32 }}>
          {/* Vertical timeline line */}
          <View style={{
            position: 'absolute',
            left: 15,
            top: 0,
            bottom: 0,
            width: 2,
            backgroundColor: '#3D7054',
            borderRadius: 1,
          }} />
          {/* Planted on section */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 32 }}>
            <View style={{
              width: 32,
              alignItems: 'center',
              zIndex: 1,
            }}>
              <View style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: '#3D7054',
                borderWidth: 2,
                borderColor: '#F6FFF7',
                marginTop: 4,
                marginBottom: 4,
              }} />
              <Ionicons name="leaf" size={20} color="#3D7054" style={{ marginTop: 4 }} />
            </View>
            <View style={[styles.monitorCard, { flex: 1, marginLeft: 0 }]}> 
              <View style={styles.monitorInfo}>
                <Text style={styles.monitorDate}>Planted on {datePlanted}</Text>
              </View>
            </View>
          </View>
          {/* Diagnose button - Moved to top */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 32 }}>
            <View style={{ width: 32, alignItems: 'center', zIndex: 1 }}>
              <View style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: '#3D7054',
                borderWidth: 2,
                borderColor: '#F6FFF7',
                marginTop: 4,
                marginBottom: 4,
              }} />
              <Ionicons name="camera" size={20} color="#3D7054" style={{ marginTop: 4 }} />
            </View>
            <TouchableOpacity
              style={{
                flex: 1,
                marginLeft: 0,
                backgroundColor: '#3D7054',
                borderRadius: 8,
                padding: 16,
                alignItems: 'center',
                elevation: 4,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
              }}
              onPress={() => {
                router.push({
                  pathname: '/(disease)',
                  params: { monitor_id: id, collection_name: currentCollectionName }
                });
              }}
            >
              <Text style={{color: 'white', fontWeight: 'bold', fontSize: 16}}>Diagnose</Text>
            </TouchableOpacity>
          </View>
          {/* Previous diagnoses */}
          {[...images]
            .sort((a, b) => b.id - a.id)
            .map((plant, idx) => (
            <View key={plant.id} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 32 }}>
              <View style={{
                width: 32,
                alignItems: 'center',
                zIndex: 1,
              }}>
                <View style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: '#3D7054',
                  borderWidth: 2,
                  borderColor: '#F6FFF7',
                  marginTop: 4,
                  marginBottom: 4,
                }} />
                <Ionicons name="flask" size={20} color="#3D7054" style={{ marginTop: 4 }} />
              </View>
              <View style={[styles.monitorCard, { flex: 1, marginLeft: 0 }]}> 
                <TouchableOpacity onPress={() => handleImagePress(plant.image)}>
                  <Image source={{ uri: plant.image }} style={styles.monitorImage} resizeMode="cover" />
                </TouchableOpacity>
                <View style={styles.monitorInfo}>
                  <Text style={styles.monitorDate}>Diagnosed on {plant.datePlanted}</Text>
                  <View style={styles.diseaseInfo}>
                    <Text style={styles.diseaseName}>
                      Diagnosis: {plant.disease || 'Not Diagnosed'}
                    </Text>
                  </View>
                  {/* Show Treatment Button */}
                  <TouchableOpacity
                    style={{
                      marginTop: 8,
                      backgroundColor: '#E8F5E9',
                      borderRadius: 8,
                      paddingVertical: 8,
                      paddingHorizontal: 16,
                      alignItems: 'center',
                      alignSelf: 'flex-start',
                    }}
                    onPress={() => {
                      setTreatmentText(plant.treatment || 'No treatment information available.');
                      setTreatmentModalVisible(true);
                    }}
                  >
                    <Text style={{ color: '#2E7D32', fontWeight: '600' }}>Show Treatment</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
        {/* Treatment Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={treatmentModalVisible}
          onRequestClose={() => setTreatmentModalVisible(false)}
        >
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}
            activeOpacity={1}
            onPressOut={() => setTreatmentModalVisible(false)}
          >
            <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, maxWidth: 320, alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#2E7D32', marginBottom: 12 }}>Treatment</Text>
              {treatmentText.includes(' | ')
                ? treatmentText.split(' | ').map((item, idx) => (
                    <Text key={idx} style={{ fontSize: 16, color: '#333', textAlign: 'left', marginBottom: 4 }}>• {item.trim()}</Text>
                  ))
                : <Text style={{ fontSize: 16, color: '#333', textAlign: 'center' }}>{treatmentText}</Text>
              }
              <TouchableOpacity
                style={{ marginTop: 20, backgroundColor: '#3D7054', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 24 }}
                onPress={() => setTreatmentModalVisible(false)}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </ScrollView>
    );
  };

  // Plant Info Tab (fully dynamic based on cropsData)
  const InfoRoute = () => {
    const crop = getCropData(Array.isArray(plantType) ? plantType[0] : plantType);

    // Use direct fields from cropsData.ts
    const type = crop?.name || 'Unknown';
    const lifespan = crop?.lifespan || 'N/A';
    const distribution = crop?.distribution || 'N/A';
    const weed = crop?.weed || 'N/A';
    const toxicity = crop?.toxicity || 'N/A';
    const propagation = crop?.propagation || 'N/A';
    const height = crop?.height || 'N/A';
    const spread = crop?.spread || 'N/A';
    const leaf = crop?.leaf || 'N/A';
    const planting = crop?.planting || 'N/A';
    const difficulty = crop?.difficulty || 'N/A';
    const toughness = crop?.toughness || 'N/A';
    const maintenance = crop?.maintenance || 'N/A';
    const perks = crop?.perks || ['N/A'];

    // Still extract care/fertilization text for How-tos
    function extractSection(section: string, text?: string): string | null {
      const regex = new RegExp(section + ':(.*?)(\n\n|$)', 'is');
      const match = text && text.match(regex);
      return match ? match[1].trim() : null;
    }
    const careTips = extractSection('Care Tips', crop?.care);
    const harvesting = extractSection('Harvesting', crop?.care);
    const fertilizerSchedule = extractSection('Fertilizer Schedule', crop?.fertilization);
    const application = extractSection('Application', crop?.fertilization);
    const important = extractSection('Important', crop?.fertilization);

    // UI Card component
    const Card: React.FC<{ children: React.ReactNode; style?: any }> = ({ children, style }) => (
      <View style={[{
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
      }, style]}>
        {children}
      </View>
    );
    // Badge/Chip component
    const Chip: React.FC<{ label: string; icon?: any; color?: string }> = ({ label, icon, color = '#3D7054' }) => (
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F9F0', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, marginRight: 8, marginBottom: 6 }}>
        {icon && <Ionicons name={icon} size={16} color={color} style={{ marginRight: 4 }} />}
        <Text style={{ color, fontWeight: '500', fontSize: 13 }}>{label}</Text>
      </View>
    );
    return (
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoContainer}>
          {/* Plant Name & Planted Date */}
          <Text style={[styles.plantName, { fontSize: 26, color: '#2E7D32', marginBottom: 2 }]}>{plantType}</Text>
          <Text style={[styles.plantDate, { marginBottom: 8 }]}>Planted on: {datePlanted}</Text>
          <View style={styles.collectionRow}>
            {currentCollectionName ? (
              <Text style={styles.collectionName}>Diagnosis Collection: {currentCollectionName}</Text>
            ) : (
              <Text style={styles.collectionName}>No collection assigned</Text>
            )}
          </View>
          <TouchableOpacity 
            style={[styles.reminderButton, { marginBottom: 18 }]}
            onPress={() => Alert.alert(
              'Water Reminder',
              'Would you like to set a reminder to water this plant?',
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Set Reminder',
                  onPress: () => Alert.alert('Success', 'Reminder set successfully!')
                }
              ]
            )}
          >
            <View style={styles.reminderContent}>
              <Ionicons name="alarm" size={18} color="#3D7054" />
              <Text style={styles.reminderText}>Remind to water plant</Text>
            </View>
          </TouchableOpacity>
          {/* Quick Facts */}
          <Card>
            <Text style={styles.sectionTitle}>Quick Facts</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 }}>
              {toxicity && toxicity !== 'N/A' && <Chip icon="leaf" label={toxicity} color="#388e3c" />}
              {propagation && propagation !== 'N/A' && <Chip icon="cut" label={`Propagation: ${propagation}`} color="#388e3c" />}
            </View>
          </Card>
          {/* Basic Info */}
          <Card>
            <Text style={styles.sectionTitle}>Basic Info</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 }}>
              {type && type !== 'N/A' && <Chip icon="leaf-outline" label={`Type: ${type}`} />}
              {lifespan && lifespan !== 'N/A' && <Chip icon="time-outline" label={`Lifespan: ${lifespan}`} />}
              {distribution && distribution !== 'N/A' && <Chip icon="earth" label={`Distribution: ${distribution}`} />}
              {weed && weed !== 'N/A' && <Chip icon="alert-circle-outline" label={`Weed: ${weed}`} />}
              {toxicity && toxicity !== 'N/A' && <Chip icon="medkit-outline" label={`Toxicity: ${toxicity}`} />}
            </View>
          </Card>
          {/* Characteristics */}
          <Card>
            <Text style={styles.sectionTitle}>Characteristics</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 }}>
              {height && height !== 'N/A' && <Chip icon="resize-outline" label={`Height: ${height}`} />}
              {spread && spread !== 'N/A' && <Chip icon="resize" label={`Spread: ${spread}`} />}
              {leaf && leaf !== 'N/A' && <Chip icon="color-palette-outline" label={`Leaf: ${leaf}`} />}
              {planting && planting !== 'N/A' && <Chip icon="calendar-outline" label={`Planting: ${planting}`} />}
            </View>
          </Card>
          {/* Care Profile */}
          <Card>
            <Text style={styles.sectionTitle}>Care Profile</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 }}>
              {difficulty && difficulty !== 'N/A' && <Chip icon="happy-outline" label={`Difficulty: ${difficulty}`} />}
              {toughness && toughness !== 'N/A' && <Chip icon="shield-checkmark-outline" label={`Toughness: ${toughness}`} />}
              {maintenance && maintenance !== 'N/A' && <Chip icon="construct-outline" label={`Maintenance: ${maintenance}`} />}
              {Array.isArray(perks) && perks.filter(p => p && p !== 'N/A').map((perk, i) => <Chip key={i} icon="star-outline" label={perk} />)}
            </View>
          </Card>
          {/* How-tos (dynamic) */}
          <Card>
            <Text style={styles.sectionTitle}>How-tos</Text>
            {careTips && <Text style={{ marginBottom: 8, color: '#3D7054' }}>{careTips}</Text>}
            {harvesting && <Text style={{ marginBottom: 8, color: '#3D7054' }}>{'Harvesting: ' + harvesting}</Text>}
            {fertilizerSchedule && <Text style={{ marginBottom: 8, color: '#3D7054' }}>{fertilizerSchedule}</Text>}
            {application && <Text style={{ marginBottom: 8, color: '#3D7054' }}>{application}</Text>}
            {important && <Text style={{ marginBottom: 8, color: '#d84315' }}>{'⚠️ ' + important}</Text>}
          </Card>
        </View>
      </ScrollView>
    );
  };

  // Plant Care Tab (dynamic)
  const CareRoute = () => {
    const crop = getCropData(Array.isArray(plantType) ? plantType[0] : plantType);
    const [waterReminder, setWaterReminder] = useState(false);
    const [fertilizerReminder, setFertilizerReminder] = useState(false);

    const handleWaterReminderToggle = (value: boolean) => {
      if (!value) {
        Alert.alert(
          'Water Reminder',
          'Are you sure you want to turn off the water reminder?',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Turn Off',
              onPress: () => setWaterReminder(false)
            }
          ]
        );
      } else {
        setWaterReminder(true);
        Alert.alert(
          'Success',
          'Water reminder has been set for every week!',
          [{ text: 'OK' }]
        );
      }
    };

    const handleFertilizerReminderToggle = (value: boolean) => {
      if (!value) {
        Alert.alert(
          'Fertilizer Reminder',
          'Are you sure you want to turn off the fertilizer reminder?',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Turn Off',
              onPress: () => setFertilizerReminder(false)
            }
          ]
        );
      } else {
        setFertilizerReminder(true);
        Alert.alert(
          'Success',
          'Fertilizer reminder has been set for every month!',
          [{ text: 'OK' }]
        );
      }
    };

    if (!crop) {
      return (
        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>No care information found for this plant.</Text>
        </View>
      );
    }
    return (
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>Care Instructions</Text>
          <Text style={{ marginBottom: 12 }}>{crop.care}</Text>
          
          <View style={styles.reminderSection}>
            <View style={styles.reminderRow}>
              <View style={styles.reminderTextContainer}>
                <Text style={styles.reminderTitle}>Water Reminder</Text>
                <Text style={styles.reminderSubtitle}>Remind me every week</Text>
              </View>
              <Switch
                value={waterReminder}
                onValueChange={handleWaterReminderToggle}
                trackColor={{ false: '#767577', true: '#3D7054' }}
                thumbColor={waterReminder ? '#F6FFF7' : '#f4f3f4'}
              />
            </View>

            <View style={styles.reminderRow}>
              <View style={styles.reminderTextContainer}>
                <Text style={styles.reminderTitle}>Fertilizer Reminder</Text>
                <Text style={styles.reminderSubtitle}>Remind me every month</Text>
              </View>
              <Switch
                value={fertilizerReminder}
                onValueChange={handleFertilizerReminderToggle}
                trackColor={{ false: '#767577', true: '#3D7054' }}
                thumbColor={fertilizerReminder ? '#F6FFF7' : '#f4f3f4'}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderScene = SceneMap({
    timeline: TimelineRoute,
    info: InfoRoute,
    care: CareRoute,
  });

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
          <Text style={styles.headerTitle}>
            {plantType}{currentCollectionName ? ` - Diagnosis Collection: ${currentCollectionName}` : ''}
          </Text>
          <View style={styles.backButton} /> 
        </View>
      </View>
      <TabView
        navigationState={{ index: tabIndex, routes }}
        renderScene={renderScene}
        onIndexChange={setTabIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: '#3D7054' }}
            style={{ backgroundColor: '#F0F9F0' }}
            activeColor="#3D7054"
            inactiveColor="#3D7054"
            tabStyle={{}}
          />
        )}
      />
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
    marginBottom: 8,
  },
  collectionName: {
    fontSize: 16,
    color: '#3D7054',
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
  diseaseInfo: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#F0F9F0',
    borderRadius: 6,
  },
  diseaseName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 4,
  },
  confidenceText: {
    fontSize: 12,
    color: '#3D7054',
  },
  collectionRow: {
    marginBottom: 20,
  },
  reminderButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#F0F9F0',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3D7054',
    marginBottom: 20,
  },
  reminderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  reminderText: {
    color: '#3D7054',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  reminderSection: {
    marginVertical: 20,
    backgroundColor: '#F0F9F0',
    borderRadius: 12,
    padding: 16,
  },
  reminderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  reminderTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  reminderSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
});

export default PlantDetailsScreen;