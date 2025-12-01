import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ForceUpdateModalProps } from '../types/forceUpdate';

const ForceUpdateModal: React.FC<ForceUpdateModalProps> = ({
  visible,
  onUpdatePress,
}) => {
  if (!visible) return null;

  return (
    <View className="absolute inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <View className="w-[85%] bg-white rounded-2xl p-6 shadow-xl">

        <Text className="text-2xl font-bold text-green-900 mb-3 text-center">
          Update Required
        </Text>

        <Text className="text-base text-gray-600 text-center leading-5 mb-6">
          A new version of the app is available. Please update to continue using the app.
        </Text>

        <TouchableOpacity
          onPress={onUpdatePress}
          className="bg-green-600 active:bg-blue-700 rounded-xl py-3 shadow-md"
        >
          <Text className="text-white text-lg font-semibold text-center">
            Update Now
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

export default ForceUpdateModal;
