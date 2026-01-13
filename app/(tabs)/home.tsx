import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Users, Trophy, Zap, Bell, Moon, Sun, Compass, UserCircle2, Target } from 'lucide-react-native';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
import { CHALLENGES } from '@/constants/data';

export default function HomeScreen() {
  const router = useRouter();
  const { colors, activeTheme, setTheme } = useTheme();
  const { userProfile } = useUser();

  const mockActivities = [
    {
      id: '1',
      user: 'Sarah Chen',
      action: 'completed The Signal',
      tribe: 'Fitness Warriors',
      time: '2h ago',
    },
    {
      id: '2',
      user: 'Mike Rodriguez',
      action: 'started The Hook',
      tribe: 'Tech Innovators',
      time: '4h ago',
    },
    {
      id: '3',
      user: 'Emma Watson',
      action: 'completed The Masterpiece',
      tribe: 'Fashion Forward',
      time: '6h ago',
    },
  ];

  const globalTribe = userProfile?.tribe?.name ?? 'Fitness Warriors';
  const activities = mockActivities.map(a => ({ ...a, tribe: a.tribe === 'Fitness Warriors' ? globalTribe : a.tribe }));

  return (
    <LinearGradient
      colors={[colors.background, colors.primaryDark, colors.background]}
      locations={[0, 0.3, 1]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            TribeSync
          </Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.push('/updates')}
            >
              <Bell size={24} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.push('/discover')}
            >
              <Compass size={24} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setTheme(activeTheme === 'dark' ? 'light' : 'dark')}
            >
              {activeTheme === 'dark' ? (
                <Sun size={24} color={colors.text} />
              ) : (
                <Moon size={24} color={colors.text} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.statsSection}>
              <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statCard}
              >
                <View style={styles.statCardContent}>
                  <Users size={32} color="#ffffff" />
                  <Text style={styles.statValue}>3/5</Text>
                  <Text style={styles.statLabel}>Tribe Members</Text>
                </View>
              </LinearGradient>

              <LinearGradient
                colors={[colors.accent, colors.accentDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statCard}
              >
                <View style={styles.statCardContent}>
                  <Trophy size={32} color="#ffffff" />
                  <Text style={styles.statValue}>850</Text>
                  <Text style={styles.statLabel}>Ally Score</Text>
                </View>
              </LinearGradient>

              <LinearGradient
                colors={[colors.success, colors.successDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statCard}
              >
                <View style={styles.statCardContent}>
                  <Zap size={32} color="#ffffff" />
                  <Text style={styles.statValue}>24</Text>
                  <Text style={styles.statLabel}>Completed</Text>
                </View>
              </LinearGradient>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  This Week&apos;s Challenges
                </Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/challenges')}>
                  <Text style={[styles.seeAllText, { color: colors.primary }]}>
                    See All
                  </Text>
                </TouchableOpacity>
              </View>

              {CHALLENGES.map((challenge, index) => (
                <BlurView
                  key={challenge.id}
                  intensity={activeTheme === 'dark' ? 20 : 80}
                  tint={activeTheme === 'dark' ? 'dark' : 'light'}
                  style={[styles.challengeCard, { backgroundColor: colors.cardTransparent }]}
                >
                  <View style={styles.challengeHeader}>
                    <View
                      style={[
                        styles.difficultyBadge,
                        {
                          backgroundColor:
                            challenge.difficulty === 'Easy'
                              ? colors.success
                              : challenge.difficulty === 'Medium'
                              ? colors.warning
                              : colors.error,
                        },
                      ]}
                    >
                      <Text style={styles.difficultyText}>
                        {challenge.difficulty}
                      </Text>
                    </View>
                    <Text style={[styles.challengePoints, { color: colors.primary }]}>
                      +{challenge.points} pts
                    </Text>
                  </View>
                  <Text style={[styles.challengeTitle, { color: colors.text }]}>
                    {challenge.name}
                  </Text>
                  <Text style={[styles.challengeDescription, { color: colors.textSecondary }]}>
                    {challenge.action}
                  </Text>
                </BlurView>
              ))}
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Tribe Activity
                </Text>
              </View>

              {activities.map((activity) => (
                <BlurView
                  key={activity.id}
                  intensity={activeTheme === 'dark' ? 20 : 80}
                  tint={activeTheme === 'dark' ? 'dark' : 'light'}
                  style={[styles.activityCard, { backgroundColor: colors.cardTransparent }]}
                >
                  <UserCircle2 size={40} color={colors.primary} />
                  <View style={styles.activityContent}>
                    <Text style={[styles.activityUser, { color: colors.text }]}>
                      {activity.user}
                    </Text>
                    <Text style={[styles.activityAction, { color: colors.textSecondary }]}>
                      {activity.action} in {activity.tribe}
                    </Text>
                    <Text style={[styles.activityTime, { color: colors.textTertiary }]}>
                      {activity.time}
                    </Text>
                  </View>
                </BlurView>
              ))}
            </View>

            <View style={styles.quickActionsSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Quick Actions
              </Text>

              <View style={styles.quickActionsGrid}>
                <TouchableOpacity
                  style={[styles.quickActionButton, { backgroundColor: colors.card }]}
                  onPress={() => router.push('/discover')}
                >
                  <Compass size={28} color={colors.primary} />
                  <Text style={[styles.quickActionText, { color: colors.text }]}>
                    Discover
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.quickActionButton, { backgroundColor: colors.card }]}
                  onPress={() => router.push('/(tabs)/tribe')}
                >
                  <Users size={28} color={colors.accent} />
                  <Text style={[styles.quickActionText, { color: colors.text }]}>
                    My Tribe
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.quickActionButton, { backgroundColor: colors.card }]}
                  onPress={() => router.push('/(tabs)/challenges')}
                >
                  <Target size={28} color={colors.success} />
                  <Text style={[styles.quickActionText, { color: colors.text }]}>
                    Challenges
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.quickActionButton, { backgroundColor: colors.card }]}
                  onPress={() => router.push('/(tabs)/leaderboards')}
                >
                  <Trophy size={28} color={colors.warning} />
                  <Text style={[styles.quickActionText, { color: colors.text }]}>
                    Rankings
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  statsSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    minHeight: 120,
  },
  statCardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.9,
    textAlign: 'center',
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
  seeAllText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  challengeCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600' as const,
  },
  challengePoints: {
    fontSize: 14,
    fontWeight: '700' as const,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    marginBottom: 8,
  },
  challengeDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  activityCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    overflow: 'hidden',
    gap: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityUser: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  activityAction: {
    fontSize: 14,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
  },
  quickActionsSection: {
    marginTop: 8,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  quickActionButton: {
    width: '48%',
    aspectRatio: 1.5,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
});
