import { useState, useCallback } from 'react';
import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

type CoordsType = {
  latitude: number;
  longitude: number;
};


export const useLocation = () => {
  const [location, setLocation] = useState('Fetching location...');
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  // Open settings
  const openAppSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  // Ask for permission
  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      try {
        const status = await Geolocation.requestAuthorization('whenInUse');
        return status === 'granted';
      } catch (error) {
        console.error('iOS permission error:', error);
        return false;
      }
    }

    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'We need your location to show your area.',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (error) {
        console.error('Android permission error:', error);
        return false;
      }
    }

    return false;
  };

  // Get GPS + City name
  const getCurrentLocation = useCallback(() => {
    setLoadingLocation(true);

    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: { 'User-Agent': 'YourAppName/1.0' }
            }
          );

          const data = await response.json();

          if (data.address) {
            const address = data.address;
            const locationName =
              address.city ||
              address.town ||
              address.village ||
              address.suburb ||
              address.county ||
              address.state;

            setLocation(locationName || 'Location found');
          } else {
            setLocation(`Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`);
          }
        } catch (error) {
          setLocation(`Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`);
        } finally {
          setLoadingLocation(false);
        }
      },
      (error) => {
        setLoadingLocation(false);

        switch (error.code) {
          case 1:
            setLocation('Location permission denied');
            Alert.alert(
              'Permission Needed',
              'Enable location services.',
              [{ text: 'Open Settings', onPress: openAppSettings }, { text: 'Cancel' }]
            );
            break;

          case 2:
            setLocation('Location unavailable');
            break;

          case 3:
            setLocation('Location request timeout');
            Alert.alert(
              'Timeout',
              'Try again.',
              [{ text: 'OK', onPress: () => refreshLocation() }]
            );
            break;

          default:
            setLocation('Unable to get location');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  }, []);

  // Refresh function
  const refreshLocation = () => {
    if (hasLocationPermission) {
      getCurrentLocation();
    } else {
      initLocation();
    }
  };

  // Initialize
  const initLocation = async () => {
    const ok = await requestLocationPermission();
    setHasLocationPermission(ok);

    if (ok) getCurrentLocation();
    else {
      setLocation('Location permission required');
      setLoadingLocation(false);
    }
  };





  const initLocation1 = async () => {
  const ok = await requestLocationPermission();
  setHasLocationPermission(ok);
  

  if (ok) {
    getCurrentLocation();
    return true;  // <-- IMPORTANT
  } else {
    setLocation('Location permission required');
    setLoadingLocation(false);
    return false; // <-- IMPORTANT
  }
};









  const getRawCoords = (): Promise<CoordsType> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  });
};


  return {
    location,
    loadingLocation,
    hasLocationPermission,
    initLocation,
    refreshLocation,
    getCurrentLocation,
    getRawCoords,
    initLocation1
  };
};
