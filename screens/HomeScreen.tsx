// import React, {useCallback, useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   TextInput,
//   Alert,
// } from 'react-native';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import RechargeGrid from '../components/RechargeGrid';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {
//   API_TOKEN,
//   setToken,
//   setUserData,
//   setUserId,
//   USER_DATA,
//   USER_ID,
// } from '../config';
// // import {useWallet} from '../hooks/useWallet';
// import {useCategories} from '../hooks/useCategories';
// import {useWalletPayment} from '../hooks/useWalletPayment';
// import PaymentModal from '../components/HomeModal/PaymentModal';
// import {fetchWallet} from '../services/walletService';
// import {useFocusEffect, useNavigation} from '@react-navigation/native';
// import {useWallet} from '../hooks/useWallet';
// import {RootStackParamList} from '../navigation/RootNavigator ';
// import {NativeStackNavigationProp} from '@react-navigation/native-stack';
// import ImageSlider from '../components/ImageSlider';

// const HomeScreen: React.FC = () => {
//   const navigation =
//     useNavigation<NativeStackNavigationProp<RootStackParamList>>();
//   const [tokenn, setTokenn] = useState<string>('');
//   const [showModal, setShowModal] = useState(false);

//   const [lastPaymentTime, setLastPaymentTime] = useState<number | null>(null);

//   const {data, loadWallet} = useWallet(USER_ID);

//   const [balance, setBalance] = useState<number | null>(null);

//   // Slider images array
//   const sliderImages = [
//     require('../assets/Home/slider1.png'),
//      require('../assets/Home/slider2.png'), // Add your third image
//   ];

//   useFocusEffect(
//     useCallback(() => {
//       const getUserData = async () => {
//         const stored = await AsyncStorage.getItem('userData');
//         if (stored) {
//           const userData = JSON.parse(stored);
//           // Alert.alert('hii')

//           setUserData(userData);
//           setToken(userData.token);
//           setUserId(userData?.user?.userId);
//           setTokenn(userData.token);
//           loadWallet();
//         }
//       };

//       getUserData();
//     }, []),
//   );

//   useFocusEffect(
//     useCallback(() => {
//       const loadLastTime = async () => {
//         const t = await AsyncStorage.getItem('lastPaymentTime');
//         if (t) setLastPaymentTime(Number(t));
//       };
//       loadLastTime();
//     }, []),
//   );

//   return (
//     <View className="flex-1 bg-white">
//       <ScrollView className="p-4">
//         {/* Logo */}
//         <Image
//           source={require('../assets/load.jpg')}
//           className="w-4/5 h-24 resize-contain rounded-xl self-center mb-4"
//         />

//         {/* Search Input */}
//         <TextInput
//           className="bg-white p-3.5 rounded-xl text-base border border-gray-300 mb-5 shadow"
//           placeholder="Search services..."
//           placeholderTextColor="#999"
//         />

//         {/* Header */}
//         <View className="flex-row mb-5">
//           {/* Profile Box */}
//           <View className="flex-1.2 bg-white p-3.5 rounded-xl shadow mr-2">
//             <Text className="text-base font-bold text-gray-800 mb-1">
//               {USER_DATA?.user?.name
//                 ? USER_DATA.user.name.split(' ')[0].charAt(0).toUpperCase() +
//                   USER_DATA.user.name.split(' ')[0].slice(1)
//                 : ''}
//             </Text>

//             <Text className="text-sm text-gray-500">Main Balance</Text>
//             <View className="flex-row items-center mt-1.5">
//               <FontAwesome name="money" size={20} color="#28a745" />
//               <Text className="text-lg text-green-600 font-bold ml-1.5">
//                 ₹{data?.data?.balance ?? '...'}
//               </Text>
//             </View>
//           </View>



//           {/* Actions */}
//           <View className="flex-1 justify-between">
//             <TouchableOpacity
//               onPress={() => navigation.navigate('MarginRatesScreen')}
//               className="bg-blue-500 py-3 rounded-xl items-center mb-2 shadow">
//               <MaterialCommunityIcons name="gift" size={24} color="#fff" />
//               <Text className="text-xs text-white font-semibold mt-1">
//                 Commission
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               className="bg-blue-500 py-3 rounded-xl items-center shadow"
//               // onPress={() => setShowModal(true)}
//               onPress={async () => {
//                 const now = Date.now();

//                 if (lastPaymentTime && now - lastPaymentTime < 1 * 60 * 1000) {
//                   const remaining = Math.ceil(
//                     (1 * 60 * 1000 - (now - lastPaymentTime)) / 1000,
//                   );
//                   Alert.alert('Wait', `Try again after ${remaining} seconds.`);
//                   return;
//                 }

//                 setShowModal(true);
//                 await AsyncStorage.setItem('lastPaymentTime', String(now));
//                 setLastPaymentTime(now);
//               }}>
//               <AntDesign name="pluscircle" size={24} color="#fff" />
//               <Text className="text-xs text-white font-semibold mt-1">Add</Text>
//             </TouchableOpacity>
//           </View>





//         </View>
//           <ImageSlider
//             images={sliderImages}
//             autoPlay={true}
//             interval={3000}
//             showIndicators={true}
//             height={160}
//           />


//         {/* Recharge Grid Component */}
//         <RechargeGrid token={tokenn} />
//       </ScrollView>
//       <PaymentModal
//         visible={showModal}
//         onClose={() => setShowModal(false)}
//         loadWallet={loadWallet}
//       />
//     </View>
//   );
// };

// export default HomeScreen;



import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
  Linking,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Geolocation from 'react-native-geolocation-service';
import RechargeGrid from '../components/RechargeGrid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  API_TOKEN,
  setToken,
  setUserData,
  setUserId,
  USER_DATA,
  USER_ID,
} from '../config';
import {useCategories} from '../hooks/useCategories';
import {useWalletPayment} from '../hooks/useWalletPayment';
import PaymentModal from '../components/HomeModal/PaymentModal';
import {fetchWallet} from '../services/walletService';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useWallet} from '../hooks/useWallet';
import {RootStackParamList} from '../navigation/RootNavigator ';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ImageSlider from '../components/ImageSlider';
import { useLocation } from '../hooks/useLocation';

const HomeScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [tokenn, setTokenn] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [lastPaymentTime, setLastPaymentTime] = useState<number | null>(null);
  const {data, loadWallet} = useWallet(USER_ID);
  const [balance, setBalance] = useState<number | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean>(false);

  const { 
  location, 
  loadingLocation, 
  initLocation, 
  refreshLocation ,
  getCurrentLocation
} = useLocation();

  // Slider images array
  const sliderImages = [
    require('../assets/Home/slider1.png'),
    require('../assets/Home/slider2.png'),
  ];

 
  useFocusEffect(
    useCallback(() => {
      const getUserData = async () => {
        const stored = await AsyncStorage.getItem('userData');
        if (stored) {
          const userData = JSON.parse(stored);
          setUserData(userData);
          setToken(userData.token);
          setUserId(userData?.user?.userId);
          setTokenn(userData.token);
          loadWallet();
        }
      };

      getUserData();
      initLocation();
      
      // Set up location refresh interval (optional)
      const intervalId = setInterval(() => {
        if (hasLocationPermission) {
          getCurrentLocation();
        }
      }, 300000); // Refresh every 5 minutes

      return () => clearInterval(intervalId);
    }, [hasLocationPermission]),
  );





  useFocusEffect(
    useCallback(() => {
      const loadLastTime = async () => {
        const t = await AsyncStorage.getItem('lastPaymentTime');
        if (t) setLastPaymentTime(Number(t));
      };
      loadLastTime();
    }, []),
  );

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="p-4">
        {/* Logo */}
        <Image
          source={require('../assets/load.jpg')}
          className="w-4/5 h-24 resize-contain rounded-xl self-center mb-4"
        />

        {/* Location Display - Replaced Search Input */}
        <TouchableOpacity 
          onPress={refreshLocation}
          className="bg-white p-3.5 rounded-xl border border-gray-300 mb-5 shadow flex-row items-center justify-between"
          activeOpacity={0.7}
        >
          <View className="flex-row items-center flex-1">
            <FontAwesome 
              name="map-marker" 
              size={20} 
              color="#ff4444" 
              style={{marginRight: 10}}
            />
            {loadingLocation ? (
              <View className="flex-row items-center">
                <ActivityIndicator size="small" color="#4a90e2" />
                <Text className="text-base ml-2 text-gray-600">Getting location...</Text>
              </View>
            ) : (
              <Text 
                className="text-base text-gray-800 flex-1"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {location}
              </Text>
            )}
          </View>
          <TouchableOpacity onPress={refreshLocation} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <MaterialCommunityIcons 
              name="reload" 
              size={20} 
              color="#4a90e2" 
            />
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Header */}
        <View className="flex-row mb-5">
          {/* Profile Box */}
          <View className="flex-1.2 bg-white p-3.5 rounded-xl shadow mr-2">
            <Text className="text-base font-bold text-gray-800 mb-1">
              {USER_DATA?.user?.name
                ? USER_DATA.user.name.split(' ')[0].charAt(0).toUpperCase() +
                  USER_DATA.user.name.split(' ')[0].slice(1)
                : ''}
            </Text>

            <Text className="text-sm text-gray-500">Main Balance</Text>
            <View className="flex-row items-center mt-1.5">
              <FontAwesome name="money" size={20} color="#28a745" />
              <Text className="text-lg text-green-600 font-bold ml-1.5">
                ₹{data?.data?.balance ?? '...'}
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View className="flex-1 justify-between">
            <TouchableOpacity
              onPress={() => navigation.navigate('MarginRatesScreen')}
              className="bg-blue-500 py-3 rounded-xl items-center mb-2 shadow">
              <MaterialCommunityIcons name="gift" size={24} color="#fff" />
              <Text className="text-xs text-white font-semibold mt-1">
                Commission
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-blue-500 py-3 rounded-xl items-center shadow"
              onPress={async () => {
                const now = Date.now();

                if (lastPaymentTime && now - lastPaymentTime < 1 * 60 * 1000) {
                  const remaining = Math.ceil(
                    (1 * 60 * 1000 - (now - lastPaymentTime)) / 1000,
                  );
                  Alert.alert('Wait', `Try again after ${remaining} seconds.`);
                  return;
                }

                setShowModal(true);
                await AsyncStorage.setItem('lastPaymentTime', String(now));
                setLastPaymentTime(now);
              }}>
              <AntDesign name="pluscircle" size={24} color="#fff" />
              <Text className="text-xs text-white font-semibold mt-1">Add</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <ImageSlider
          images={sliderImages}
          autoPlay={true}
          interval={3000}
          showIndicators={true}
          height={160}
        />

        {/* Recharge Grid Component */}
        <RechargeGrid token={tokenn} />
      </ScrollView>
      <PaymentModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        loadWallet={loadWallet}
      />
    </View>
  );
};

export default HomeScreen;