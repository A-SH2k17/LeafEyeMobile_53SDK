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
} from 'react-native';

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
  <View style={styles.logoContainer}>
    <View style={styles.logoOuter}>
      <View style={styles.logoBorder} />
      <View style={styles.logoInner}>
        <View style={styles.logoGreen}>
          <View style={styles.logoCircle} />
        </View>
      </View>
      <View style={styles.logoText}>
        <Text style={styles.logoTextContent}>LEAF</Text>
      </View>
    </View>
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

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  screenContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoOuter: {
    width: 56,
    height: 56,
    borderRadius: 28,
    position: 'relative',
  },
  logoBorder: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#047857',
  },
  logoInner: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 38,
    height: 56,
    justifyContent: 'center',
  },
  logoGreen: {
    width: '100%',
    height: 38,
    backgroundColor: '#047857',
    borderTopRightRadius: 19,
    borderBottomRightRadius: 19,
    justifyContent: 'center',
    paddingLeft: 4,
  },
  logoCircle: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 8,
  },
  logoText: {
    position: 'absolute',
    right: 8,
    top: 8,
  },
  logoTextContent: {
    color: '#047857',
    fontWeight: 'bold',
    fontSize: 12,
  },
  screenTitle: {
    textAlign: 'center',
    color: '#047857',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  screenSubtitle: {
    textAlign: 'center',
    color: '#047857',
    fontSize: 14,
    marginBottom: 24,
  },
  formContainer: {
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    color: '#047857',
    marginBottom: 4,
    fontSize: 14,
  },
  textInput: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    fontSize: 14,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 40,
  },
  primaryButton: {
    backgroundColor: '#047857',
    paddingVertical: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  primaryButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
  secondaryButton: {
    backgroundColor: '#a7f3d0',
    paddingVertical: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  secondaryButtonText: {
    color: '#047857',
    textAlign: 'center',
    fontWeight: '500',
  },
  buttonContainer: {
    marginBottom: 16,
  },
  buttonSpacing: {
    marginTop: 12,
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  footerContainer: {
    marginTop: 'auto',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
  },
  linkText: {
    color: '#047857',
    fontWeight: '500',
  },
});
