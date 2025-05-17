import React, { useState } from 'react';
import {Picker} from '@react-native-picker/picker'
import { router, Router } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { styles } from '@/stylesheet/styles';
import Svg, {Path, SvgXml} from 'react-native-svg';

// Define types for our data structures
interface UserData {
  fullName: string;
  userName: string;
  email: string;
  password: string;
  location: string;
  phoneNumber: string;
}

interface ShopData {
  shopName: string;
  location: string;
  email: string;
  storeType: string;
}

type AccountType = 'farmer' | 'business' | null;
type ScreenType = 'signin' | 'accountType' | 'register' | 'shopRegister';

// Main App component that manages navigation between screens
export default function App(): React.JSX.Element {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('signin');
  const [accountType, setAccountType] = useState<AccountType>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  
  // Handle navigation between screens
  const navigateTo = (screen: ScreenType): void => {
    setCurrentScreen(screen);
  };
  
  // Select account type and move to registration form
  const selectAccountType = (type: 'farmer' | 'business'): void => {
    setAccountType(type);
    navigateTo('register');
  };

  // Save user data after registration and navigate based on account type
  const completeRegistration = (formData: UserData): void => {
    setUserData(formData);
    
    // If business account, go to shop registration. If farmer, go to signin
    if (accountType === 'business') {
      navigateTo('shopRegister');
    } else {
      Alert.alert('Success', 'Farmer account created successfully!');
      navigateTo('signin');
    }
  };
  
  // Render the appropriate screen based on currentScreen state
  const renderScreen = (): React.JSX.Element => {
    switch(currentScreen) {
      case 'signin':
        return <SignInScreen navigateTo={navigateTo} />;
      case 'accountType':
        return <AccountTypeScreen selectAccountType={selectAccountType} navigateTo={navigateTo} />;
      case 'register':
        return <RegisterScreen 
                accountType={accountType} 
                completeRegistration={completeRegistration} 
                navigateTo={navigateTo} 
              />;
      case 'shopRegister':
        // Only allow access to shop registration if user data exists
        return userData ? 
          <ShopRegistrationScreen userData={userData} navigateTo={navigateTo} /> : 
          <SignInScreen navigateTo={navigateTo} />;
      default:
        return <SignInScreen navigateTo={navigateTo} />;
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
      {renderScreen()}
    </SafeAreaView>
  );
}

// Define component prop types
interface LogoProps {}

interface SignInScreenProps {
  navigateTo: (screen: ScreenType) => void;
}

interface AccountTypeScreenProps {
  selectAccountType: (type: 'farmer' | 'business') => void;
  navigateTo: (screen: ScreenType) => void;
}

interface RegisterScreenProps {
  accountType: AccountType;
  completeRegistration: (formData: UserData) => void;
  navigateTo: (screen: ScreenType) => void;
}

interface ShopRegistrationScreenProps {
  userData: UserData;
  navigateTo: (screen: ScreenType) => void;
}

// Logo component used across screens
const Logo: React.FC<LogoProps> = () => (
  <View style={styles.logoSignContainer}>
    <SvgXml
    xml={
      `<svg width="200" height="200" viewBox="0 0 82 63" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M35.227 0.310417C27.2719 1.83905 21.3854 7.82128 20.1381 15.6261C19.8491 17.4046 20.0316 20.7558 20.5184 22.4902C21.9938 27.8992 25.5531 32.0736 30.679 34.3959C34.2231 35.998 38.8319 36.439 42.6345 35.5424C43.7601 35.2778 43.2277 35.2631 41.7371 35.513C40.0335 35.7922 36.8545 35.7187 35.0597 35.3513C33.4626 35.0132 30.8615 33.9696 29.3405 33.0436C26.4049 31.2651 23.8495 28.3696 22.5262 25.327C22.0698 24.254 21.3397 21.8876 21.431 21.7847C21.4766 21.7553 21.8417 21.9758 22.2372 22.2992C25.0511 24.548 29.0971 26.4 32.4282 26.9732C34.4208 27.3113 37.5238 27.2672 38.6341 26.8997C40.4746 26.2824 41.661 25.2388 42.528 23.475C43.6688 21.0939 43.0756 18.1689 41.083 16.3316C40.5963 15.9054 40.2465 15.5232 40.2769 15.4938C40.3073 15.4497 41.0374 15.7584 41.8892 16.1699C44.2316 17.3164 45.8744 18.6687 47.1368 20.5353L47.5627 21.1527L47.2585 21.5642C46.8326 22.1522 45.0226 23.7984 44.0339 24.5039C42.2847 25.768 39.8966 26.8115 37.5694 27.3407C35.9875 27.6934 34.8315 27.811 32.5499 27.8404L30.7551 27.8551L30.101 29.6042C29.1884 32.0148 29.1732 32.1617 29.9641 30.6919L30.6486 29.4132L32.4282 29.5013C38.6798 29.7953 45.6918 27.0467 51.4871 22.0199C52.7191 20.9616 52.7495 21.1233 50.9547 19.6975C46.7262 16.3463 41.9805 14.5531 37.3565 14.5531C35.7289 14.5531 35.1813 14.6119 34.4208 14.8618C32.6868 15.4203 31.4395 16.508 30.5878 18.2277C30.1466 19.1243 30.1162 19.286 30.1162 20.8734C30.1162 22.5049 30.1314 22.6078 30.6334 23.5779C31.1201 24.548 31.9263 25.474 32.8541 26.1501C33.2952 26.4588 33.2952 26.4735 32.9302 26.3706C32.1544 26.1795 29.6751 24.9743 28.7625 24.3422C26.9676 23.1076 25.1424 20.8881 25.4466 20.3296C25.69 19.9033 27.7434 17.9925 28.7321 17.287C29.9337 16.4198 31.9719 15.3909 33.4169 14.9353C35.4703 14.2592 36.7024 14.0681 39.4555 13.9799L42.0869 13.8917L42.3911 13.0833C42.5585 12.6423 42.8931 11.7457 43.1365 11.1137C43.3798 10.4817 43.5624 9.93784 43.5471 9.90844C43.5167 9.89374 43.1973 10.4082 42.8323 11.0696L42.1782 12.2749H39.4251C36.3678 12.2896 35.1357 12.4513 32.626 13.2303C29.5534 14.1857 25.2641 16.5227 22.3588 18.8156C21.7504 19.3007 21.1876 19.6975 21.1268 19.6975C20.9595 19.6975 21.1876 16.6109 21.4614 15.3321C22.1459 12.1132 23.7126 9.24701 26.055 6.93937C30.7399 2.33879 37.4781 0.766068 43.7905 2.80914C45.418 3.33828 46.209 3.91151 49.4184 6.90998C51.6848 9.02654 53.6774 11.2313 54.7573 12.804C55.7308 14.2151 55.7764 14.4943 54.8334 13.3038C53.6317 11.7898 50.3158 8.65908 48.1255 6.95407C45.8896 5.23437 42.7258 3.1766 42.5128 3.30888C41.9805 3.61755 43.106 7.76248 44.3837 10.2171C46.0873 13.5095 48.4297 15.7584 52.491 18.0072C57.4648 20.7558 58.4383 21.4613 59.2749 22.8871C59.5182 23.3133 59.7768 23.6661 59.8529 23.6661C59.9137 23.6661 60.1114 23.1517 60.294 22.5196C61.1762 19.286 61.237 16.1552 60.4461 13.098C59.3205 8.73257 56.3544 4.9551 52.567 3.04431C50.8634 2.19181 49.6162 1.80965 47.6692 1.54508C46.8022 1.42749 45.5702 1.16292 44.9465 0.957146C42.0717 -0.0129471 38.2235 -0.277515 35.227 0.310417ZM38.1474 16.6991C39.0752 16.993 40.14 17.9337 40.6571 18.8744C40.9918 19.5065 41.0526 19.8151 41.0678 20.7999C41.0678 21.7994 41.007 22.1081 40.6267 22.8283C38.9536 26.1354 33.9797 26.0178 32.3978 22.6225C32.0328 21.8141 31.9871 21.5789 32.048 20.5941C32.124 19.3301 32.3674 18.7862 33.28 17.8309C33.8884 17.1841 34.4664 16.8167 35.2118 16.5962C35.881 16.4051 37.4173 16.4492 38.1474 16.6991Z" fill="#00796A"/>
<path d="M35.6375 19.4918C35.0595 19.7857 34.7097 20.4913 34.8161 21.0939C35.1356 22.696 37.4932 22.8577 37.9647 21.2997C38.3906 19.9474 36.9304 18.8009 35.6375 19.4918Z" fill="#00796A"/>
<path d="M43.5473 35.2337C43.6537 35.2778 43.7906 35.2631 43.8363 35.219C43.8971 35.1749 43.8058 35.1308 43.6385 35.1455C43.4712 35.1455 43.4256 35.1896 43.5473 35.2337Z" fill="#00796A"/>
<path d="M1.13778 59V45.9091H3.90554V56.718H9.51776V59H1.13778ZM15.774 59.1918C14.764 59.1918 13.8947 58.9872 13.166 58.5781C12.4416 58.1648 11.8833 57.581 11.4913 56.8267C11.0993 56.0682 10.9032 55.1712 10.9032 54.1357C10.9032 53.1257 11.0993 52.2393 11.4913 51.4766C11.8833 50.7138 12.4352 50.1193 13.1468 49.6932C13.8627 49.267 14.7022 49.054 15.6653 49.054C16.313 49.054 16.916 49.1584 17.4743 49.3672C18.0368 49.5717 18.5268 49.8807 18.9444 50.294C19.3663 50.7074 19.6944 51.2273 19.9288 51.8537C20.1632 52.4759 20.2804 53.2045 20.2804 54.0398V54.7876H11.9899V53.1001H17.7172C17.7172 52.7081 17.6319 52.3608 17.4615 52.0582C17.291 51.7557 17.0545 51.5192 16.752 51.3487C16.4537 51.174 16.1064 51.0866 15.7101 51.0866C15.2967 51.0866 14.9302 51.1825 14.6106 51.3743C14.2953 51.5618 14.0481 51.8153 13.8691 52.1349C13.6902 52.4503 13.5985 52.8018 13.5943 53.1896V54.794C13.5943 55.2798 13.6838 55.6996 13.8627 56.0533C14.046 56.407 14.3038 56.6797 14.6362 56.8714C14.9686 57.0632 15.3627 57.1591 15.8187 57.1591C16.1213 57.1591 16.3983 57.1165 16.6497 57.0312C16.9011 56.946 17.1163 56.8182 17.2953 56.6477C17.4743 56.4773 17.6106 56.2685 17.7044 56.0213L20.2228 56.1875C20.095 56.7926 19.8329 57.321 19.4366 57.7727C19.0446 58.2202 18.5375 58.5696 17.9153 58.821C17.2974 59.0682 16.5836 59.1918 15.774 59.1918ZM24.8571 59.1854C24.2306 59.1854 23.6724 59.0767 23.1824 58.8594C22.6923 58.6378 22.3045 58.3118 22.019 57.8814C21.7377 57.4467 21.5971 56.9055 21.5971 56.2578C21.5971 55.7124 21.6973 55.2543 21.8975 54.8835C22.0978 54.5128 22.3706 54.2145 22.7157 53.9886C23.0609 53.7628 23.4529 53.5923 23.8919 53.4773C24.335 53.3622 24.7995 53.2812 25.2853 53.2344C25.8564 53.1747 26.3166 53.1193 26.666 53.0682C27.0154 53.0128 27.269 52.9318 27.4267 52.8253C27.5843 52.7187 27.6632 52.5611 27.6632 52.3523V52.3139C27.6632 51.9091 27.5353 51.5959 27.2797 51.3743C27.0282 51.1527 26.6703 51.0419 26.2058 51.0419C25.7157 51.0419 25.3258 51.1506 25.036 51.3679C24.7463 51.581 24.5545 51.8494 24.4608 52.1733L21.9423 51.9688C22.0701 51.3722 22.3216 50.8565 22.6966 50.4219C23.0716 49.983 23.5552 49.6463 24.1475 49.4119C24.7441 49.1733 25.4345 49.054 26.2186 49.054C26.764 49.054 27.286 49.1179 27.7846 49.2457C28.2875 49.3736 28.7328 49.5717 29.1206 49.8402C29.5126 50.1087 29.8216 50.4538 30.0474 50.8757C30.2733 51.2933 30.3862 51.794 30.3862 52.3778V59H27.8038V57.6385H27.7271C27.5694 57.9453 27.3585 58.2159 27.0943 58.4503C26.8301 58.6804 26.5126 58.8615 26.1419 58.9936C25.7711 59.1214 25.3429 59.1854 24.8571 59.1854ZM25.6369 57.3061C26.0375 57.3061 26.3912 57.2273 26.698 57.0696C27.0048 56.9077 27.2456 56.6903 27.4203 56.4176C27.595 56.1449 27.6824 55.8359 27.6824 55.4908V54.4489C27.5971 54.5043 27.4799 54.5554 27.3308 54.6023C27.1859 54.6449 27.0218 54.6854 26.8386 54.7237C26.6554 54.7578 26.4721 54.7898 26.2889 54.8196C26.1056 54.8452 25.9395 54.8686 25.7903 54.8899C25.4707 54.9368 25.1916 55.0114 24.9529 55.1136C24.7143 55.2159 24.5289 55.3544 24.3968 55.5291C24.2647 55.6996 24.1987 55.9126 24.1987 56.1683C24.1987 56.5391 24.3329 56.8224 24.6014 57.0185C24.8741 57.2102 25.2193 57.3061 25.6369 57.3061ZM37.7786 49.1818V51.2273H31.7189V49.1818H37.7786ZM33.106 59V48.4723C33.106 47.7607 33.2445 47.1705 33.5215 46.7017C33.8027 46.233 34.1863 45.8814 34.6721 45.647C35.1578 45.4126 35.7097 45.2955 36.3276 45.2955C36.7452 45.2955 37.1266 45.3274 37.4718 45.3913C37.8212 45.4553 38.0811 45.5128 38.2516 45.5639L37.7658 47.6094C37.6593 47.5753 37.5272 47.5433 37.3695 47.5135C37.2161 47.4837 37.0584 47.4688 36.8965 47.4688C36.4959 47.4688 36.2168 47.5625 36.0591 47.75C35.9015 47.9332 35.8226 48.1911 35.8226 48.5234V59H33.106ZM45.2077 52.544V54.7045H39.2376V52.544H45.2077ZM47.5792 59V45.9091H56.4002V48.1911H50.3469V51.3104H55.9464V53.5923H50.3469V56.718H56.4258V59H47.5792ZM57.8336 45.9091H60.9338L63.9189 51.5469H64.0467L67.0318 45.9091H70.1319L65.3571 54.3722V59H62.6085V54.3722L57.8336 45.9091ZM71.6436 59V45.9091H80.4647V48.1911H74.4114V51.3104H80.0108V53.5923H74.4114V56.718H80.4902V59H71.6436Z" fill="#00796A"/>
</svg>`
    }
    />
  </View>
);

// Sign In Screen
const SignInScreen: React.FC<SignInScreenProps> = ({ navigateTo }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const handleSignIn = () =>{
    router.push('/(menu)')
  }
  return (
    <View style={styles.screenContainer}>
      <Logo />
      
      <Text style={styles.screenTitle}>Sign In</Text>
      
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email / Username</Text>
          <TextInput 
            style={styles.textInput}
            placeholder="ex: username@email.com"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput 
            style={styles.textInput}
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.primaryButton}
        onPress={()=>handleSignIn()}
      >
        <Text style={styles.primaryButtonText}>Sign In</Text>
      </TouchableOpacity>
      
      <View style={styles.forgotPasswordContainer}>
        <TouchableOpacity>
          <Text style={styles.linkText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>
          Don't have an account?{' '}
          <Text 
            style={styles.linkText}
            onPress={() => navigateTo('accountType')}
          >
            Sign-up
          </Text>
        </Text>
      </View>
    </View>
  );
};

// Account Type Selection Screen
const AccountTypeScreen: React.FC<AccountTypeScreenProps> = ({ selectAccountType, navigateTo }) => {
  return (
    <View style={styles.screenContainer}>
      <Logo />
      
      <Text style={styles.screenTitle}>Create your account</Text>
      <Text style={styles.screenSubtitle}>Choose your account type</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => selectAccountType('farmer')}
        >
          <Text style={styles.primaryButtonText}>Farmer</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.primaryButton, styles.buttonSpacing]}
          onPress={() => selectAccountType('business')}
        >
          <Text style={styles.primaryButtonText}>Business</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>
          Account Already Exists?{' '}
          <Text 
            style={styles.linkText}
            onPress={() => navigateTo('signin')}
          >
            Sign-in
          </Text>
        </Text>
      </View>
    </View>
  );
};

// Registration Screen
const RegisterScreen: React.FC<RegisterScreenProps> = ({ accountType, completeRegistration, navigateTo }) => {
  const [formData, setFormData] = useState<UserData>({
    fullName: '',
    userName: '',
    email: '',
    password: '',
    location: '',
    phoneNumber: ''
  });
  
  const handleChange = (name: keyof UserData, value: string): void => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (): void => {
    // In a real app, we would validate inputs here
    completeRegistration(formData);
  };
  
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.screenContainer}>
        <Logo />
        
        <Text style={styles.screenTitle}>Create your account</Text>
        <Text style={styles.screenSubtitle}>
          {accountType === 'business' ? 'Business Account Registration' : 'Farmer Account Registration'}
        </Text>
        
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput 
              style={styles.textInput}
              placeholder="ex: Waleed Ahmed"
              value={formData.fullName}
              onChangeText={(value) => handleChange('fullName', value)}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>User Name</Text>
            <TextInput 
              style={styles.textInput}
              placeholder="ex: Waleed101"
              value={formData.userName}
              onChangeText={(value) => handleChange('userName', value)}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput 
              style={styles.textInput}
              placeholder="ex: omar@yahoo.com"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(value) => handleChange('email', value)}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput 
              style={styles.textInput}
              placeholder="ex: xxxxxx@1111"
              secureTextEntry
              value={formData.password}
              onChangeText={(value) => handleChange('password', value)}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Location</Text>
            <TextInput 
              style={styles.textInput}
              placeholder="ex: xxxxx@1111"
              value={formData.location}
              onChangeText={(value) => handleChange('location', value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput 
              style={styles.textInput}
              placeholder="ex: +1234567890"
              keyboardType="phone-pad"
              value={formData.phoneNumber}
              onChangeText={(value) => handleChange('phoneNumber', value)}
            />
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={handleSubmit}
        >
          <Text style={styles.secondaryButtonText}>
            {accountType === 'business' ? 'Continue to Shop Registration' : 'Register'}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            Account Already Exists?{' '}
            <Text 
              style={styles.linkText}
              onPress={() => navigateTo('signin')}
            >
              Sign-in
            </Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

// Shop Registration Screen
const ShopRegistrationScreen: React.FC<ShopRegistrationScreenProps> = ({ userData, navigateTo }) => {
  const [formData, setFormData] = useState<ShopData>({
    shopName: '',
    location: '',
    email: userData?.email || '',
    storeType: ''
  });
  
  const handleChange = (name: keyof ShopData, value: string): void => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (): void => {
    // Here we would combine the user data with shop data in a real app
    Alert.alert('Success', 'Business account with shop created successfully!');
    navigateTo('signin');
  };
  
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.screenContainer}>
        <Logo />
        
        <Text style={styles.screenTitle}>Register Your Shop</Text>
        <Text style={styles.screenSubtitle}>
          Complete your business profile
        </Text>
        
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Shop Name</Text>
            <TextInput 
              style={styles.textInput}
              placeholder="ex: Waleed Agrimart"
              value={formData.shopName}
              onChangeText={(value) => handleChange('shopName', value)}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Shop Location</Text>
            <TextInput 
              style={styles.textInput}
              placeholder="ex: Waleed101"
              value={formData.location}
              onChangeText={(value) => handleChange('location', value)}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Store Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.storeType}
                style={styles.picker}
                onValueChange={(value) => handleChange('storeType', value)}
              >
                <Picker.Item label="Select store type" value="" />
                <Picker.Item label="Fertilizer Store" value="Fertilizer Store" />
                <Picker.Item label="Seed Store" value="Seed Store" />
                <Picker.Item label="Farming Tools Store" value="Farming Tools Store" />
                <Picker.Item label="Farming Accessory Store" value="Farming Accessory Store" />
              </Picker>
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Commercial Registration</Text>
            <TextInput 
              style={styles.textInput}
              placeholder="ex: BIZ12345"
              value={formData.email}
              onChangeText={(value) => handleChange('email', value)}
            />
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={handleSubmit}
        >
          <Text style={styles.secondaryButtonText}>Register</Text>
        </TouchableOpacity>
        
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            Skip this step?{' '}
            <Text 
              style={styles.linkText}
              onPress={() => {
                Alert.alert('Success', 'Business account created without shop details.');
                navigateTo('signin');
              }}
            >
              Complete Later
            </Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};
