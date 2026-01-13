import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Instagram, Youtube, Facebook, Video, Heart, MessageCircle, Share2, ChevronLeft } from 'lucide-react-native';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';

interface Update {
  id: string;
  user: string;
  platform: 'instagram' | 'youtube' | 'facebook' | 'tiktok';
  type: 'post' | 'story' | 'video' | 'reel';
  content: string;
  thumbnail?: string;
  likes: number;
  comments: number;
  time: string;
  tribe: string;
}

export default function UpdatesScreen() {
  const router = useRouter();
  const { colors, activeTheme } = useTheme();
  const { userProfile } = useUser();

  const mockUpdates: Update[] = [
    {
      id: '1',
      user: 'Sarah Chen',
      platform: 'instagram',
      type: 'reel',
      content: 'New yoga flow for morning energy 🧘‍♀️',
      thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
      likes: 1243,
      comments: 89,
      time: '2h ago',
      tribe: 'Fitness Warriors',
    },
    {
      id: '2',
      user: 'Mike Rodriguez',
      platform: 'youtube',
      type: 'video',
      content: 'Building a React Native app from scratch - Full Tutorial',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
      likes: 3421,
      comments: 234,
      time: '5h ago',
      tribe: 'Tech Innovators',
    },
    {
      id: '3',
      user: 'Emma Watson',
      platform: 'tiktok',
      type: 'video',
      content: 'Styling thrifted clothes into modern fits ✨',
      thumbnail: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400',
      likes: 5678,
      comments: 432,
      time: '8h ago',
      tribe: 'Fashion Forward',
    },
    {
      id: '4',
      user: 'Alex Johnson',
      platform: 'instagram',
      type: 'post',
      content: 'Collaboration with @sarah_chen on new workout series!',
      thumbnail: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
      likes: 892,
      comments: 67,
      time: '12h ago',
      tribe: 'Fitness Warriors',
    },
    {
      id: '5',
      user: 'Lisa Park',
      platform: 'facebook',
      type: 'post',
      content: 'Top 5 productivity hacks for entrepreneurs in 2025',
      likes: 567,
      comments: 43,
      time: '1d ago',
      tribe: 'Tech Innovators',
    },
  ];

  const globalTribe = userProfile?.tribe?.name ?? 'Fitness Warriors';
  const updates = mockUpdates.map(u => ({
    ...u,
    tribe: u.tribe === 'Fitness Warriors' ? globalTribe : u.tribe,
  }));

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <Instagram size={16} color={colors.primary} strokeWidth={2} />;
      case 'youtube':
        return <Youtube size={16} color={colors.error} strokeWidth={2} />;
      case 'facebook':
        return <Facebook size={16} color="#1877F2" strokeWidth={2} />;
      case 'tiktok':
        return <Video size={16} color={colors.text} strokeWidth={2} />;
      default:
        return null;
    }
  };

  return (
    <LinearGradient
      colors={[colors.background, colors.primaryDark, colors.background]}
      locations={[0, 0.3, 1]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            style={styles.backButton}
          >
            <ChevronLeft size={28} color={colors.text} strokeWidth={2} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Tribe Updates</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {updates.map((update) => (
            <TouchableOpacity
              key={update.id}
              activeOpacity={0.85}
              onPress={() => Alert.alert('Update', 'Open update details coming soon.')}
            >
              <BlurView
                intensity={20}
                tint={activeTheme === 'dark' ? 'dark' : 'light'}
                style={[styles.updateCard, { borderColor: colors.border }]}
              >
              <View style={styles.updateContent}>
                <View style={styles.updateHeader}>
                  <View style={styles.userInfo}>
                    <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                      <Text style={[styles.avatarText, { color: colors.text }]}>
                        {update.user.split(' ').map(n => n[0]).join('')}
                      </Text>
                    </View>
                    <View style={styles.userTextContainer}>
                      <Text style={[styles.userName, { color: colors.text }]}>{update.user}</Text>
                      <View style={styles.metaRow}>
                        <View style={[styles.platformBadge, { backgroundColor: colors.surfaceLight }]}>
                          {getPlatformIcon(update.platform)}
                          <Text style={[styles.platformText, { color: colors.textSecondary }]}>
                            {update.platform}
                          </Text>
                        </View>
                        <Text style={[styles.timeText, { color: colors.textTertiary }]}>• {update.time}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <Text style={[styles.contentText, { color: colors.text }]}>{update.content}</Text>

                {update.thumbnail && (
                  <Image
                    source={{ uri: update.thumbnail }}
                    style={styles.thumbnail}
                    resizeMode="cover"
                  />
                )}

                <View style={styles.actionBar}>
                  <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                      <Heart size={18} color={colors.textSecondary} strokeWidth={2} />
                      <Text style={[styles.statText, { color: colors.textSecondary }]}>
                        {update.likes.toLocaleString()}
                      </Text>
                    </View>
                    <View style={styles.statItem}>
                      <MessageCircle size={18} color={colors.textSecondary} strokeWidth={2} />
                      <Text style={[styles.statText, { color: colors.textSecondary }]}>
                        {update.comments}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => Alert.alert('Share', 'Share functionality coming soon.') }>
                    <Share2 size={18} color={colors.textSecondary} strokeWidth={2} />
                  </TouchableOpacity>
                </View>

                <View style={[styles.tribeBadge, { backgroundColor: colors.surfaceLight }]}>
                  <Text style={[styles.tribeText, { color: colors.primary }]}>{update.tribe}</Text>
                </View>
              </View>
            </BlurView>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  updateCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  updateContent: {
    padding: 16,
    gap: 12,
  },
  updateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  userTextContainer: {
    gap: 4,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700' as const,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  platformBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  platformText: {
    fontSize: 11,
    fontWeight: '600' as const,
    textTransform: 'capitalize',
  },
  timeText: {
    fontSize: 12,
  },
  contentText: {
    fontSize: 14,
    lineHeight: 20,
  },
  thumbnail: {
    width: '100%',
    height: 240,
    borderRadius: 12,
    marginTop: 4,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  tribeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 4,
  },
  tribeText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
});
