import { Platform, Linking, Alert } from 'react-native';
import VersionCheck from 'react-native-version-check';

class ForceUpdateService {
  async checkForceUpdate(): Promise<boolean> {
    try {
      // App ke current version aur store version check karna
      const currentVersion = VersionCheck.getCurrentVersion();
      const latestVersion = await VersionCheck.getLatestVersion();
      
      // Version compare karna - yeh bhi async hai
      const needsUpdate = await VersionCheck.needUpdate({
        currentVersion,
        latestVersion
      });

      if (needsUpdate && needsUpdate.isNeeded) {
        this.showForceUpdateAlert();
        return true;
      }
      
      return false;
    } catch (error) {
      console.log('Force update check error:', error);
      return false;
    }
  }

  private showForceUpdateAlert(): void {
    Alert.alert(
      'Update Required',
      'A new version of the app is available. Please update to continue using the app.',
      [
        {
          text: 'Update Now',
          onPress: () => this.redirectToStore(),
          style: 'default' as const
        }
      ],
      { cancelable: false }
    );
  }

  async redirectToStore(): Promise<void> {
    try {
      const storeUrl = await VersionCheck.getStoreUrl();
      Linking.openURL(storeUrl);
    } catch (error) {
      console.log('Store redirect error:', error);
      // Fallback store URLs
      const fallbackUrl = Platform.OS === 'ios' 
        ? 'https://apps.apple.com/in/app/your-app-id'
        : 'https://play.google.com/store/apps/details?id=com.kredpay';
      
      Linking.openURL(fallbackUrl);
    }
  }
}

export default new ForceUpdateService();