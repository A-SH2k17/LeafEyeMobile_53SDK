// LeafEyeMainMenu.jsx
import BottomNav from '@/components/nonprimitive/BottomNav';
import { styles as baseStyles } from '@/stylesheet/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

// SVG icons as XML strings
const iconLeaf = `
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M11 20A7 7 0 0 1 4 13C4 9.25 7 6 11 7h1a8 8 0 0 0 8 8c0 4.75-3.25 7.75-7 7.75h-2z"/>
  <path d="M6.59 11.41a4.07 4.07 0 0 0 0 5.66 4.07 4.07 0 0 0 5.66 0"/>
  <path d="M5 10c4.58-3.25 6.25-3.17 15-5"/>
</svg>
`;

const iconSearch = `
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="11" cy="11" r="8"/>
  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
</svg>
`;



const iconMessage = `
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
</svg>
`;

const iconBook = `
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
</svg>
`;

const iconUser = `
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
  <circle cx="12" cy="7" r="4"/>
</svg>
`;

const iconBell = `
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
</svg>
`;

const iconFert = `
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <!-- Leaf shape with stem -->
  <path d="M20,4 C15,1 6,1 4,10 C2,19 10,22 18,16 C18,16 20,5 12,10 M4,10 C4,10 8,12 12,10 M12,10 C12,10 16,8 18,16 M12,10 L12,21"/>
</svg>
`
interface Plant {
  datePlanted: string;
  plantType: string;
  image: string;
  monitor_id: number; // Adding optional id for navigation
}
// Define the styles before the component
const styles = {
  ...baseStyles,
  profileContainer: {
    position: 'relative' as const,
  },
  profileDropdown: {
    position: 'absolute' as const,
    top: 40,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
    minWidth: 150,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  dropdownItemText: {
    color: '#1F2937',
    fontSize: 16,
  },
};

// Define the type for menu items
interface MenuItem {
  title: string;
  icon: string;
  iconColor: string;
  description: string;
}

const LeafEyeMainMenu = () => {
  const [notificationCount, setNotificationCount] = useState(3);
  const [username, setUsername] = useState<string>('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const menuItems: MenuItem[] = [
    {
      title: 'My Plants',
      icon: iconLeaf,
      iconColor: '#3D7054',
      description: 'Track and manage your plant collection'
    },
    {
      title: 'Fertilizer',
      icon: iconFert,
      iconColor: '#3D7054',
      description: 'Scan and detect plant diseases'
    },
    {
      title: 'LeafEye Chatbot',
      icon: iconMessage,
      iconColor: '#3D7054',
      description: 'Chat with our AI plant expert'
    }
  ];

  const [recentPlants,setRecentPlants]=useState<Plant[]>([]); 

  // Function to get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Function to get username from session
  const getSessionData = async () => {
    try {
      const sessionString = await AsyncStorage.getItem('session');
      if (sessionString) {
        const sessionData = JSON.parse(sessionString);
        if (sessionData.user?.username) {
          setUsername(sessionData.user.username);
        }
      }
    } catch (error) {
      console.error('Error getting session data:', error);
    }
  };

  // Add logout function
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('session');
      router.push('/(logreg)') // Use the root path to navigate to the root index
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Get session data when component mounts
  useEffect(() => {
    getSessionData();
  }, []);

  useEffect(() => {
    getPlants();
  }, []);


  const getPlants = async () => {
    try{
      const response = await axios.get('http://leafeye.test/api/plants_home')
      console.log(response.data.message)
      setRecentPlants(response.data.message)
    }catch(error){
      console.log(error)
    }
  }

  const handleQuick = (item: MenuItem) => {
    switch(item.title) {
      case 'My Plants':
        router.push('/(plant_monitor)');
        break;
      case 'Fertilizer':
        router.push('/(fertilizerreccomendation)');
        break;
      case 'LeafEye Chatbot':
        // Handle chatbot navigation when implemented
        alert('Chatbot feature coming soon!');
        break;
      default:
        alert(item.title);
    }
  };

  const handlePlantPress = (plant: Plant) => {
    // Navigate to plant details screen with the plant data
    router.push({
      pathname: '/(plant_monitor)/monitor',
      params: { 
        plantType: plant.plantType,
        datePlanted: plant.datePlanted,
        image: plant.image,
        id: plant.monitor_id
      }
    });
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#3D7054" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <SvgXml
              xml={`
                <svg width="123" height="36" viewBox="0 0 123 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.227 0.310417C7.27185 1.83905 1.38537 7.82128 0.138104 15.6261C-0.150896 17.4046 0.0316301 20.7558 0.518368 22.4902C1.99379 27.8992 5.55306 32.0736 10.679 34.3959C14.2231 35.998 18.8319 36.439 22.6345 35.5424C23.7601 35.2778 23.2277 35.2631 21.7371 35.513C20.0335 35.7922 16.8545 35.7187 15.0597 35.3513C13.4626 35.0132 10.8615 33.9696 9.34049 33.0436C6.40485 31.2651 3.84948 28.3696 2.52616 25.327C2.06984 24.254 1.33974 21.8876 1.431 21.7847C1.47663 21.7553 1.84169 21.9758 2.23716 22.2992C5.05111 24.548 9.09712 26.4 12.4282 26.9732C14.4208 27.3113 17.5238 27.2672 18.6341 26.8997C20.4746 26.2824 21.661 25.2388 22.528 23.475C23.6688 21.0939 23.0756 18.1689 21.083 16.3316C20.5963 15.9054 20.2465 15.5232 20.2769 15.4938C20.3073 15.4497 21.0374 15.7584 21.8892 16.1699C24.2316 17.3164 25.8744 18.6687 27.1368 20.5353L27.5627 21.1527L27.2585 21.5642C26.8326 22.1522 25.0226 23.7984 24.0339 24.5039C22.2847 25.768 19.8966 26.8115 17.5694 27.3407C15.9875 27.6934 14.8315 27.811 12.5499 27.8404L10.7551 27.8551L10.101 29.6042C9.18838 32.0148 9.17317 32.1617 9.96412 30.6919L10.6486 29.4132L12.4282 29.5013C18.6798 29.7953 25.6918 27.0467 31.4871 22.0199C32.7191 20.9616 32.7495 21.1233 30.9547 19.6975C26.7262 16.3463 21.9805 14.5531 17.3565 14.5531C15.7289 14.5531 15.1813 14.6119 14.4208 14.8618C12.6868 15.4203 11.4395 16.508 10.5878 18.2277C10.1466 19.1243 10.1162 19.286 10.1162 20.8734C10.1162 22.5049 10.1314 22.6078 10.6334 23.5779C11.1201 24.548 11.9263 25.474 12.8541 26.1501C13.2952 26.4588 13.2952 26.4735 12.9302 26.3706C12.1544 26.1795 9.67512 24.9743 8.76249 24.3422C6.96764 23.1076 5.14238 20.8881 5.44659 20.3296C5.68996 19.9033 7.74338 17.9925 8.73207 17.287C9.9337 16.4198 11.9719 15.3909 13.4169 14.9353C15.4703 14.2592 16.7024 14.0681 19.4555 13.9799L22.0869 13.8917L22.3911 13.0833C22.5585 12.6423 22.8931 11.7457 23.1365 11.1137C23.3798 10.4817 23.5624 9.93784 23.5471 9.90844C23.5167 9.89374 23.1973 10.4082 22.8323 11.0696L22.1782 12.2749H19.4251C16.3678 12.2896 15.1357 12.4513 12.626 13.2303C9.55344 14.1857 5.26406 16.5227 2.35884 18.8156C1.75042 19.3007 1.18763 19.6975 1.12679 19.6975C0.959474 19.6975 1.18763 16.6109 1.46142 15.3321C2.1459 12.1132 3.71258 9.24701 6.05501 6.93937C10.7399 2.33879 17.4781 0.766068 23.7905 2.80914C25.418 3.33828 26.209 3.91151 29.4184 6.90998C31.6848 9.02654 33.6774 11.2313 34.7573 12.804C35.7308 14.2151 35.7764 14.4943 34.8334 13.3038C33.6317 11.7898 30.3158 8.65908 28.1255 6.95407C25.8896 5.23437 22.7258 3.1766 22.5128 3.30888C21.9805 3.61755 23.106 7.76248 24.3837 10.2171C26.0873 13.5095 28.4297 15.7584 32.491 18.0072C37.4648 20.7558 38.4383 21.4613 39.2749 22.8871C39.5182 23.3133 39.7768 23.6661 39.8529 23.6661C39.9137 23.6661 40.1114 23.1517 40.294 22.5196C41.1762 19.286 41.237 16.1552 40.4461 13.098C39.3205 8.73257 36.3544 4.9551 32.567 3.04431C30.8634 2.19181 29.6162 1.80965 27.6692 1.54508C26.8022 1.42749 25.5702 1.16292 24.9465 0.957146C22.0717 -0.0129471 18.2235 -0.277515 15.227 0.310417ZM18.1474 16.6991C19.0752 16.993 20.14 17.9337 20.6571 18.8744C20.9918 19.5065 21.0526 19.8151 21.0678 20.7999C21.0678 21.7994 21.007 22.1081 20.6267 22.8283C18.9536 26.1354 13.9797 26.0178 12.3978 22.6225C12.0328 21.8141 11.9871 21.5789 12.048 20.5941C12.124 19.3301 12.3674 18.7862 13.28 17.8309C13.8884 17.1841 14.4664 16.8167 15.2118 16.5962C15.881 16.4051 17.4173 16.4492 18.1474 16.6991Z" fill="#F6FFF7"/>
<path d="M15.6376 19.4918C15.0596 19.7857 14.7098 20.4913 14.8163 21.0939C15.1357 22.696 17.4933 22.8577 17.9648 21.2997C18.3907 19.9474 16.9305 18.8009 15.6376 19.4918Z" fill="#F6FFF7"/>
<path d="M23.5471 35.2337C23.6536 35.2778 23.7905 35.2631 23.8361 35.219C23.897 35.1749 23.8057 35.1308 23.6384 35.1455C23.4711 35.1455 23.4255 35.1896 23.5471 35.2337Z" fill="#F6FFF7"/>
<path d="M42.1378 24V10.9091H44.9055V21.718H50.5178V24H42.1378ZM56.774 24.1918C55.764 24.1918 54.8947 23.9872 54.166 23.5781C53.4416 23.1648 52.8833 22.581 52.4913 21.8267C52.0993 21.0682 51.9032 20.1712 51.9032 19.1357C51.9032 18.1257 52.0993 17.2393 52.4913 16.4766C52.8833 15.7138 53.4352 15.1193 54.1468 14.6932C54.8627 14.267 55.7022 14.054 56.6653 14.054C57.313 14.054 57.916 14.1584 58.4743 14.3672C59.0368 14.5717 59.5268 14.8807 59.9444 15.294C60.3663 15.7074 60.6944 16.2273 60.9288 16.8537C61.1632 17.4759 61.2804 18.2045 61.2804 19.0398V19.7876H52.9899V18.1001H58.7172C58.7172 17.7081 58.6319 17.3608 58.4615 17.0582C58.291 16.7557 58.0545 16.5192 57.752 16.3487C57.4537 16.174 57.1064 16.0866 56.7101 16.0866C56.2967 16.0866 55.9302 16.1825 55.6106 16.3743C55.2953 16.5618 55.0481 16.8153 54.8691 17.1349C54.6902 17.4503 54.5985 17.8018 54.5943 18.1896V19.794C54.5943 20.2798 54.6838 20.6996 54.8627 21.0533C55.046 21.407 55.3038 21.6797 55.6362 21.8714C55.9686 22.0632 56.3627 22.1591 56.8187 22.1591C57.1213 22.1591 57.3983 22.1165 57.6497 22.0312C57.9011 21.946 58.1163 21.8182 58.2953 21.6477C58.4743 21.4773 58.6106 21.2685 58.7044 21.0213L61.2228 21.1875C61.095 21.7926 60.8329 22.321 60.4366 22.7727C60.0446 23.2202 59.5375 23.5696 58.9153 23.821C58.2974 24.0682 57.5836 24.1918 56.774 24.1918ZM65.8571 24.1854C65.2306 24.1854 64.6724 24.0767 64.1824 23.8594C63.6923 23.6378 63.3045 23.3118 63.019 22.8814C62.7377 22.4467 62.5971 21.9055 62.5971 21.2578C62.5971 20.7124 62.6973 20.2543 62.8975 19.8835C63.0978 19.5128 63.3706 19.2145 63.7157 18.9886C64.0609 18.7628 64.4529 18.5923 64.8919 18.4773C65.335 18.3622 65.7995 18.2812 66.2853 18.2344C66.8564 18.1747 67.3166 18.1193 67.666 18.0682C68.0154 18.0128 68.269 17.9318 68.4267 17.8253C68.5843 17.7187 68.6632 17.5611 68.6632 17.3523V17.3139C68.6632 16.9091 68.5353 16.5959 68.2797 16.3743C68.0282 16.1527 67.6703 16.0419 67.2058 16.0419C66.7157 16.0419 66.3258 16.1506 66.036 16.3679C65.7463 16.581 65.5545 16.8494 65.4608 17.1733L62.9423 16.9688C63.0701 16.3722 63.3216 15.8565 63.6966 15.4219C64.0716 14.983 64.5552 14.6463 65.1475 14.4119C65.7441 14.1733 66.4345 14.054 67.2186 14.054C67.764 14.054 68.286 14.1179 68.7846 14.2457C69.2875 14.3736 69.7328 14.5717 70.1206 14.8402C70.5126 15.1087 70.8216 15.4538 71.0474 15.8757C71.2733 16.2933 71.3862 16.794 71.3862 17.3778V24H68.8038V22.6385H68.7271C68.5694 22.9453 68.3585 23.2159 68.0943 23.4503C67.8301 23.6804 67.5126 23.8615 67.1419 23.9936C66.7711 24.1214 66.3429 24.1854 65.8571 24.1854ZM66.6369 22.3061C67.0375 22.3061 67.3912 22.2273 67.698 22.0696C68.0048 21.9077 68.2456 21.6903 68.4203 21.4176C68.595 21.1449 68.6824 20.8359 68.6824 20.4908V19.4489C68.5971 19.5043 68.4799 19.5554 68.3308 19.6023C68.1859 19.6449 68.0218 19.6854 67.8386 19.7237C67.6554 19.7578 67.4721 19.7898 67.2889 19.8196C67.1056 19.8452 66.9395 19.8686 66.7903 19.8899C66.4707 19.9368 66.1916 20.0114 65.9529 20.1136C65.7143 20.2159 65.5289 20.3544 65.3968 20.5291C65.2647 20.6996 65.1987 20.9126 65.1987 21.1683C65.1987 21.5391 65.3329 21.8224 65.6014 22.0185C65.8741 22.2102 66.2193 22.3061 66.6369 22.3061ZM78.7786 14.1818V16.2273H72.7189V14.1818H78.7786ZM74.106 24V13.4723C74.106 12.7607 74.2445 12.1705 74.5215 11.7017C74.8027 11.233 75.1863 10.8814 75.6721 10.647C76.1578 10.4126 76.7097 10.2955 77.3276 10.2955C77.7452 10.2955 78.1266 10.3274 78.4718 10.3913C78.8212 10.4553 79.0811 10.5128 79.2516 10.5639L78.7658 12.6094C78.6593 12.5753 78.5272 12.5433 78.3695 12.5135C78.2161 12.4837 78.0584 12.4688 77.8965 12.4688C77.4959 12.4688 77.2168 12.5625 77.0591 12.75C76.9015 12.9332 76.8226 13.1911 76.8226 13.5234V24H74.106ZM86.2077 17.544V19.7045H80.2376V17.544H86.2077ZM88.5792 24V10.9091H97.4002V13.1911H91.3469V16.3104H96.9464V18.5923H91.3469V21.718H97.4258V24H88.5792ZM98.8336 10.9091H101.934L104.919 16.5469H105.047L108.032 10.9091H111.132L106.357 19.3722V24H103.608V19.3722L98.8336 10.9091ZM112.644 24V10.9091H121.465V13.1911H115.411V16.3104H121.011V18.5923H115.411V21.718H121.49V24H112.644Z" fill="#F6FFF7"/>
</svg>

              `}
              width={120}
              height={30}
              color="#018269"
            />
            <Text style={styles.greeting}>
              {getGreeting()}, {username || 'Gardener'}!
            </Text>
          </View>
          <View style={styles.headerActions}>
            <View style={styles.profileContainer}>
              <TouchableOpacity 
                style={styles.profileButton}
                onPress={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                <SvgXml xml={iconUser} width={26} height={26} color="#FFFFFF" />
              </TouchableOpacity>
              
              {isProfileMenuOpen && (
                <View style={styles.profileDropdown}>
                  <TouchableOpacity 
                    style={styles.dropdownItem}
                    onPress={() => {
                      setIsProfileMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    <Text style={styles.dropdownItemText}>Logout</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickActionsScrollContent}
        >
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.quickActionItem}
              onPress={()=>handleQuick(item)}
            >
              <SvgXml xml={item.icon} width={32} height={32} color={item.iconColor} />
              <Text style={styles.quickActionText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Recent Plants */}
      <View style={styles.recentPlantsSection}>
        <Text style={styles.sectionTitle}>Recent Plants</Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.recentPlantsContent}
        >
          {recentPlants.map((plant, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.plantCard}
              onPress={() => handlePlantPress(plant)}
            >
              <TouchableOpacity 
                style={styles.plantIconContainer}
                onPress={() => handlePlantPress(plant)}
              >
                <Image 
                  source={{uri: plant.image}} 
                  style={{ width: 60, height: 60, borderRadius: 10}} 
                  resizeMode='cover'
                />
              </TouchableOpacity>
              <View style={styles.plantInfo}>
                <Text style={styles.plantName}>{plant.plantType}</Text>
                <View style={styles.plantStatusRow}>
                  <Text style={styles.plantWatered}>Planted {plant.datePlanted}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <BottomNav />
    </SafeAreaView>
  );
};

// Wrap component with SafeAreaProvider in your app entry
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// <SafeAreaProvider><LeafEyeMainMenu /></SafeAreaProvider>

export default LeafEyeMainMenu;