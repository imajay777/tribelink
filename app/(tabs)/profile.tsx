import { LinearGradient } from 'expo-linear-gradient';
import {
  Instagram,
  Youtube,
  Facebook,
  Video,
  TrendingUp,
  Users,
  Award,
  MapPin,
  Edit3,
  CheckCircle,
  Trophy,
  Crown,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';

export default function ProfileScreen() {
  const { colors, activeTheme } = useTheme();
  const { userProfile, setTribeName, setUserProfile } = useUser();
  const [isEditingTribeName, setIsEditingTribeName] = useState(false);
  const [tribeNameLocal, setTribeNameLocal] = useState(userProfile?.tribe?.name || 'Fitness Warriors');
  const [profileState, setProfileState] = useState<any>(userProfile ?? null);

  React.useEffect(() => {
    if (userProfile) setProfileState(userProfile);
    if (!userProfile) setProfileState(null);
  }, [userProfile]);

  const handleTogglePlatform = async (platformId: string) => {
    setProfileState(prev => {
      const base = prev ?? mockProfile;
      const current = (base.platforms && base.platforms[platformId]) || { connected: false, username: null };
      const updatedPlatforms = {
        ...base.platforms,
        [platformId]: { ...current, connected: !current.connected, username: current.username ?? '@you' },
      };
      const updated = { ...base, platforms: updatedPlatforms };
      try {
        setUserProfile && setUserProfile(updated);
      } catch (e) {}
      return updated;
    });
  };
  React.useEffect(() => {
    if (userProfile?.tribe?.name) setTribeNameLocal(userProfile.tribe.name);
  }, [userProfile]);

  const mockProfile = {
    name: 'Alex Thompson',
    bio: 'Fitness content creator helping people transform their lives through sustainable habits',
    location: 'Los Angeles, CA',
    niche: 'Fitness',
    subNiche: 'Yoga',
    followers: 45200,
    followerGrowth: 12.5,
    engagementRate: 8.4,
    allyScore: 850,
    completedChallenges: 24,
    platforms: {
      instagram: { connected: true, username: '@alexthompson' },
      youtube: { connected: true, username: '@AlexFitness' },
      facebook: { connected: false, username: null },
      tiktok: { connected: true, username: '@alexfit' },
    },
  };

  const platforms = [
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: '#E1306C',
      data: profileState?.platforms?.instagram ?? mockProfile.platforms.instagram,
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: Youtube,
      color: '#FF0000',
      data: profileState?.platforms?.youtube ?? mockProfile.platforms.youtube,
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: '#1877F2',
      data: profileState?.platforms?.facebook ?? mockProfile.platforms.facebook,
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: Video,
      color: '#000000',
      data: profileState?.platforms?.tiktok ?? mockProfile.platforms.tiktok,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.primary, colors.primaryDark, colors.background]}
        locations={[0, 0.3, 0.7]}
        style={styles.gradientBackground}
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Profile
          </Text>
          <TouchableOpacity style={styles.editButton}>
            <Edit3 size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <BlurView
              intensity={activeTheme === 'dark' ? 30 : 80}
              tint={activeTheme === 'dark' ? 'dark' : 'light'}
              style={[styles.profileCard, { backgroundColor: colors.cardTransparent }]}
            >
              <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                <Text style={styles.avatarText}>
                  {mockProfile.name.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>

              <Text style={[styles.name, { color: colors.text }]}>
                {mockProfile.name}
              </Text>

              <View style={styles.locationContainer}>
                <MapPin size={14} color={colors.textSecondary} />
                <Text style={[styles.location, { color: colors.textSecondary }]}>
                  {mockProfile.location}
                </Text>
              </View>

              <View style={styles.nicheBadges}>
                <View style={[styles.nicheBadge, { backgroundColor: colors.primary + '20' }]}>
                  <Text style={[styles.nicheText, { color: colors.primary }]}>
                    {mockProfile.niche}
                  </Text>
                </View>
                <View style={[styles.nicheBadge, { backgroundColor: colors.accent + '20' }]}>
                  <Text style={[styles.nicheText, { color: colors.accent }]}>
                    {mockProfile.subNiche}
                  </Text>
                </View>
              </View>

              <Text style={[styles.bio, { color: colors.textSecondary }]}>
                {mockProfile.bio}
              </Text>
            </BlurView>

            <View style={styles.statsGrid}>
              <BlurView
                intensity={activeTheme === 'dark' ? 20 : 80}
                tint={activeTheme === 'dark' ? 'dark' : 'light'}
                style={[styles.statCard, { backgroundColor: colors.cardTransparent }]}
              >
                <Users size={24} color={colors.primary} />
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {(mockProfile.followers / 1000).toFixed(1)}K
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Followers
                </Text>
                <View style={styles.growthBadge}>
                  <TrendingUp size={12} color={colors.success} />
                  <Text style={[styles.growthText, { color: colors.success }]}>
                    +{mockProfile.followerGrowth}%
                  </Text>
                </View>
              </BlurView>

              <BlurView
                intensity={activeTheme === 'dark' ? 20 : 80}
                tint={activeTheme === 'dark' ? 'dark' : 'light'}
                style={[styles.statCard, { backgroundColor: colors.cardTransparent }]}
              >
                <Award size={24} color={colors.accent} />
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {mockProfile.engagementRate}%
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Engagement
                </Text>
              </BlurView>

              <BlurView
                intensity={activeTheme === 'dark' ? 20 : 80}
                tint={activeTheme === 'dark' ? 'dark' : 'light'}
                style={[styles.statCard, { backgroundColor: colors.cardTransparent }]}
              >
                <Crown size={24} color={colors.warning} />
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {mockProfile.allyScore}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Ally Score
                </Text>
              </BlurView>

              <BlurView
                intensity={activeTheme === 'dark' ? 20 : 80}
                tint={activeTheme === 'dark' ? 'dark' : 'light'}
                style={[styles.statCard, { backgroundColor: colors.cardTransparent }]}
              >
                <Trophy size={24} color={colors.success} />
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {mockProfile.completedChallenges}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Challenges
                </Text>
              </BlurView>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Tribe Name
                </Text>
                <TouchableOpacity onPress={() => setIsEditingTribeName(true)}>
                  <Edit3 size={18} color={colors.primary} />
                </TouchableOpacity>
              </View>

              <BlurView
                intensity={activeTheme === 'dark' ? 20 : 80}
                tint={activeTheme === 'dark' ? 'dark' : 'light'}
                style={[styles.tribeNameCard, { backgroundColor: colors.cardTransparent }]}
              >
                <Text style={[styles.tribeName, { color: colors.text }]}>
                  {userProfile?.tribe?.name ?? tribeNameLocal}
                </Text>
              </BlurView>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Connected Platforms
              </Text>

              {platforms.map((platform) => {
                const Icon = platform.icon;
                const isConnected = platform.data.connected;

                return (
                  <BlurView
                    key={platform.id}
                    intensity={activeTheme === 'dark' ? 20 : 80}
                    tint={activeTheme === 'dark' ? 'dark' : 'light'}
                    style={[styles.platformCard, { backgroundColor: colors.cardTransparent }]}
                  >
                    <View style={styles.platformInfo}>
                      <View
                        style={[
                          styles.platformIcon,
                          { backgroundColor: platform.color + '20' },
                        ]}
                      >
                        <Icon size={24} color={platform.color} />
                      </View>
                      <View style={styles.platformDetails}>
                        <Text style={[styles.platformName, { color: colors.text }]}>
                          {platform.name}
                        </Text>
                        {isConnected ? (
                          <Text style={[styles.platformUsername, { color: colors.textSecondary }]}>
                            {platform.data.username}
                          </Text>
                        ) : (
                          <Text style={[styles.platformStatus, { color: colors.textTertiary }]}>
                            Not connected
                          </Text>
                        )}
                      </View>
                    </View>

                    {isConnected ? (
                      <View style={styles.connectedBadge}>
                        <CheckCircle size={16} color={colors.success} />
                        <Text style={[styles.connectedText, { color: colors.success }]}>
                          Connected
                        </Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={[styles.connectButton, { backgroundColor: platform.color }]}
                        onPress={() => handleTogglePlatform(platform.id)}
                      >
                        <Text style={styles.connectText}>Connect</Text>
                      </TouchableOpacity>
                    )}
                  </BlurView>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      <Modal
        visible={isEditingTribeName}
        transparent
        animationType="fade"
        onRequestClose={() => setIsEditingTribeName(false)}
      >
        <View style={styles.modalOverlay}>
          <BlurView
            intensity={100}
            tint={activeTheme === 'dark' ? 'dark' : 'light'}
            style={[styles.modalContent, { backgroundColor: colors.card + 'F0' }]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Edit Tribe Name
            </Text>

            <TextInput
              value={tribeNameLocal}
              onChangeText={setTribeNameLocal}
              style={[
                styles.tribeNameInput,
                {
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              placeholder="Enter tribe name"
              placeholderTextColor={colors.textTertiary}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.card }]}
                onPress={() => setIsEditingTribeName(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={async () => {
                  await setTribeName(tribeNameLocal);
                  setIsEditingTribeName(false);
                }}
              >
                <Text style={[styles.modalButtonText, { color: '#ffffff' }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
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
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
  },
  editButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  profileCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  name: {
    fontSize: 24,
    fontWeight: '700' as const,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  location: {
    fontSize: 14,
  },
  nicheBadges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  nicheBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  nicheText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  bio: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    overflow: 'hidden',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  growthText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  tribeNameCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    overflow: 'hidden',
  },
  tribeName: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  platformCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  platformInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  platformIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  platformDetails: {
    flex: 1,
  },
  platformName: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  platformUsername: {
    fontSize: 14,
  },
  platformStatus: {
    fontSize: 14,
  },
  connectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  connectedText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  connectButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  connectText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    borderRadius: 20,
    padding: 24,
    overflow: 'hidden',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 20,
    textAlign: 'center',
  },
  tribeNameInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
