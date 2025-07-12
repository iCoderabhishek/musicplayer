import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react-native';
import { Audio } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Track {
  id: number;
  title: string;
  artist: { name: string };
  album: { cover_medium: string };
  preview: string;
  duration: number;
}

export default function DiscoverTab() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playingTrack, setPlayingTrack] = useState<number | null>(null);

  useEffect(() => {
    fetchPopularTracks();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const fetchPopularTracks = async () => {
    try {
      const response = await fetch('https://api.deezer.com/chart/0/tracks?limit=20');
      const data = await response.json();
      setTracks(data.data || []);
    } catch (error) {
      console.error('Error fetching tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  const playTrack = async (track: Track) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      if (playingTrack === track.id) {
        setPlayingTrack(null);
        setSound(null);
        return;
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: track.preview },
        { shouldPlay: true }
      );

      setSound(newSound);
      setPlayingTrack(track.id);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setPlayingTrack(null);
          setSound(null);
        }
      });
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="mt-4 text-gray-600">Loading popular tracks...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 py-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">Discover Music</Text>
        <Text className="text-gray-600 mt-1">Popular tracks right now</Text>
      </View>
      
      <ScrollView className="flex-1">
        {tracks.map((track) => (
          <TouchableOpacity
            key={track.id}
            className="flex-row items-center p-4 border-b border-gray-100"
            onPress={() => playTrack(track)}
          >
            <Image
              source={{ uri: track.album.cover_medium }}
              className="w-16 h-16 rounded-lg"
            />
            
            <View className="flex-1 ml-4">
              <Text className="text-lg font-semibold text-gray-900" numberOfLines={1}>
                {track.title}
              </Text>
              <Text className="text-gray-600 mt-1" numberOfLines={1}>
                {track.artist.name}
              </Text>
              <Text className="text-gray-400 text-sm mt-1">
                {formatDuration(track.duration)}
              </Text>
            </View>
            
            <TouchableOpacity
              className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center"
              onPress={() => playTrack(track)}
            >
              {playingTrack === track.id ? (
                <Pause size={20} color="white" />
              ) : (
                <Play size={20} color="white" />
              )}
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}