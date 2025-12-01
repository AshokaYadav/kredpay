export interface ForceUpdateModalProps {
  visible: boolean;
  onUpdatePress: () => void;
}

export interface VersionCheckResult {
  isNeeded: boolean;
  currentVersion: string;
  latestVersion: string;
  storeUrl: string;
}