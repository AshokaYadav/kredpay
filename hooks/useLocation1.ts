import { useState, useCallback } from 'react';
import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

type CoordsType = {
  latitude: number;
  longitude: number;
};

export const useLocation1 = () => {
  const [location, setLocation] = useState('Fetching location...');
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  const openAppSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  // Ask permission
  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      try {
        const status = await Geolocation.requestAuthorization('whenInUse');
        return status === 'granted';
      } catch {
        return false;
      }
    }

    // ANDROID
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'We need your location to continue',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch {
      return false;
    }
  };

  // Fetch city/state name
  const getCurrentLocation = useCallback(() => {
    setLoadingLocation(true);

    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: { 'User-Agent': 'YourApp/1.0' },
            },
          );

          const data = await response.json();
          const address = data.address;
          const locationName =
            address?.city ||
            address?.town ||
            address?.village ||
            address?.state ||
            `Lat: ${latitude}, Long: ${longitude}`;

          setLocation(locationName);
        } catch {
          setLocation(`Lat: ${latitude}, Long: ${longitude}`);
        } finally {
          setLoadingLocation(false);
        }
      },
      (error) => {
        setLoadingLocation(false);
        switch (error.code) {
          case 1:
            Alert.alert('Permission Needed', 'Enable location services.', [
              { text: 'Open Settings', onPress: openAppSettings },
              { text: 'Cancel' },
            ]);
            break;

          case 2:
            setLocation('Location unavailable');
            break;

          case 3:
            Alert.alert('Timeout', 'Try again.', [{ text: 'OK' }]);
            break;

          default:
            setLocation('Unable to get location');
        }
      },
      {
        enableHighAccuracy: true,
        forceRequestLocation: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  }, []);

  // Initialize permission + first fetch
  const initLocation = async () => {
    const ok = await requestLocationPermission();
    setHasLocationPermission(ok);

    if (ok) {
      getCurrentLocation();
      return true;
    } else {
      setLocation('Location permission required');
      setLoadingLocation(false);
      return false;
    }
  };

  // For login use (asks permission every time)
  const initLocation1 = async () => {
    const ok = await requestLocationPermission();
    setHasLocationPermission(ok);

    if (ok) {
      getCurrentLocation();
      return true;
    } else {
      setLocation('Location permission required');
      setLoadingLocation(false);
      return false;
    }
  };

  // Get raw lat-long only
  const getRawCoords = (): Promise<CoordsType> => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          forceRequestLocation: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    });
  };

  return {
    location,
    loadingLocation,
    hasLocationPermission,
    initLocation,
    initLocation1,
    getCurrentLocation,
    getRawCoords,
  };
};
