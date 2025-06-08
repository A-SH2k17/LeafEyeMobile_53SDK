import { styles as baseStyles } from '@/stylesheet/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { SvgXml } from 'react-native-svg';

// Define types for our data structures
interface UserData {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
  location: string;
  phone_number: string;
  customerType: 'normal' | 'business';
}

interface ShopData {
  storeName: string;
  storeAddress: string;
  commercialRegistrationNumber: string;
  storeType: string;
}

// Define validation errors interface
interface ValidationErrors {
  [key: string]: string[];
}

// Combined interface for API request
interface RegistrationRequest {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
  location: string;
  phone_number: string;
  customerType: 'normal' | 'business';
  storeName?: string;
  storeAddress?: string;
  commercialRegistrationNumber?: string;
  storeType?: string;
}

type AccountType = 'normal' | 'business' | null;
type ScreenType = 'signin' | 'accountType' | 'register' | 'shopRegister';

// Define component prop types
interface LogoProps {}

interface SignInScreenProps {
  navigateTo: (screen: ScreenType) => void;
}

interface AccountTypeScreenProps {
  selectAccountType: (type: 'normal' | 'business') => void;
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

interface DropdownProps {
  value: string;
  items: { label: string; value: string }[];
  onValueChange: (value: string) => void;
  error?: boolean;
}

// Logo component used across screens
const Logo: React.FC<LogoProps> = () => (
  <View style={styles.logoSignContainer}>
    <SvgXml
      xml={`
        <svg width="200" height="200" viewBox="0 0 82 63" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M35.227 0.310417C27.2719 1.83905 21.3854 7.82128 20.1381 15.6261C19.8491 17.4046 20.0316 20.7558 20.5184 22.4902C21.9938 27.8992 25.5531 32.0736 30.679 34.3959C34.2231 35.998 38.8319 36.439 42.6345 35.5424C43.7601 35.2778 43.2277 35.2631 41.7371 35.513C40.0335 35.7922 36.8545 35.7187 35.0597 35.3513C33.4626 35.0132 30.8615 33.9696 29.3405 33.0436C26.4049 31.2651 23.8495 28.3696 22.5262 25.327C22.0698 24.254 21.3397 21.8876 21.431 21.7847C21.4766 21.7553 21.8417 21.9758 22.2372 22.2992C25.0511 24.548 29.0971 26.4 32.4282 26.9732C34.4208 27.3113 37.5238 27.2672 38.6341 26.8997C40.4746 26.2824 41.661 25.2388 42.528 23.475C43.6688 21.0939 43.0756 18.1689 41.083 16.3316C40.5963 15.9054 40.2465 15.5232 40.2769 15.4938C40.3073 15.4497 41.0374 15.7584 41.8892 16.1699C44.2316 17.3164 45.8744 18.6687 47.1368 20.5353L47.5627 21.1527L47.2585 21.5642C46.8326 22.1522 45.0226 23.7984 44.0339 24.5039C42.2847 25.768 39.8966 26.8115 37.5694 27.3407C35.9875 27.6934 34.8315 27.811 32.5499 27.8404L30.7551 27.8551L30.101 29.6042C29.1884 32.0148 29.1732 32.1617 29.9641 30.6919L30.6486 29.4132L32.4282 29.5013C38.6798 29.7953 45.6918 27.0467 51.4871 22.0199C52.7191 20.9616 52.7495 21.1233 50.9547 19.6975C46.7262 16.3463 41.9805 14.5531 37.3565 14.5531C35.7289 14.5531 35.1813 14.6119 34.4208 14.8618C32.6868 15.4203 31.4395 16.508 30.5878 18.2277C30.1466 19.1243 30.1162 19.286 30.1162 20.8734C30.1162 22.5049 30.1314 22.6078 30.6334 23.5779C31.1201 24.548 31.9263 25.474 32.8541 26.1501C33.2952 26.4588 33.2952 26.4735 32.9302 26.3706C32.1544 26.1795 29.6751 24.9743 28.7625 24.3422C26.9676 23.1076 25.1424 20.8881 25.4466 20.3296C25.69 19.9033 27.7434 17.9925 28.7321 17.287C29.9337 16.4198 31.9719 15.3909 33.4169 14.9353C35.4703 14.2592 36.7024 14.0681 39.4555 13.9799L42.0869 13.8917L42.3911 13.0833C42.5585 12.6423 42.8931 11.7457 43.1365 11.1137C43.3798 10.4817 43.5624 9.93784 43.5471 9.90844C43.5167 9.89374 43.1973 10.4082 42.8323 11.0696L42.1782 12.2749H39.4251C36.3678 12.2896 35.1357 12.4513 32.626 13.2303C29.5534 14.1857 25.2641 16.5227 22.3588 18.8156C21.7504 19.3007 21.1876 19.6975 21.1268 19.6975C20.9595 19.6975 21.1876 16.6109 21.4614 15.3321C22.1459 12.1132 23.7126 9.24701 26.055 6.93937C30.7399 2.33879 37.4781 0.766068 43.7905 2.80914C45.418 3.33828 46.209 3.91151 49.4184 6.90998C51.6848 9.02654 53.6774 11.2313 54.7573 12.804C55.7308 14.2151 55.7764 14.4943 54.8334 13.3038C53.6317 11.7898 50.3158 8.65908 48.1255 6.95407C45.8896 5.23437 42.7258 3.1766 42.5128 3.30888C41.9805 3.61755 43.106 7.76248 44.3837 10.2171C46.0873 13.5095 48.4297 15.7584 52.491 18.0072C57.4648 20.7558 58.4383 21.4613 59.2749 22.8871C59.5182 23.3133 59.7768 23.6661 59.8529 23.6661C59.9137 23.6661 60.1114 23.1517 60.294 22.5196C61.1762 19.286 61.237 16.1552 60.4461 13.098C59.3205 8.73257 56.3544 4.9551 52.567 3.04431C50.8634 2.19181 49.6162 1.80965 47.6692 1.54508C46.8022 1.42749 45.5702 1.16292 44.9465 0.957146C42.0717 -0.0129471 38.2235 -0.277515 35.227 0.310417ZM38.1474 16.6991C39.0752 16.993 40.14 17.9337 40.6571 18.8744C40.9918 19.5065 41.0526 19.8151 41.0678 20.7999C41.0678 21.7994 41.007 22.1081 40.6267 22.8283C38.9536 26.1354 33.9797 26.0178 32.3978 22.6225C32.0328 21.8141 31.9871 21.5789 32.048 20.5941C32.124 19.3301 32.3674 18.7862 33.28 17.8309C33.8884 17.1841 34.4664 16.8167 35.2118 16.5962C35.881 16.4051 37.4173 16.4492 38.1474 16.6991Z" fill="#00796A"/>
          <path d="M35.6375 19.4918C35.0595 19.7857 34.7097 20.4913 34.8161 21.0939C35.1356 22.696 37.4932 22.8577 37.9647 21.2997C38.3906 19.9474 36.9304 18.8009 35.6375 19.4918Z" fill="#00796A"/>
          <path d="M43.5473 35.2337C43.6537 35.2778 43.7906 35.2631 43.8363 35.219C43.8971 35.1749 43.8058 35.1308 43.6385 35.1455C43.4712 35.1455 43.4256 35.1896 43.5473 35.2337Z" fill="#00796A"/>
        </svg>
      `}
      width={200}
      height={200}
    />
  </View>
);

// Sign In Screen
const SignInScreen: React.FC<SignInScreenProps> = ({ navigateTo }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const handleSignIn = async () => {
    try {
      // Clear previous validation errors
      setValidationErrors({});

      const formData = {
        email: email.toLowerCase(),
        password: password
      };

      const response = await axios.post("https://leafeye.eu-1.sharedwithexpose.com/api/login", formData);
      
      if (response.data) {
        console.log(response.data);
        // Check user type and status for business users
        if (response.data.user?.role === 'business') {
          if (response.data.shop_status === 'approved') {
            // Store raw response data
            await AsyncStorage.setItem('session', JSON.stringify(response.data));
            
            // Set default authorization header for future requests
            if (response.data.token) {
              axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            }
            router.push('/(business)');
          } else if (response.data.shop_status === 'pending') {
            // Clear any existing session
            await AsyncStorage.removeItem('session');
            delete axios.defaults.headers.common['Authorization'];
            
            Alert.alert(
              'Account Pending',
              'Your business account is awaiting approval from administrators.',
              [
                {
                  text: 'OK',
                  onPress: () => navigateTo('signin')
                }
              ]
            );
          } else if (response.data.shop_status === 'rejected') {
            // Clear any existing session
            await AsyncStorage.removeItem('session');
            delete axios.defaults.headers.common['Authorization'];
            
            Alert.alert(
              'Account Rejected',
              'Your business account has been rejected.',
              [
                {
                  text: 'OK',
                  onPress: () => navigateTo('signin')
                }
              ]
            );
          }
        } else {
          // Store raw response data
          await AsyncStorage.setItem('session', JSON.stringify(response.data));
          
          // Set default authorization header for future requests
          if (response.data.token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
          }
          router.push('/(menu)');
        }
      }
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setValidationErrors(error.response.data.errors);
      } else if (error.response) {
        Alert.alert('Login Error', error.response.data.message || 'Login failed. Please try again.');
      } else if (error.request) {
        Alert.alert('Network Error', 'No response from server. Please check your connection.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
      console.error('Login error:', error);
    }
  };

  return (
    <View style={styles.screenContainer}>
      <Logo />
      
      <Text style={styles.screenTitle}>Sign In</Text>
      
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email / Username</Text>
          <View style={[
            styles.textInputContainer,
            validationErrors.email && styles.inputError
          ]}>
            <TextInput 
              style={styles.textInput}
              placeholder="ex: username@email.com"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          {validationErrors.email && (
            <Text style={styles.errorText}>{validationErrors.email[0]}</Text>
          )}
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={[
            styles.textInputContainer,
            validationErrors.password && styles.inputError
          ]}>
            <TextInput 
              style={styles.textInput}
              placeholder="••••••••"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
          {validationErrors.password && (
            <Text style={styles.errorText}>{validationErrors.password[0]}</Text>
          )}
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.primaryButton}
        onPress={handleSignIn}
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
          onPress={() => selectAccountType('normal')}
        >
          <Text style={styles.primaryButtonText}>Normal</Text>
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

// Dropdown component
const Dropdown: React.FC<DropdownProps> = ({ value, items, onValueChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('');

  useEffect(() => {
    const selected = items.find(item => item.value === value);
    setSelectedLabel(selected ? selected.label : 'Select store type');
  }, [value, items]);

  return (
    <TouchableOpacity
      style={[
        styles.dropdownButton,
        error && styles.inputError
      ]}
      onPress={() => setIsOpen(true)}
    >
      <Text style={[
        styles.dropdownButtonText,
        !value && styles.placeholderText
      ]}>
        {selectedLabel}
      </Text>
      <Text style={styles.dropdownIcon}>▼</Text>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.dropdownList}>
            <FlatList
              data={items}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.dropdownItem,
                    value === item.value && styles.dropdownItemSelected
                  ]}
                  onPress={() => {
                    onValueChange(item.value);
                    setIsOpen(false);
                  }}
                >
                  <Text style={[
                    styles.dropdownItemText,
                    value === item.value && styles.dropdownItemTextSelected
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </TouchableOpacity>
  );
};

// Registration Screen
const RegisterScreen: React.FC<RegisterScreenProps> = ({ accountType, completeRegistration, navigateTo }) => {
  const [formData, setFormData] = useState<UserData>({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
    location: '',
    phone_number: '',
    customerType: accountType || 'normal'
  });

  const [shopData, setShopData] = useState<ShopData>({
    storeName: '',
    storeAddress: '',
    commercialRegistrationNumber: '',
    storeType: ''
  });

  // Add validation errors state
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  
  const handleChange = (name: keyof UserData, value: string): void => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error for this field when user types
    if (validationErrors[name]) {
      setValidationErrors((prev: ValidationErrors) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleShopChange = (name: keyof ShopData, value: string): void => {
    setShopData(prev => ({ ...prev, [name]: value }));
    // Clear validation error for this field when user types
    if (validationErrors[name]) {
      setValidationErrors((prev: ValidationErrors) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Helper function to render error message
  const renderErrorMessage = (fieldName: string) => {
    if (validationErrors[fieldName] && validationErrors[fieldName].length > 0) {
      return (
        <Text style={styles.errorText}>
          {validationErrors[fieldName][0]}
        </Text>
      );
    }
    return null;
  };
  
  const handleSubmit = async (): Promise<void> => {
    try {
      // Clear previous validation errors
      setValidationErrors({});

      // Client-side password validation
      if (formData.password !== formData.password_confirmation) {
        setValidationErrors({
          password_confirmation: ['Passwords do not match']
        });
        return;
      }

      const registrationData: RegistrationRequest = {
        ...formData,
        email: formData.email.toLowerCase(),
        ...(accountType === 'business' ? {
          storeName: shopData.storeName,
          storeAddress: shopData.storeAddress,
          commercialRegistrationNumber: shopData.commercialRegistrationNumber,
          storeType: shopData.storeType
        } : {})
      };

      const response = await axios.post("https://leafeye.eu-1.sharedwithexpose.com/api/register", registrationData);
      
      if (response.data) {
        if (accountType === 'business') {
          // Clear any existing session
          await AsyncStorage.removeItem('session');
          delete axios.defaults.headers.common['Authorization'];
          
          Alert.alert(
            'Registration Successful',
            'Your business account has been created and is pending approval from administrators.',
            [
              {
                text: 'OK',
                onPress: () => navigateTo('signin')
              }
            ]
          );
        } else {
          // Store raw response data for normal users
          await AsyncStorage.setItem('session', JSON.stringify(response.data));
          
          // Set default authorization header for future requests
          if (response.data.token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
          }
          
          Alert.alert(
            'Success',
            'Normal account created successfully!',
            [
              {
                text: 'OK',
                onPress: () => navigateTo('signin')
              }
            ]
          );
        }
      }
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setValidationErrors(error.response.data.errors);
      } else if (error.response) {
        Alert.alert('Registration Error', error.response.data.message || 'Registration failed. Please try again.');
      } else if (error.request) {
        Alert.alert('Network Error', 'No response from server. Please check your connection.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
      console.error('Registration error:', error);
    }
  };
  
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.screenContainer}>
        <Logo />
        
        <Text style={styles.screenTitle}>Create your account</Text>
        <Text style={styles.screenSubtitle}>
          {accountType === 'business' ? 'Business Account Registration' : 'Normal Account Registration'}
        </Text>
        
        <View style={styles.formContainer}>
          {/* User Information Fields */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>First Name</Text>
            <View style={[
              styles.textInputContainer,
              validationErrors.first_name && styles.inputError
            ]}>
              <TextInput 
                style={styles.textInput}
                placeholder="ex: Waleed"
                value={formData.first_name}
                onChangeText={(value) => handleChange('first_name', value)}
              />
            </View>
            {renderErrorMessage('first_name')}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Last Name</Text>
            <View style={[
              styles.textInputContainer,
              validationErrors.last_name && styles.inputError
            ]}>
              <TextInput 
                style={styles.textInput}
                placeholder="ex: Ahmed"
                value={formData.last_name}
                onChangeText={(value) => handleChange('last_name', value)}
              />
            </View>
            {renderErrorMessage('last_name')}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Username</Text>
            <View style={[
              styles.textInputContainer,
              validationErrors.username && styles.inputError
            ]}>
              <TextInput 
                style={styles.textInput}
                placeholder="ex: waleed101"
                value={formData.username}
                onChangeText={(value) => handleChange('username', value)}
              />
            </View>
            {renderErrorMessage('username')}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={[
              styles.textInputContainer,
              validationErrors.email && styles.inputError
            ]}>
              <TextInput 
                style={styles.textInput}
                placeholder="ex: omar@yahoo.com"
                keyboardType="email-address"
                value={formData.email}
                onChangeText={(value) => handleChange('email', value)}
              />
            </View>
            {renderErrorMessage('email')}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={[
              styles.textInputContainer,
              validationErrors.password && styles.inputError
            ]}>
              <TextInput 
                style={styles.textInput}
                placeholder="ex: xxxxxx@1111"
                secureTextEntry
                value={formData.password}
                onChangeText={(value) => handleChange('password', value)}
              />
            </View>
            {renderErrorMessage('password')}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <View style={[
              styles.textInputContainer,
              validationErrors.password_confirmation && styles.inputError
            ]}>
              <TextInput 
                style={styles.textInput}
                placeholder="Confirm your password"
                secureTextEntry
                value={formData.password_confirmation}
                onChangeText={(value) => handleChange('password_confirmation', value)}
              />
            </View>
            {renderErrorMessage('password_confirmation')}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Location</Text>
            <View style={[
              styles.textInputContainer,
              validationErrors.location && styles.inputError
            ]}>
              <TextInput 
                style={styles.textInput}
                placeholder="ex: Your Location"
                value={formData.location}
                onChangeText={(value) => handleChange('location', value)}
              />
            </View>
            {renderErrorMessage('location')}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={[
              styles.textInputContainer,
              validationErrors.phone_number && styles.inputError
            ]}>
              <TextInput 
                style={styles.textInput}
                placeholder="ex: +1234567890"
                keyboardType="phone-pad"
                value={formData.phone_number}
                onChangeText={(value) => handleChange('phone_number', value)}
              />
            </View>
            {renderErrorMessage('phone_number')}
          </View>

          {/* Shop Information Fields - Only show for business accounts */}
          {accountType === 'business' && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Store Name</Text>
                <View style={[
                  styles.textInputContainer,
                  validationErrors.storeName && styles.inputError
                ]}>
                  <TextInput 
                    style={styles.textInput}
                    placeholder="ex: Waleed Agrimart"
                    value={shopData.storeName}
                    onChangeText={(value) => handleShopChange('storeName', value)}
                  />
                </View>
                {renderErrorMessage('storeName')}
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Store Address</Text>
                <View style={[
                  styles.textInputContainer,
                  validationErrors.storeAddress && styles.inputError
                ]}>
                  <TextInput 
                    style={styles.textInput}
                    placeholder="ex: Shop Address"
                    value={shopData.storeAddress}
                    onChangeText={(value) => handleShopChange('storeAddress', value)}
                  />
                </View>
                {renderErrorMessage('storeAddress')}
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Commercial Registration Number</Text>
                <View style={[
                  styles.textInputContainer,
                  validationErrors.commercialRegistrationNumber && styles.inputError
                ]}>
                  <TextInput 
                    style={styles.textInput}
                    placeholder="ex: BIZ12345"
                    value={shopData.commercialRegistrationNumber}
                    onChangeText={(value) => handleShopChange('commercialRegistrationNumber', value)}
                  />
                </View>
                {renderErrorMessage('commercialRegistrationNumber')}
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Store Type</Text>
                <Dropdown
                  value={shopData.storeType}
                  items={storeTypes}
                  onValueChange={(value) => handleShopChange('storeType', value)}
                  error={!!validationErrors.storeType}
                />
                {renderErrorMessage('storeType')}
              </View>
            </>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={handleSubmit}
        >
          <Text style={styles.secondaryButtonText}>
            Register
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
    storeName: '',
    storeAddress: '',
    commercialRegistrationNumber: '',
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
            <View style={styles.textInputContainer}>
              <TextInput 
                style={styles.textInput}
                placeholder="ex: Waleed Agrimart"
                value={formData.storeName}
                onChangeText={(value) => handleChange('storeName', value)}
              />
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Shop Location</Text>
            <View style={styles.textInputContainer}>
              <TextInput 
                style={styles.textInput}
                placeholder="ex: Waleed101"
                value={formData.storeAddress}
                onChangeText={(value) => handleChange('storeAddress', value)}
              />
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Store Type</Text>
            <Dropdown
              value={formData.storeType}
              items={storeTypes}
              onValueChange={(value) => handleChange('storeType', value)}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Commercial Registration</Text>
            <View style={styles.textInputContainer}>
              <TextInput 
                style={styles.textInput}
                placeholder="ex: BIZ12345"
                value={formData.commercialRegistrationNumber}
                onChangeText={(value) => handleChange('commercialRegistrationNumber', value)}
              />
            </View>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={handleSubmit}
        >
          <Text style={styles.secondaryButtonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Store types for dropdown
const storeTypes = [
  { label: 'Select store type', value: '' },
  { label: 'Fertilizer Store', value: 'Fertilizer Store' },
  { label: 'Seed Store', value: 'Seed Store' },
  { label: 'Farming Tools Store', value: 'Farming Tools Store' },
  { label: 'Farming Accessory Store', value: 'Farming Accessory Store' },
];

// Main App component that manages navigation between screens
export default function LogRegScreen(): React.JSX.Element {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('signin');
  const [previousScreen, setPreviousScreen] = useState<ScreenType>('signin');
  const [accountType, setAccountType] = useState<AccountType>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  
  // Handle navigation between screens
  const navigateTo = (screen: ScreenType): void => {
    setPreviousScreen(currentScreen);
    setCurrentScreen(screen);
  };

  // Handle going back to previous screen
  const handleGoBack = (): void => {
    if (previousScreen) {
      setCurrentScreen(previousScreen);
      // If going back from shop registration, we should also clear the user data
      if (currentScreen === 'shopRegister') {
        setUserData(null);
      }
    }
  };
  
  // Select account type and move to registration form
  const selectAccountType = (type: 'normal' | 'business'): void => {
    setAccountType(type);
    navigateTo('register');
  };

  // Save user data after registration and navigate based on account type
  const completeRegistration = (formData: UserData): void => {
    setUserData(formData);
    
    // If business account, go to shop registration. If normal, go to signin
    if (accountType === 'business') {
      navigateTo('shopRegister');
    } else {
      Alert.alert('Success', 'Normal account created successfully!');
      //navigateTo('signin');
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
  
  // Add a function to check session on app start
  const checkSession = async () => {
    try {
      const sessionString = await AsyncStorage.getItem('session');
      if (sessionString) {
        const sessionData = JSON.parse(sessionString);
        // Set authorization header if token exists
        if (sessionData.token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${sessionData.token}`;
        }
        // Navigate to menu if session exists
        router.push('/(menu)');
      }
    } catch (error) {
      console.error('Session check error:', error);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
      <View style={styles.Logheader}>
        {currentScreen !== 'signin' && currentScreen !== 'accountType' && (
          <TouchableOpacity onPress={handleGoBack}>
            <Text style={styles.backIcon}>{"Previous"}</Text>
          </TouchableOpacity>
        )}
      </View>
      {renderScreen()}
    </SafeAreaView>
  );
}

// Merge the base styles with validation styles
const styles = {
  ...baseStyles,
  Logheader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 16,
    paddingVertical: 8,
  } as ViewStyle,
  backIcon: {
    fontSize: 16,
    color: '#00796A',
    fontWeight: '600' as const,
  } as TextStyle,
  screenContainer: {
    flex: 1,
    padding: 24,
  } as ViewStyle,
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#f3f4f6',
  } as ViewStyle,
  logoSignContainer: {
    alignItems: 'center' as const,
    marginBottom: 32,
  } as ViewStyle,
  screenTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#1f2937',
    textAlign: 'center' as const,
    marginBottom: 8,
  } as TextStyle,
  screenSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center' as const,
    marginBottom: 32,
  } as TextStyle,
  formContainer: {
    marginBottom: 24,
  } as ViewStyle,
  inputGroup: {
    marginBottom: 16,
  } as ViewStyle,
  inputLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#374151',
    marginBottom: 4,
  } as TextStyle,
  textInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
  } as TextStyle,
  textInputContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  } as ViewStyle,
  inputError: {
    borderColor: '#ef4444',
  } as ViewStyle,
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  } as TextStyle,
  primaryButton: {
    backgroundColor: '#00796A',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center' as const,
    marginBottom: 16,
  } as ViewStyle,
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600' as const,
  } as TextStyle,
  secondaryButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: '#00796A',
    marginBottom: 16,
  } as ViewStyle,
  secondaryButtonText: {
    color: '#00796A',
    fontSize: 16,
    fontWeight: '600' as const,
  } as TextStyle,
  buttonContainer: {
    marginBottom: 24,
  } as ViewStyle,
  buttonSpacing: {
    marginTop: 12,
  } as ViewStyle,
  forgotPasswordContainer: {
    alignItems: 'center' as const,
    marginBottom: 24,
  } as ViewStyle,
  footerContainer: {
    alignItems: 'center' as const,
  } as ViewStyle,
  footerText: {
    fontSize: 14,
    color: '#6b7280',
  } as TextStyle,
  linkText: {
    color: '#00796A',
    fontWeight: '600' as const,
  } as TextStyle,
  dropdownButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: 4,
  } as ViewStyle,
  dropdownButtonText: {
    fontSize: 16,
    color: '#1f2937',
  } as TextStyle,
  placeholderText: {
    color: '#6b7280',
  } as TextStyle,
  dropdownIcon: {
    fontSize: 12,
    color: '#6b7280',
  } as TextStyle,
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  } as ViewStyle,
  dropdownList: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    width: '80%' as const,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  } as ViewStyle,
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  } as ViewStyle,
  dropdownItemSelected: {
    backgroundColor: '#f3f4f6',
  } as ViewStyle,
  dropdownItemText: {
    fontSize: 16,
    color: '#1f2937',
  } as TextStyle,
  dropdownItemTextSelected: {
    color: '#00796A',
    fontWeight: '600' as const,
  } as TextStyle,
}; 