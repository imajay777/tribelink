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
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  Animated,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';

export default function ProfileScreen() {
  const { colors, activeTheme } = useTheme();
  const [isEditingTribeName, setIsEditingTribeName] = useState(false);

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
      tiktok: { connected: false, username: null },
    },
  };

  const rankings = {
    byNiche: { rank: 12, total: 450, category: 'Fitness - Yoga' },
    byFollowers: { rank: 87, total: 1200, bracket: 'Micro (10K-50K)' },
    byLocation: { rank: 5, total: 89, region: 'Los Angeles, CA' },
  };

  const { userProfile, setTribeName, setUserProfile } = useUser();
  const [tribeNameLocal, setTribeNameLocal] = useState(userProfile?.tribe?.name ?? 'Fitness Warriors');
  const [profileState, setProfileState] = useState<any>(userProfile ?? mockProfile);
  const [editingPlatform, setEditingPlatform] = useState<string | null>(null);
  const [editingUsername, setEditingUsername] = useState('');

  useEffect(() => {
    if (userProfile) {
      setTribeNameLocal(userProfile.tribe?.name ?? tribeNameLocal);
      setProfileState(userProfile);
    }
  }, [userProfile]);

  const allyScale = useRef(new Animated.Value(1)).current;
  const lastAllyRef = useRef<number | undefined>(userProfile?.allyScore);

  useEffect(() => {
    const newVal = userProfile?.allyScore;
    if (typeof newVal === 'number' && newVal !== lastAllyRef.current) {
      lastAllyRef.current = newVal;
      Animated.sequence([
        Animated.timing(allyScale, { toValue: 1.12, duration: 220, useNativeDriver: true }),
        Animated.timing(allyScale, { toValue: 1, duration: 220, useNativeDriver: true }),
      ]).start();
    }
  }, [userProfile?.allyScore]);

  const renderPlatformStatus = (
    platformId: string,
    icon: React.ReactNode,
    connectedProp: boolean,
    usernameProp: string | null
  ) => {
    const connected = profileState?.platforms?.[platformId]?.connected ?? connectedProp;
    const username = profileState?.platforms?.[platformId]?.username ?? usernameProp;

    return (
      <BlurView
        key={platformId}
        intensity={15}
        tint={activeTheme === 'dark' ? 'dark' : 'light'}
        style={[styles.platformCard, { borderColor: colors.border }]}
      >
        <View style={styles.platformCardContent}>
          <View style={styles.platformInfo}>
            <View style={[styles.platformIconContainer, { backgroundColor: colors.surfaceLight }]}>
              {icon}
            </View>
            <View style={styles.platformTextContainer}>
              <Text style={[styles.platformName, { color: colors.text }]}>
                {platformId.charAt(0).toUpperCase() + platformId.slice(1)}
              </Text>
              {username && (
                <Text style={[styles.platformUsername, { color: colors.textSecondary }]}>
                  {username}
                </Text>
              )}
            </View>
          </View>

          {connected ? (
            <View style={styles.platformActionsRow}>
              <View style={styles.statusBadge}>
                <CheckCircle size={18} color={colors.success} strokeWidth={2} />
                <Text style={[styles.statusText, { color: colors.success }]}>Connected</Text>
              </View>
              <TouchableOpacity style={styles.smallAction} onPress={() => { setEditingPlatform(platformId); setEditingUsername(username || ''); }}>
                <Text style={{ color: colors.primary }}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.smallAction}
                onPress={async () => {
                  const base = profileState ?? mockProfile;
                  const updated = { ...base, platforms: { ...(base.platforms || {}), [platformId]: { ...(base.platforms[platformId] || {}), connected: false } } };
                  setProfileState(updated);
                  setUserProfile && await setUserProfile(updated);
                }}
              >
                <Text style={{ color: colors.error }}>Disconnect</Text>
              </TouchableOpacity>
            </View>
          ) : (
                  <TouchableOpacity
                    style={[styles.connectButton, { backgroundColor: colors.primary }]}
                    onPress={async () => {
                      const base = profileState ?? mockProfile;
                      const current = (base.platforms && base.platforms[platformId]) || { connected: false, username: null };
                      const updated = { ...base, platforms: { ...(base.platforms || {}), [platformId]: { ...(current || {}), connected: true, username: current.username ?? '@you' } } };
                      setProfileState(updated);
                      setUserProfile && await setUserProfile(updated);
                    }}
                  >
              <Text style={[styles.connectButtonText, { color: '#FFFFFF' }]}>Connect</Text>
            </TouchableOpacity>
          )}
        </View>
      </BlurView>
    );
  };

  return (
    <LinearGradient
      colors={[colors.background, colors.primaryDark, colors.background]}
      locations={[0, 0.3, 1]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={colors.gradient as any}
                style={styles.avatar}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={[styles.avatarText, { color: '#FFFFFF' }]}>
                  {mockProfile.name.split(' ').map((n) => n[0]).join('')}
                </Text>
              </LinearGradient>
            </View>

            <TouchableOpacity
              style={styles.editButton}
              activeOpacity={0.7}
              onPress={() => Alert.alert('Edit Profile', 'Edit profile coming soon.')}
            >
              <BlurView
                intensity={20}
                tint={activeTheme === 'dark' ? 'dark' : 'light'}
                style={[styles.editButtonInner, { borderColor: colors.border }]}
              >
                <Edit3 size={20} color={colors.text} strokeWidth={2} />
                <Text style={[styles.editButtonText, { color: colors.text }]}>Edit Profile</Text>
              </BlurView>
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <Text style={[styles.name, { color: colors.text }]}>{mockProfile.name}</Text>
            <View style={styles.locationContainer}>
              <MapPin size={16} color={colors.textSecondary} strokeWidth={2} />
              <Text style={[styles.location, { color: colors.textSecondary }]}>
                {mockProfile.location}
              </Text>
            </View>
            <Text style={[styles.bio, { color: colors.textSecondary }]}>{mockProfile.bio}</Text>

            <View style={styles.nicheContainer}>
              <BlurView
                intensity={15}
                tint={activeTheme === 'dark' ? 'dark' : 'light'}
                style={[styles.nicheTag, { borderColor: colors.border }]}
              >
                <Text style={[styles.nicheText, { color: colors.text }]}>{mockProfile.niche}</Text>
              </BlurView>
              <BlurView
                intensity={15}
                tint={activeTheme === 'dark' ? 'dark' : 'light'}
                style={[styles.nicheTag, { borderColor: colors.border }]}
              >
                <Text style={[styles.nicheText, { color: colors.text }]}>
                  {mockProfile.subNiche}
                </Text>
              </BlurView>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Tribe</Text>
              <TouchableOpacity
                onPress={() => setIsEditingTribeName(true)}
                activeOpacity={0.7}
              >
                <Edit3 size={18} color={colors.primary} strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <BlurView
              intensity={25}
              tint={activeTheme === 'dark' ? 'dark' : 'light'}
              style={[styles.tribeCard, { borderColor: colors.border }]}
            >
              <LinearGradient
                colors={['rgba(225, 48, 108, 0.2)', 'rgba(131, 58, 180, 0.2)']}
                style={styles.tribeCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.tribeHeader}>
                  <Crown size={32} color={colors.warning} strokeWidth={2} />
                  <Text style={[styles.tribeName, { color: colors.text }]}>{userProfile?.tribe?.name ?? tribeNameLocal}</Text>
                </View>
                <Text style={[styles.tribeMembers, { color: colors.textSecondary }]}>
                  5 active members
                </Text>
              </LinearGradient>
            </BlurView>

            <View style={styles.rankingsContainer}>
              <Text style={[styles.rankingsTitle, { color: colors.textSecondary }]}>
                Tribe Rankings
              </Text>

              <BlurView
                intensity={15}
                tint={activeTheme === 'dark' ? 'dark' : 'light'}
                style={[styles.rankingCard, { borderColor: colors.border }]}
              >
                <View style={styles.rankingContent}>
                  <View style={styles.rankingLeft}>
                    <Trophy size={20} color={colors.primary} strokeWidth={2} />
                    <View style={styles.rankingTextContainer}>
                      <Text style={[styles.rankingLabel, { color: colors.textSecondary }]}>
                        By Niche
                      </Text>
                      <Text style={[styles.rankingCategory, { color: colors.textTertiary }]}>
                        {rankings.byNiche.category}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.rankingRight}>
                    <Text style={[styles.rankingValue, { color: colors.text }]}>
                      #{rankings.byNiche.rank}
                    </Text>
                    <Text style={[styles.rankingTotal, { color: colors.textSecondary }]}>
                      of {rankings.byNiche.total}
                    </Text>
                  </View>
                </View>
              </BlurView>

              <BlurView
                intensity={15}
                tint={activeTheme === 'dark' ? 'dark' : 'light'}
                style={[styles.rankingCard, { borderColor: colors.border }]}
              >
                <View style={styles.rankingContent}>
                  <View style={styles.rankingLeft}>
                    <Users size={20} color={colors.accent} strokeWidth={2} />
                    <View style={styles.rankingTextContainer}>
                      <Text style={[styles.rankingLabel, { color: colors.textSecondary }]}>
                        By Followers
                      </Text>
                      <Text style={[styles.rankingCategory, { color: colors.textTertiary }]}>
                        {rankings.byFollowers.bracket}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.rankingRight}>
                    <Text style={[styles.rankingValue, { color: colors.text }]}>
                      #{rankings.byFollowers.rank}
                    </Text>
                    <Text style={[styles.rankingTotal, { color: colors.textSecondary }]}>
                      of {rankings.byFollowers.total}
                    </Text>
                  </View>
                </View>
              </BlurView>

              <BlurView
                intensity={15}
                tint={activeTheme === 'dark' ? 'dark' : 'light'}
                style={[styles.rankingCard, { borderColor: colors.border }]}
              >
                <View style={styles.rankingContent}>
                  <View style={styles.rankingLeft}>
                    <MapPin size={20} color={colors.success} strokeWidth={2} />
                    <View style={styles.rankingTextContainer}>
                      <Text style={[styles.rankingLabel, { color: colors.textSecondary }]}>
                        By Location
                      </Text>
                      <Text style={[styles.rankingCategory, { color: colors.textTertiary }]}>
                        {rankings.byLocation.region}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.rankingRight}>
                    <Text style={[styles.rankingValue, { color: colors.text }]}>
                      #{rankings.byLocation.rank}
                    </Text>
                    <Text style={[styles.rankingTotal, { color: colors.textSecondary }]}>
                      of {rankings.byLocation.total}
                    </Text>
                  </View>
                </View>
              </BlurView>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Connected Platforms</Text>

            <View style={styles.platformsList}>
              {renderPlatformStatus(
                'instagram',
                <Instagram size={22} color={colors.primary} strokeWidth={2} />,
                mockProfile.platforms.instagram.connected,
                mockProfile.platforms.instagram.username
              )}
              {renderPlatformStatus(
                'youtube',
                <Youtube size={22} color={colors.error} strokeWidth={2} />,
                mockProfile.platforms.youtube.connected,
                mockProfile.platforms.youtube.username
              )}
              {renderPlatformStatus(
                'facebook',
                <Facebook size={22} color="#1877F2" strokeWidth={2} />,
                mockProfile.platforms.facebook.connected,
                mockProfile.platforms.facebook.username
              )}
              {renderPlatformStatus(
                'tiktok',
                <Video size={22} color={colors.text} strokeWidth={2} />,
                mockProfile.platforms.tiktok.connected,
                mockProfile.platforms.tiktok.username
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>The Vitals</Text>

            <View style={styles.vitalsGrid}>
              <BlurView
                intensity={20}
                tint={activeTheme === 'dark' ? 'dark' : 'light'}
                style={[styles.vitalCard, { borderColor: colors.border }]}
              >
                <View style={styles.vitalContent}>
                  <Users size={28} color={colors.primary} strokeWidth={2} />
                  <Text style={[styles.vitalValue, { color: colors.text }]}>
                    {(mockProfile.followers / 1000).toFixed(1)}K
                  </Text>
                  <Text style={[styles.vitalLabel, { color: colors.textSecondary }]}>
                    Followers
                  </Text>
                </View>
              </BlurView>

              <BlurView
                intensity={20}
                tint={activeTheme === 'dark' ? 'dark' : 'light'}
                style={[styles.vitalCard, { borderColor: colors.border }]}
              >
                <View style={styles.vitalContent}>
                  <TrendingUp size={28} color={colors.success} strokeWidth={2} />
                  <Text style={[styles.vitalValue, { color: colors.text }]}>
                    +{mockProfile.followerGrowth}%
                  </Text>
                  <Text style={[styles.vitalLabel, { color: colors.textSecondary }]}>
                    30d Growth
                  </Text>
                </View>
              </BlurView>

              <BlurView
                intensity={20}
                tint={activeTheme === 'dark' ? 'dark' : 'light'}
                style={[styles.vitalCard, { borderColor: colors.border }]}
              >
                <View style={styles.vitalContent}>
                  <Award size={28} color={colors.warning} strokeWidth={2} />
                  <Text style={[styles.vitalValue, { color: colors.text }]}>
                    {mockProfile.engagementRate}%
                  </Text>
                  <Text style={[styles.vitalLabel, { color: colors.textSecondary }]}>
                    Engagement
                  </Text>
                </View>
              </BlurView>
            </View>
          </View>

          <View style={styles.section}>
            <BlurView
              intensity={25}
              tint={activeTheme === 'dark' ? 'dark' : 'light'}
              style={[styles.allyScoreCard, { borderColor: colors.border }]}
            >
              <LinearGradient
                colors={['rgba(225, 48, 108, 0.2)', 'rgba(131, 58, 180, 0.2)']}
                style={styles.allyScoreGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.allyScoreContent}>
                  <View style={styles.allyScoreHeader}>
                    <Award size={40} color={colors.accent} strokeWidth={2.5} />
                    <View style={styles.allyScoreTextContainer}>
                      <Animated.Text style={[styles.allyScoreValue, { color: colors.text, transform: [{ scale: allyScale }] }]}> 
                        {userProfile?.allyScore ?? mockProfile.allyScore}
                      </Animated.Text>
                      <Text style={[styles.allyScoreLabel, { color: colors.textSecondary }]}>
                        Ally Score
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.allyScoreDescription, { color: colors.textSecondary }]}>
                    Your collaboration strength score. The higher it is, the more attractive you
                    are to brands and tribes.
                  </Text>
                  <View style={styles.allyScoreStats}>
                    <View style={styles.allyScoreStat}>
                        <Text style={[styles.allyScoreStatValue, { color: colors.accent }]}>
                        {userProfile?.completedChallenges ?? mockProfile.completedChallenges}
                      </Text>
                      <Text style={[styles.allyScoreStatLabel, { color: colors.textSecondary }]}>
                        Challenges Completed
                      </Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </BlurView>
          </View>
        </ScrollView>
      </SafeAreaView>

      <Modal
        visible={isEditingTribeName}
        transparent
        animationType="fade"
        onRequestClose={() => setIsEditingTribeName(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <BlurView
            intensity={40}
            tint={activeTheme === 'dark' ? 'dark' : 'light'}
            style={[styles.modalContent, { borderColor: colors.border }]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Tribe Name</Text>
            <TextInput
              style={[
                styles.modalInput,
                {
                  color: colors.text,
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
              value={tribeNameLocal}
              onChangeText={setTribeNameLocal}
              placeholder="Enter tribe name"
              placeholderTextColor={colors.textSecondary}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.surface }]}
                onPress={() => setIsEditingTribeName(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={async () => {
                  await setTribeName(tribeNameLocal);
                  await setUserProfile && setUserProfile({ ...(userProfile || {}), tribe: { ...(userProfile?.tribe || {}), name: tribeNameLocal } });
                  setIsEditingTribeName(false);
                }}
              >
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
      </Modal>
      <Modal
        visible={!!editingPlatform}
        transparent
        animationType="fade"
        onRequestClose={() => setEditingPlatform(null)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}> 
          <BlurView intensity={40} tint={activeTheme === 'dark' ? 'dark' : 'light'} style={[styles.modalContent, { borderColor: colors.border }]}> 
            <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Username</Text>
            <TextInput value={editingUsername} onChangeText={setEditingUsername} placeholder="@username" placeholderTextColor={colors.textSecondary} style={[styles.modalInput, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]} />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: colors.surface }]} onPress={() => setEditingPlatform(null)}>
                <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: colors.primary }]} onPress={async () => {
                if (!editingPlatform) return;
                const base = profileState ?? mockProfile;
                const updated = { ...base, platforms: { ...(base.platforms || {}), [editingPlatform]: { ...(base.platforms[editingPlatform] || {}), username: editingUsername } } };
                setProfileState(updated);
                setUserProfile && await setUserProfile(updated);
                setEditingPlatform(null);
              }}>
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
      </Modal>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    gap: 32,
  },
  header: {
    alignItems: 'center',
    gap: 20,
  },
  avatarContainer: {
    marginTop: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 42,
    fontWeight: '800' as const,
  },
  editButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  editButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
  },
  editButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  profileInfo: {
    alignItems: 'center',
    gap: 12,
  },
  name: {
    fontSize: 28,
    fontWeight: '800' as const,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  location: {
    fontSize: 14,
  },
  bio: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  nicheContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  nicheTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  nicheText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  section: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800' as const,
  },
  tribeCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  tribeCardGradient: {
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  tribeHeader: {
    alignItems: 'center',
    gap: 12,
  },
  tribeName: {
    fontSize: 24,
    fontWeight: '800' as const,
  },
  tribeMembers: {
    fontSize: 14,
  },
  rankingsContainer: {
    gap: 12,
    marginTop: 8,
  },
  rankingsTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  rankingCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  rankingContent: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rankingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  rankingTextContainer: {
    gap: 2,
    flex: 1,
  },
  rankingLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  rankingCategory: {
    fontSize: 12,
  },
  rankingRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  rankingValue: {
    fontSize: 20,
    fontWeight: '800' as const,
  },
  rankingTotal: {
    fontSize: 12,
  },
  platformsList: {
    gap: 12,
  },
  platformCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  platformCardContent: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  platformInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  platformIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  platformTextContainer: {
    gap: 4,
    flex: 1,
  },
  platformName: {
    fontSize: 15,
    fontWeight: '700' as const,
  },
  platformUsername: {
    fontSize: 13,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  connectButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  connectButtonText: {
    fontSize: 13,
    fontWeight: '700' as const,
  },
  vitalsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  vitalCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  vitalContent: {
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  vitalValue: {
    fontSize: 20,
    fontWeight: '800' as const,
  },
  vitalLabel: {
    fontSize: 11,
    textAlign: 'center',
  },
  allyScoreCard: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  allyScoreGradient: {
    padding: 24,
  },
  allyScoreContent: {
    gap: 16,
  },
  allyScoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  allyScoreTextContainer: {
    flex: 1,
  },
  allyScoreValue: {
    fontSize: 48,
    fontWeight: '800' as const,
    lineHeight: 52,
  },
  allyScoreLabel: {
    fontSize: 16,
    marginTop: 4,
  },
  allyScoreDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  allyScoreStats: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 8,
  },
  allyScoreStat: {
    gap: 4,
  },
  allyScoreStatValue: {
    fontSize: 24,
    fontWeight: '800' as const,
  },
  allyScoreStatLabel: {
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 24,
    gap: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  modalButtons: {
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
    fontSize: 15,
    fontWeight: '700' as const,
  },
});
