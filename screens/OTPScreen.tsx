// import React, {useState, useRef} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   Image,
//   Linking,
// } from 'react-native';
// import {NativeStackScreenProps} from '@react-navigation/native-stack';
// import {useVerifyOtp} from '../hooks/useVerifyOtp';

// type RootStackParamList = {
//   OTPScreen: {phoneNumber: string};
//   NameAndAadharForm: undefined;
//   Main: undefined;
// };

// type Props = NativeStackScreenProps<RootStackParamList, 'OTPScreen'>;

// const OTPScreen: React.FC<Props> = ({navigation, route}) => {
//   const {phoneNumber} = route.params;
//   const [otp, setOtp] = useState<string[]>(Array(6).fill(''));

//   // ✅ Properly typed input refs
//   const inputRefs = useRef<Array<TextInput | null>>([]);
//   const {verifyOtp, loading} = useVerifyOtp();

//   const handleOTPChange = (index: number, value: string) => {
//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     // ✅ Auto-focus next input
//     if (value && index < 3) {
//       inputRefs.current[index + 1]?.focus();
//     }

//     // ✅ If all 6 digits entered, verify OTP
//     if (newOtp.join('').length === 6) {
//       handleVerifyOTP(newOtp.join(''));
//     }
//   };

//   const handleVerifyOTP = async (finalOtp: string) => {
//     if (finalOtp.length !== 6) {
//       Alert.alert('Error', 'Please enter a valid 6-digit OTP.');
//       return;
//     }

//     const result = await verifyOtp(finalOtp, phoneNumber);

//     if (result.success) {
//       navigation.reset({
//         index: 0,
//         routes: [{name: 'Main'}],
//       });
//     } else {
//       Alert.alert('Failed', result.message);
//     }
//   };

//   return (
//     <View className="flex-1 justify-center items-center p-5 bg-white">
//       {/* Logo */}
//       <Image
//         source={require('../assets/load.jpg')}
//         className="w-82 h-36 mb-5"
//         resizeMode="contain"
//       />

//       <Text className="text-2xl font-bold text-gray-800 mb-5 text-center">
//         OTP Sent On {phoneNumber}
//       </Text>

//       {/* OTP Inputs */}
//       <View className="flex-row justify-center gap-3 mb-5 flex-wrap">
//         {otp.map((digit, index) => (
//           <TextInput
//             key={index}
//             ref={(el: TextInput | null) => {
//               inputRefs.current[index] = el;
//             }}
//             className={`w-12 h-12 rounded-full text-center text-xl border
//             ${digit ? 'bg-green-600 text-white border-green-600' : 'bg-white text-black border-gray-300'}
//           `}
//             keyboardType="number-pad"
//             maxLength={1}
//             value={digit}
//             onChangeText={value => handleOTPChange(index, value)}
//           />
//         ))}
//       </View>

//       {/* Bottom Help Section */}
//       <View className="absolute bottom-0 left-0 right-0 flex-row items-center justify-center gap-6 p-6 border-t border-gray-200 bg-white">
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

//       {loading && <Text className="mt-3 text-gray-500">Verifying OTP...</Text>}
//     </View>
//   );
// };

// export default OTPScreen;

import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Linking,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useVerifyOtp} from '../hooks/useVerifyOtp';

type RootStackParamList = {
  OTPScreen: {phoneNumber: string};
  NameAndAadharForm: undefined;
  Main: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'OTPScreen'>;

const OTPScreen: React.FC<Props> = ({navigation, route}) => {
  const {phoneNumber} = route.params;
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));

  const inputRefs = useRef<TextInput[]>([]);
  const {verifyOtp, loading} = useVerifyOtp();

  const handleOTPChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next box
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Verify when 6 digits entered
    if (newOtp.join('').length === 6) {
      handleVerifyOTP(newOtp.join(''));
    }
  };

  const handleVerifyOTP = async (finalOtp: string) => {
    if (finalOtp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP.');
      return;
    }

    const result = await verifyOtp(finalOtp, phoneNumber);

    if (result.success) {
      navigation.reset({
        index: 0,
        routes: [{name: 'Main'}],
      });
    } else {
      Alert.alert('Failed', result.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled">
        <View className="flex-1 justify-center items-center p-5 bg-white">
          {/* Logo */}
          <Image
            source={require('../assets/load.jpg')}
            className="w-82 h-36 mb-5"
            resizeMode="contain"
          />

          {/* Title */}
          <Text className="text-2xl font-bold text-green-600 mb-5 text-center">
            OTP Sent On {phoneNumber}
          </Text>

          {/* OTP Inputs */}
          <View className="flex-row justify-center gap-2 mb-5">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={el => {
                  inputRefs.current[index] = el!;
                }}
                className={`w-14 h-14 rounded-full text-center text-xl border 
                  ${
                    digit
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-black border-gray-300'
                  }`}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={value => handleOTPChange(index, value)}
              />
            ))}
          </View>

          {loading && (
            <Text className="mt-3 text-gray-500">Verifying OTP...</Text>
          )}
        </View>
      </ScrollView>

      {/* Bottom Help */}
      <View className="flex-row items-center justify-center gap-6 p-6 border-t border-gray-200 bg-white">
        <Text className="font-semibold">Need help?</Text>

        <TouchableOpacity onPress={() => Linking.openURL('tel:+919797517555')}>
          <Text className="text-green-600 ml-1">📞 Call Us</Text>
        </TouchableOpacity>

        <Text className="text-lg">|</Text>

        <TouchableOpacity
          onPress={() => Linking.openURL('https://wa.me/919797517555')}>
          <Text className="text-green-600 ml-1">💬 WhatsApp Us</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default OTPScreen;
