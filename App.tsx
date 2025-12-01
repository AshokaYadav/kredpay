// import './global.css'; // 👈 yeh import zaruri hai
// import React, {useEffect, useState} from 'react';
// import {NavigationContainer} from '@react-navigation/native';
// import RootNavigator from './navigation/RootNavigator ';
// import {GestureHandlerRootView} from 'react-native-gesture-handler';
// import {navigationRef, setNavigationRef} from './services/NavigationService';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {ActivityIndicator, View} from 'react-native';
// import Toast from 'react-native-toast-message';



// export default function App() {
//   const [loading, setLoading] = useState(true);
//   const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

 

//   useEffect(() => {
//     const checkUser = async () => {
//       try {
//         const userData = await AsyncStorage.getItem('userData');
//         setIsLoggedIn(!!userData);
//       } catch (err) {
//         console.log('Error checking user:', err);
//         setIsLoggedIn(false);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkUser();
//   }, []);

//   if (loading) {
//     return (
//       <View className="flex-1 justify-center items-center">
//         <ActivityIndicator size="large" color="blue" />
//       </View>
//     );
//   }
//   return (
//     <GestureHandlerRootView style={{flex: 1}}>
//       <NavigationContainer
//         ref={navigationRef}
//         onReady={() => {
//           setNavigationRef(navigationRef);
//         }}>
//         <RootNavigator isLoggedIn={isLoggedIn ?? false} />
//         <Toast position="top" /> 
//       </NavigationContainer>
//           {/* <Toast /> 👈 Yaha mount karna jaruri hai */}
//     </GestureHandlerRootView>
//   );
// }





























import './global.css';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
// import RootNavigator from './navigation/RootNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { navigationRef, setNavigationRef } from './services/NavigationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';
import Toast from 'react-native-toast-message';
import ForceUpdateService from './services/ForceUpdateService';
import ForceUpdateModal from './components/ForceUpdateModal';
import RootNavigator from './navigation/RootNavigator ';

export default function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [showForceUpdate, setShowForceUpdate] = useState<boolean>(false);

  useEffect(() => {
    const initializeApp = async (): Promise<void> => {
      try {
        // Parallel mein user check aur force update check
        const [userData, needsForceUpdate] = await Promise.all([
          AsyncStorage.getItem('userData'),
          ForceUpdateService.checkForceUpdate()
        ]);

        setIsLoggedIn(!!userData);
        
        // Agar force update chahiye toh modal show karo
        if (needsForceUpdate) {
          setShowForceUpdate(true);
        }
      } catch (err) {
        console.log('App initialization error:', err);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const handleUpdateNow = async (): Promise<void> => {
    await ForceUpdateService.redirectToStore();
  };

  // Loading state
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Force Update Modal - sabse upar */}
      <ForceUpdateModal 
        visible={showForceUpdate} 
        onUpdatePress={handleUpdateNow} 
      />
      
      {/* Normal App */}
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          setNavigationRef(navigationRef);
        }}>
        <RootNavigator isLoggedIn={isLoggedIn ?? false} />
        <Toast position="top" />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
