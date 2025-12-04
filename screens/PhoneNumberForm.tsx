// import React, {useState, useRef, useEffect} from 'react';
// import {
//   View,
//   TextInput,
//   Alert,
//   Image,
//   Text,
//   TouchableOpacity,
//   Linking,
// } from 'react-native';
// import {NativeStackScreenProps} from '@react-navigation/native-stack';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {useLocation} from '../hooks/useLocation';
// import DeviceInfo from 'react-native-device-info';

// type RootStackParamList = {
//   PhoneNumberForm: undefined;
//   OTPScreen: {phoneNumber: string};
//   RegisterScreen: {phoneNumber: string};
//   Main: undefined;
// };

// type Props = NativeStackScreenProps<RootStackParamList, 'PhoneNumberForm'>;

// const PhoneNumberForm: React.FC<Props> = ({navigation}) => {
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const inputRef = useRef<TextInput>(null);
//   const {
//     initLocation,
//     refreshLocation,
//     location,
//     getCurrentLocation,
//     getRawCoords,
//     hasLocationPermission,
//     initLocation1
//   } = useLocation();

//   useEffect(() => {
//     inputRef.current?.focus();
//      initLocation1(); // ← Permission + First Location Fetch
//   }, []);

//   // 🟢 LAT LONG LENE KE LIYE HANDLER
//   const getLocationSafe = async () => {
//     if (!hasLocationPermission) {
//       const askAgain = await initLocation1();

//       if (!askAgain) {
//         Alert.alert(
//           "Permission Required",
//           "Please enable location services.",
//           [
//             {
//               text: "Open Settings",
//               onPress: () => Linking.openSettings(),
//             },
//             {text: "Cancel"},
//           ]
//         );
//         throw new Error("NO_PERMISSION");
//       }
//     }

//     return await getRawCoords(); // yaha lat-long mil jayega
//   };


//   const handleSubmit = async (mobile: string) => {
//     if (!mobile.trim()) {
//       Alert.alert('Error', 'Please enter your phone number.');
//       return;
//     }

    
//     let latitude = 0;
//     let longitude = 0;

//     try {
//       // 🟢 SAFE WAY TO GET LOCATION WITH PERMISSION
//       const coords = await getLocationSafe();
//       latitude = coords.latitude;
//       longitude = coords.longitude;

//       console.log("LAT:", latitude, "LONG:", longitude);
//     } catch (e) {
//       console.log("Location error:", e);
//       Alert.alert("Error", "Unable to fetch location");
//       return;
//     }


//     // Step 3: Resolve device info BEFORE fetch
//     const deviceId = await DeviceInfo.getUniqueId();
//     const appVersion = DeviceInfo.getVersion();
//     const userAgent = await DeviceInfo.getUserAgent();

//     console.log('Final Mobile:', mobile);
//     console.log(latitude, longitude);

    

//     try {
//       const response = await fetch(
//         `https://api.recharge.kashishindiapvtltd.com/auth/login-app`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'x-device-id': deviceId,
//             'x-app-version': appVersion,
//             'User-Agent': userAgent,
//           },
//           body: JSON.stringify({
//             mobile,
//             latitude,
//             longitude,
//           }),
//         },
//       );

//       console.log('Response:', response);

//       const data = await response.json();

//       console.log(data?.data?.token);

//       await AsyncStorage.setItem('userData', JSON.stringify(data?.data));

//       if (response.status === 200 && data?.data?.token) {
//         navigation.reset({
//           index: 0,
//           routes: [{name: 'Main'}],
//         });
//       } else if (response.status === 200) {
//         navigation.navigate('OTPScreen', {phoneNumber: mobile});
//       } else if (response.status === 404) {
//         navigation.navigate('RegisterScreen', {phoneNumber: mobile});
//       } else {
//         const error = await response.json();
//         Alert.alert('Error', error.message || 'Unexpected response');
//       }
//     } catch (error: any) {
//       console.log(error);
//       Alert.alert('Network Error', error.message || 'Something went wrong');
//     }
//   };

//   const handleChange = (text: string) => {
//     setPhoneNumber(text);
//     console.log('Typing:', text);

//     // 10 digit complete hote hi submit
//     if (text.length === 10) {
//       handleSubmit(text); // ✅ yaha latest text pass kar rahe hain
//     }
//   };

//   return (
//     <View className="flex-1 w-full bg-white items-center justify-center relative">
//       {/* Logo */}
//       <Image
//         source={require('../assets/load.jpg')}
//         className="w-[300px] h-[100px] mb-5"
//         resizeMode="contain"
//       />

//       {/* Input Box */}
//       <View className="w-full px-8">
//         <TextInput
//           ref={inputRef}
//           className="h-16 border border-gray-300 rounded-full px-4 placeholder:text-gray-400  bg-white mb-5 text-2xl pl-8"
//           placeholder="Enter Mobile Number"
//           keyboardType="phone-pad"
//           placeholderTextColor="#9CA3AF"
//           value={phoneNumber}
//           onChangeText={handleChange}
//           maxLength={10}
//         />
//       </View>

//       {/* Fixed Bottom Section */}
//       <View className="absolute bottom-0 left-0 right-0 flex-row items-center justify-center gap-4 p-6 border-t border-gray-200 bg-white">
//         <Text className="font-semibold">Need help?</Text>
//         <TouchableOpacity onPress={() => Linking.openURL('tel:+919797517555')}>
//           <Text className="text-green-600 ml-1">📞 Call Us</Text>
//         </TouchableOpacity>
//         <Text className="text-lg">|</Text>
//         <TouchableOpacity
//           onPress={() => Linking.openURL('https://wa.me/919797517555')}>
//           <Text className="text-green-600 ml-1">💬 WhatsApp Us</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default PhoneNumberForm;



import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocation } from '../hooks/useLocation';
import DeviceInfo from 'react-native-device-info';

type RootStackParamList = {
  PhoneNumberForm: undefined;
  OTPScreen: { phoneNumber: string };
  RegisterScreen: { phoneNumber: string };
  Main: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'PhoneNumberForm'>;

const PhoneNumberForm: React.FC<Props> = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const inputRef = useRef<TextInput>(null);

  const { initLocation1, getRawCoords } = useLocation();

  useEffect(() => {
    inputRef.current?.focus();
    initLocation1(); // ask permission on screen load
  }, []);

  // const getLocationSafe = async () => {
  //   const allowed = await initLocation1();

  //   if (!allowed) {
  //     Alert.alert(
  //       'Permission Required',
  //       'Please enable location services.',
  //       [
  //         { text: 'Open Settings', onPress: () => Linking.openSettings() },
  //         { text: 'Cancel' },
  //       ],
  //     );

  //     throw new Error('NO_PERMISSION');
  //   }

  //   return await getRawCoords();
  // };

  const getLocationSafe = async () => {
  try {
    // Step 1: Ask for permission
    const allowed = await initLocation1();

    if (!allowed) {
      Alert.alert(
        "Permission Required",
        "Please enable location services.",
        [
          { text: "Open Settings", onPress: () => Linking.openSettings() },
          { text: "Cancel" }
        ]
      );
      throw new Error("NO_PERMISSION");
    }

    // Step 2: Try to get GPS coordinates
    const coords = await getRawCoords();
    return coords;

  } catch (error) {
    // Step 3: Something failed → Either GPS OFF or Permission Issue
    Alert.alert(
      "Permission Required",
      "Please enable location services.",
      [
        { text: "Open Settings", onPress: () => Linking.openSettings() },
        { text: "Cancel" }
      ]
    );

    throw new Error("NO_PERMISSION_AGAIN");
  }
};


  const handleSubmit = async (mobile: string) => {
    if (!mobile.trim()) {
      Alert.alert('Error', 'Please enter your phone number.');
      return;
    }

    let latitude = 0;
    let longitude = 0;

    try {
      const coords = await getLocationSafe();
      latitude = coords.latitude;
      longitude = coords.longitude;
    } catch {


      return;
    }

    const deviceId = await DeviceInfo.getUniqueId();
    const appVersion = DeviceInfo.getVersion();
    const userAgent = await DeviceInfo.getUserAgent();

    try {
      const response = await fetch(
        `https://api.recharge.kashishindiapvtltd.com/auth/login-app`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-device-id': deviceId,
            'x-app-version': appVersion,
            'User-Agent': userAgent,
          },
          body: JSON.stringify({
            mobile,
            latitude,
            longitude,
          }),
        },
      );

      const data = await response.json();

      if (response.status === 200 && data?.data?.token) {
        await AsyncStorage.setItem('userData', JSON.stringify(data?.data));
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      } else if (response.status === 200) {
        navigation.navigate('OTPScreen', { phoneNumber: mobile });
      } else if (response.status === 404) {
        navigation.navigate('RegisterScreen', { phoneNumber: mobile });
      } else {
        Alert.alert('Error', data.message || 'Unexpected response');
      }
    } catch (error: any) {
      Alert.alert('Network Error', error.message || 'Something went wrong');
    }
  };

  const handleChange = (text: string) => {
    setPhoneNumber(text);

    if (text.length === 10) {
      handleSubmit(text);
    }
  };

  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Image
        source={require('../assets/load.jpg')}
        className="w-[300px] h-[100px] mb-5"
        resizeMode="contain"
      />

      <View className="w-full px-8">
        <TextInput
          ref={inputRef}
          className="h-16 border border-gray-300 rounded-full text-2xl px-6 mb-5"
          placeholder="Enter Mobile Number"
          keyboardType="phone-pad"
           placeholderTextColor="#9CA3AF"
          value={phoneNumber}
          onChangeText={handleChange}
          maxLength={10}
        />
      </View>
    </View>
  );
};

export default PhoneNumberForm;
