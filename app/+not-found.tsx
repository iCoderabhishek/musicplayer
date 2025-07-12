import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotFoundScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center">
        <Text className="text-2xl font-bold text-gray-900">Page Not Found</Text>
        <Text className="text-gray-600 mt-2">This screen doesn't exist.</Text>
      </View>
    </SafeAreaView>
  );
}