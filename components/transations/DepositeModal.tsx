import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

interface DepositeModalProps {
  isVisible: boolean;
  onClose: () => void;
  data: any;
}

const DepositeModal: React.FC<DepositeModalProps> = ({
  isVisible,
  onClose,
  data,
}) => {
  const navigation = useNavigation<any>();
  if (!data) return null;

  console.log(data);

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={{justifyContent: 'flex-end', margin: 0}}
      statusBarTranslucent>
      <View className="bg-white p-5 rounded-t-2xl">
        {/* Title */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-gray-800 font-bold text-lg">More Details</Text>

          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={22} color="#555" />
          </TouchableOpacity>
        </View>

        {/* Amount with check icon */}
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-green-600 text-xl font-bold mr-2">
            ₹{data.price || data?.amount}
          </Text>

          <Icon name="checkmark-circle" size={24} color="#22C55E" />
        </View>

        {/* Success banner */}
        <Text className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-lg mb-4">
          This transaction was successful
        </Text>

        {/* Transaction details */}
        {/* Transaction details */}
        <View className="mb-4">
          <Text className="text-gray-500 text-xs mb-1">
            Transaction Details
          </Text>

          <View className="bg-gray-50 p-3 rounded-lg space-y-1">
            {/* Remote Order ID */}
            {data?.remote_order_id && (
              <View className="flex-row justify-between">
                <Text className="text-gray-600 text-xs font-semibold">
                  Order ID
                </Text>
                <Text className="text-gray-700 text-xs">
                  {data.remote_order_id.charAt(0).toUpperCase() +
                    data.remote_order_id.slice(1)}
                </Text>
              </View>
            )}

            {/* BANK RRN */}
            {data?.bank_rrn && (
              <View className="flex-row justify-between">
                <Text className="text-gray-600 text-xs font-semibold">
                  Bank RRN
                </Text>
                <Text className="text-gray-700 text-xs">{data.bank_rrn}</Text>
              </View>
            )}

            {/* Debit UPI ID */}
            {data?.debit_txn_upi_id && (
              <View className="flex-row justify-between">
                <Text className="text-gray-600 text-xs font-semibold">
                  UPI ID
                </Text>
                <Text className="text-gray-700 text-xs">
                  {data.debit_txn_upi_id}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View className="mb-2">
          <Text className="text-gray-500 text-xs">Transaction ID</Text>
          <Text className="text-gray-700 text-sm">{data.clientRefNo}</Text>
        </View>

        <View className="mb-2">
          <Text className="text-gray-500 text-xs">Date & Time</Text>
          <Text className="text-gray-700 text-sm">
            {new Date(data.createdAt).toLocaleString('en-GB', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-gray-500 text-xs">Payment Method</Text>
          <Text className="text-gray-700 text-sm">Upi Intent</Text>
        </View>

        {/* Buttons */}
        {/* <TouchableOpacity
          onPress={() => {
            onClose(); 
            navigation.navigate('RaiseComplaint', {txn: data});
          }}
          className="border border-pink-500 rounded-lg py-2 items-center mb-2">
          <Text className="text-pink-500 font-semibold">Raise a complaint</Text>
        </TouchableOpacity> */}

        <View className="flex-row justify-between">
          <TouchableOpacity className="bg-yellow-100 px-4 py-2 rounded-lg">
            <Text className="text-yellow-800 font-semibold">Need Support?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            className="bg-pink-100 px-4 py-2 rounded-lg">
            <Text className="text-pink-600 font-semibold">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DepositeModal;
