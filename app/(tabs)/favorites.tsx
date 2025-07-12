import { View, Text } from 'react-native';
import { Heart } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FavoritesTab() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 py-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">Favorites</Text>
        <Text className="text-gray-600 mt-1">Your liked tracks</Text>
      </View>
      
      <View className="flex-1 justify-center items-center">
        <Heart size={64} color="#D1D5DB" />
        <Text className="text-xl font-semibold text-gray-900 mt-4">No favorites yet</Text>
        <Text className="text-gray-600 mt-2 text-center px-8">
          Start exploring music and add tracks to your favorites
        </Text>
      </View>
    </SafeAreaView>
  );
}