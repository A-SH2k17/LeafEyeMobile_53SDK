import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Modal,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomNav from '../../components/nonprimitive/BottomNav';

const crops = [
  { 
    id: 1, 
    name: 'Tomato', 
    care: `🌱 Growing Basics:
• Sunlight: 6-8 hours daily
• Water: 2-3 times per week
• Soil pH: 6.0-6.8
• Temperature: 65-85°F (18-29°C)

🌿 Care Tips:
• Water at the base of plant
• Stake or cage for support
• Remove suckers for better growth
• Keep leaves dry to prevent disease

🌞 Harvesting:
• Pick when firm and fully colored
• Best in morning when cool
• Store at room temperature`,
    fertilization: `💧 Fertilizer Schedule:
• NPK Ratio: 5-10-10 or 8-32-16
• Amount: 1-2 lbs per 100 sq ft

📅 Application:
• Before planting: Mix into soil
• When fruits appear: Add nitrogen (21-0-0)
• During growth: Add calcium nitrate

⚠️ Important:
• Avoid high nitrogen
• Use calcium to prevent blossom end rot
• Don't over-fertilize`
  },
  { 
    id: 2, 
    name: 'Potato', 
    care: `🌱 Growing Basics:
• Sunlight: 6-8 hours daily
• Water: 1-2 inches per week
• Soil pH: 5.0-6.5
• Temperature: 45-55°F (7-13°C)

🌿 Care Tips:
• Plant in loose, well-draining soil
• Hill soil as plants grow
• Keep soil consistently moist
• Mulch to retain moisture

🌞 Harvesting:
• Wait for foliage to die back
• Dig carefully to avoid damage
• Cure in cool, dark place
• Store in breathable containers`,
    fertilization: `💧 Fertilizer Schedule:
• NPK Ratio: 15-15-15 or 10-10-10
• Amount: 2-3 lbs per 100 sq ft

📅 Application:
• Before planting: Mix into soil
• During growth: Add phosphorus (0-46-0)
• Tuber formation: Add potassium (0-0-50)

⚠️ Important:
• Avoid high nitrogen
• Don't over-water
• Keep soil loose`
  },
  { 
    id: 3, 
    name: 'Sugar Cane', 
    care: 'Sugar cane requires full sun (8-10 hours daily) and warm temperatures (75-95°F/24-35°C). Water deeply 1-2 times per week, providing 1-2 inches of water. Plant in well-draining soil with pH 5.5-6.5. Space plants 4-6 feet apart. Harvest when canes are 12-14 months old, typically when leaves turn yellow. Cut canes at ground level and remove leaves.', 
    fertilization: 'Use NPK ratio of 8-8-8 or 10-10-10 for sugar cane. Apply 2-3 pounds per 100 square feet before planting. Side-dress with nitrogen (46-0-0) every 2-3 months during growing season. Apply potassium sulfate (0-0-50) during cane formation. Avoid high phosphorus as it can reduce sugar content.'
  },
  { 
    id: 4, 
    name: 'Cotton', 
    care: 'Cotton needs 6-8 hours of direct sunlight daily. Water deeply once per week, providing 1-1.5 inches of water. Plant in well-draining soil with pH 5.5-6.5. Maintain temperature between 60-95°F (15-35°C). Space plants 12-18 inches apart. Harvest when bolls open and fibers are fluffy, typically 150-180 days after planting. Pick cotton when weather is dry to prevent mold.', 
    fertilization: 'Use NPK ratio of 20-10-10 or 15-15-15 for cotton. Apply 2-3 pounds per 100 square feet before planting. Side-dress with nitrogen (46-0-0) at first square and first bloom. Apply potassium (0-0-60) during boll development. Avoid excessive nitrogen as it promotes vegetative growth over boll production.'
  },
  { 
    id: 5, 
    name: 'Wheat', 
    care: 'Wheat requires 6-8 hours of sunlight daily. Water needs vary by growth stage: 1 inch per week during tillering, 1.5 inches during heading, and 2 inches during grain filling. Plant in well-draining soil with pH 6.0-7.0. Maintain temperature between 60-75°F (15-24°C) during growing season. Harvest when grain moisture is 13-14%, typically when heads turn golden brown.', 
    fertilization: 'Use NPK ratio of 16-16-16 or 20-20-20 for wheat. Apply 2-3 pounds per 100 square feet before planting. Side-dress with nitrogen (46-0-0) at tillering stage. Apply phosphorus (0-46-0) at planting for root development. Add potassium (0-0-60) during grain filling stage.'
  },
  { 
    id: 6, 
    name: 'Bell Pepper', 
    care: 'Bell peppers need 6-8 hours of direct sunlight daily. Water deeply 2-3 times per week, keeping soil consistently moist. Plant in well-draining soil with pH 6.0-6.8. Maintain temperature between 70-85°F (21-29°C). Space plants 18-24 inches apart. Harvest when fruits are firm and fully colored (green, yellow, red, or orange). Cut stems with pruning shears to avoid damaging plants.', 
    fertilization: 'Use NPK ratio of 5-10-10 or 8-32-16 for bell peppers. Apply 1-2 pounds per 100 square feet before planting. Side-dress with calcium nitrate (15-0-0) when first fruits appear. Apply magnesium sulfate (Epsom salt) during flowering. Avoid high nitrogen as it promotes leaf growth over fruit production.'
  },
  { 
    id: 7, 
    name: 'Strawberry', 
    care: `🌱 Growing Basics:
• Sunlight: 6-8 hours daily
• Water: Keep soil moist
• Soil pH: 5.5-6.5
• Temperature: 60-80°F (15-27°C)

🌿 Care Tips:
• Space plants 12-18 inches apart
• Use straw mulch
• Remove runners (unless propagating)
• Protect from birds

🌞 Harvesting:
• Pick when fully red
• Harvest in morning
• Leave stem attached
• Store in refrigerator`,
    fertilization: `💧 Fertilizer Schedule:
• NPK Ratio: 10-10-10 or 12-12-12
• Amount: 1-2 lbs per 100 sq ft

📅 Application:
• Before planting: Mix into soil
• After first harvest: Add balanced fertilizer
• During flowering: Add potassium (0-0-50)

⚠️ Important:
• Avoid high nitrogen
• Don't over-water
• Keep fruits off soil`
  },
  { 
    id: 8, 
    name: 'Cucumber', 
    care: `🌱 Growing Basics:
• Sunlight: 6-8 hours daily
• Water: 2-3 times per week
• Soil pH: 6.0-7.0
• Temperature: 70-85°F (21-29°C)

🌿 Care Tips:
• Provide trellis for vining types
• Keep soil consistently moist
• Mulch to retain moisture
• Protect from strong winds

🌞 Harvesting:
• Pick when dark green and firm
• Harvest before yellowing
• Cut with sharp knife
• Pick regularly for more fruit`,
    fertilization: `💧 Fertilizer Schedule:
• NPK Ratio: 5-10-10 or 8-32-16
• Amount: 1-2 lbs per 100 sq ft

📅 Application:
• Before planting: Mix into soil
• When vines run: Add nitrogen (21-0-0)
• During growth: Add calcium nitrate

⚠️ Important:
• Avoid high nitrogen
• Prevent blossom end rot
• Keep soil moist`
  },
  { 
    id: 9, 
    name: 'Carrot', 
    care: `🌱 Growing Basics:
• Sunlight: 6-8 hours daily
• Water: Keep soil moist
• Soil pH: 6.0-6.8
• Temperature: 60-75°F (15-24°C)

🌿 Care Tips:
• Plant in loose, sandy soil
• Thin to 2-3 inches apart
• Keep soil surface loose
• Weed carefully

🌞 Harvesting:
• Pull when 1/2 to 1 inch diameter
• Loosen soil before pulling
• Remove tops before storing
• Store in cool, humid place`,
    fertilization: `💧 Fertilizer Schedule:
• NPK Ratio: 5-10-10 or 8-32-16
• Amount: 1-2 lbs per 100 sq ft

📅 Application:
• Before planting: Mix into soil
• During growth: Add phosphorus (0-46-0)
• Root formation: Add potassium (0-0-50)

⚠️ Important:
• Avoid high nitrogen
• Don't over-water
• Keep soil loose`
  },
  { 
    id: 10, 
    name: 'Spinach', 
    care: `🌱 Growing Basics:
• Sunlight: 4-6 hours daily
• Water: Keep soil moist
• Soil pH: 6.0-7.0
• Temperature: 50-70°F (10-21°C)

🌿 Care Tips:
• Space plants 6-8 inches apart
• Plant in cool weather
• Keep soil consistently moist
• Protect from hot sun

🌞 Harvesting:
• Pick outer leaves at 4-6 inches
• Cut at base for new growth
• Harvest in morning
• Store in refrigerator`,
    fertilization: `💧 Fertilizer Schedule:
• NPK Ratio: 10-10-10 or 12-12-12
• Amount: 1-2 lbs per 100 sq ft

📅 Application:
• Before planting: Mix into soil
• Every 2-3 weeks: Add nitrogen (21-0-0)
• If yellowing: Add magnesium sulfate

⚠️ Important:
• Avoid high phosphorus
• Don't let soil dry out
• Watch for bolting`
  },
  { 
    id: 11, 
    name: 'Basil', 
    care: `🌱 Growing Basics:
• Sunlight: 6-8 hours daily
• Water: When soil surface is dry
• Soil pH: 6.0-7.0
• Temperature: 70-85°F (21-29°C)

🌿 Care Tips:
• Pinch off flower buds
• Harvest regularly
• Keep soil moist
• Protect from cold

🌞 Harvesting:
• Cut stems above leaf pairs
• Harvest in morning
• Don't remove more than 1/3
• Store in water or freeze`,
    fertilization: `💧 Fertilizer Schedule:
• NPK Ratio: 10-10-10 or 12-12-12
• Amount: 1 lb per 100 sq ft

📅 Application:
• Before planting: Mix into soil
• Every 4-6 weeks: Add balanced fertilizer
• If yellowing: Add magnesium sulfate

⚠️ Important:
• Avoid high nitrogen
• Don't over-water
• Watch for pests`
  },
  { 
    id: 12, 
    name: 'Green Beans', 
    care: `🌱 Growing Basics:
• Sunlight: 6-8 hours daily
• Water: 2-3 times per week
• Soil pH: 6.0-7.0
• Temperature: 65-85°F (18-29°C)

🌿 Care Tips:
• Provide trellis for pole types
• Keep soil consistently moist
• Mulch to retain moisture
• Rotate crops yearly

🌞 Harvesting:
• Pick when pods snap easily
• Harvest before seeds bulge
• Pick regularly
• Store in refrigerator`,
    fertilization: `💧 Fertilizer Schedule:
• NPK Ratio: 5-10-10 or 8-32-16
• Amount: 1-2 lbs per 100 sq ft

📅 Application:
• Before planting: Mix into soil
• At planting: Add phosphorus (0-46-0)
• During flowering: Add potassium (0-0-50)

⚠️ Important:
• Avoid high nitrogen
• Don't over-water
• Watch for pests`
  }
];

export default function FertilizerRecommendation() {
  const insets = useSafeAreaInsets();
  const [selectedCrop, setSelectedCrop] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });

  const showModal = (title: string, content: string) => {
    setModalContent({ title, content });
    setModalVisible(true);
  };

  const navigateTo = (route: string) => {
    router.push(route);
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#3D7054" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Fertilizer Recommendation</Text>
          <Text style={styles.headerSubtitle}>Select a crop to view care and fertilization details</Text>
        </View>
        <TouchableOpacity 
          onPress={() => router.push('/advanced-fertilization')} 
          style={styles.advancedButton}
        >
          <Text style={styles.advancedButtonText}>Advanced</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {crops.map((crop) => (
          <View key={crop.id} style={styles.cropContainer}>
            <TouchableOpacity
              style={styles.cropButton}
              onPress={() => setSelectedCrop(selectedCrop === crop.id ? null : crop.id)}
            >
              <View style={styles.cropInfo}>
                <Ionicons name="leaf" size={24} color="#3D7054" />
                <Text style={styles.cropName}>{crop.name}</Text>
              </View>
              <Ionicons
                name={selectedCrop === crop.id ? 'chevron-up' : 'chevron-down'}
                size={24}
                color="#3D7054"
              />
            </TouchableOpacity>

            {selectedCrop === crop.id && (
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => showModal('Plant Care', crop.care)}
                >
                  <Ionicons name="water" size={20} color="#FFFFFF" />
                  <Text style={styles.optionText}>Plant Care Information</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => showModal('Fertilization', crop.fertilization)}
                >
                  <Ionicons name="flask" size={20} color="#FFFFFF" />
                  <Text style={styles.optionText}>Fertilization Information</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modalContent.title}</Text>
            <Text style={styles.modalText}>{modalContent.content}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
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
  advancedButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  advancedButtonText: {
    color: '#3D7054',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 120,
  },
  cropContainer: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  cropButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  cropInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cropName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#424242',
    marginLeft: 12,
  },
  optionsContainer: {
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3D7054',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3D7054',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#424242',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#3D7054',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});