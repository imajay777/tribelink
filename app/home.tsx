import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Users, Trophy, Zap, TrendingUp, User, Bell, Moon, Sun, Compass, UserCircle2, Target } from 'lucide-react-native';
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
import { CHALLENGES } from '@/constants/data';

export default function HomeScreen() {
  const router = useRouter();
  const { colors, activeTheme, setTheme } = useTheme();

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

  return (
    <LinearGradient
      colors={[colors.background, colors.primaryDark, colors.background]}
      locations={[0, 0.3, 1]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>Welcome back!</Text>
            <Text style={[styles.userName, { color: colors.text }]}>Alex Thompson</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => router.push('/updates')}
              activeOpacity={0.7}
            >
              <BlurView intensity={30} tint={activeTheme === 'dark' ? 'dark' : 'light'} style={[styles.iconButton, { borderColor: colors.border }]}>
                <Bell size={22} color={colors.text} strokeWidth={2} />
              </BlurView>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTheme(activeTheme === 'dark' ? 'light' : 'dark')}
              activeOpacity={0.7}
            >
              <BlurView intensity={30} tint={activeTheme === 'dark' ? 'dark' : 'light'} style={[styles.iconButton, { borderColor: colors.border }]}>
                {activeTheme === 'dark' ? (
                  <Sun size={22} color={colors.warning} strokeWidth={2} />
                ) : (
                  <Moon size={22} color={colors.primary} strokeWidth={2} />
                )}
              </BlurView>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/profile')}
              activeOpacity={0.7}
            >
              <BlurView intensity={30} tint={activeTheme === 'dark' ? 'dark' : 'light'} style={[styles.profileButton, { borderColor: colors.border }]}>
                <User size={24} color={colors.text} strokeWidth={2} />
              </BlurView>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity
              onPress={() => router.push('/discover')}
              activeOpacity={0.8}
            >
              <BlurView intensity={20} tint={activeTheme === 'dark' ? 'dark' : 'light'} style={[styles.quickActionCard, { borderColor: colors.border }]}>
                <LinearGradient
                  colors={['rgba(225, 48, 108, 0.2)', 'rgba(225, 48, 108, 0.05)']}
                  style={styles.quickActionGradient}
                >
                  <Compass size={28} color={colors.primary} strokeWidth={2} />
                  <Text style={[styles.quickActionTitle, { color: colors.text }]}>Discover</Text>
                  <Text style={[styles.quickActionDescription, { color: colors.textSecondary }]}>
                    Find creators
                  </Text>
                </LinearGradient>
              </BlurView>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/tribe')}
              activeOpacity={0.8}
            >
              <BlurView intensity={20} tint={activeTheme === 'dark' ? 'dark' : 'light'} style={[styles.quickActionCard, { borderColor: colors.border }]}>
                <LinearGradient
                  colors={['rgba(131, 58, 180, 0.2)', 'rgba(131, 58, 180, 0.05)']}
                  style={styles.quickActionGradient}
                >
                  <UserCircle2 size={28} color={colors.primaryDark} strokeWidth={2} />
                  <Text style={[styles.quickActionTitle, { color: colors.text }]}>My Tribe</Text>
                  <Text style={[styles.quickActionDescription, { color: colors.textSecondary }]}>
                    Manage members
                  </Text>
                </LinearGradient>
              </BlurView>
            </TouchableOpacity>
          </View>

          <View style={styles.quickActionsContainer}>
            <TouchableOpacity
              onPress={() => router.push('/challenges')}
              activeOpacity={0.8}
            >
              <BlurView intensity={20} tint={activeTheme === 'dark' ? 'dark' : 'light'} style={[styles.quickActionCard, { borderColor: colors.border }]}>
                <LinearGradient
                  colors={['rgba(255, 184, 0, 0.2)', 'rgba(255, 184, 0, 0.05)']}
                  style={styles.quickActionGradient}
                >
                  <Target size={28} color={colors.warning} strokeWidth={2} />
                  <Text style={[styles.quickActionTitle, { color: colors.text }]}>Challenges</Text>
                  <Text style={[styles.quickActionDescription, { color: colors.textSecondary }]}>
                    Complete tasks
                  </Text>
                </LinearGradient>
              </BlurView>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/leaderboards')}
              activeOpacity={0.8}
            >
              <BlurView intensity={20} tint={activeTheme === 'dark' ? 'dark' : 'light'} style={[styles.quickActionCard, { borderColor: colors.border }]}>
                <LinearGradient
                  colors={['rgba(0, 255, 135, 0.2)', 'rgba(0, 255, 135, 0.05)']}
                  style={styles.quickActionGradient}
                >
                  <Trophy size={28} color={colors.success} strokeWidth={2} />
                  <Text style={[styles.quickActionTitle, { color: colors.text }]}>Leaderboards</Text>
                  <Text style={[styles.quickActionDescription, { color: colors.textSecondary }]}>
                    See rankings
                  </Text>
                </LinearGradient>
              </BlurView>
            </TouchableOpacity>
          </View>

          <View style={styles.statsContainer}>
            <BlurView intensity={20} tint={activeTheme === 'dark' ? 'dark' : 'light'} style={[styles.statCard, { borderColor: colors.border }]}>
              <View style={styles.statContent}>
                <Trophy size={32} color={colors.accent} strokeWidth={2} />
                <View style={styles.statTextContainer}>
                  <Text style={[styles.statValue, { color: colors.text }]}>850</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Ally Score</Text>
                </View>
              </View>
            </BlurView>

            <BlurView intensity={20} tint={activeTheme === 'dark' ? 'dark' : 'light'} style={[styles.statCard, { borderColor: colors.border }]}>
              <View style={styles.statContent}>
                <TrendingUp size={32} color={colors.success} strokeWidth={2} />
                <View style={styles.statTextContainer}>
                  <Text style={[styles.statValue, { color: colors.text }]}>+12%</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>30d Growth</Text>
                </View>
              </View>
            </BlurView>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Tribe Trio Challenges</Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>Complete to boost your Ally Score</Text>

            <View style={styles.challengesContainer}>
              {CHALLENGES.map((challenge) => (
                <TouchableOpacity key={challenge.id} activeOpacity={0.8}>
                  <BlurView intensity={20} tint={activeTheme === 'dark' ? 'dark' : 'light'} style={[styles.challengeCard, { borderColor: colors.border }]}>
                    <LinearGradient
                      colors={[`${challenge.color}20`, `${challenge.color}05`]}
                      style={styles.challengeGradient}
                    >
                      <View style={styles.challengeHeader}>
                        <View style={[styles.challengeBadge, { backgroundColor: colors.surfaceLight }]}>
                          <Text style={[styles.challengeDifficulty, { color: colors.textSecondary }]}>{challenge.difficulty}</Text>
                        </View>
                        <View style={styles.pointsBadge}>
                          <Zap size={14} color={colors.warning} strokeWidth={2.5} />
                          <Text style={[styles.pointsText, { color: colors.warning }]}>{challenge.points}</Text>
                        </View>
                      </View>
                      <Text style={[styles.challengeName, { color: colors.text }]}>{challenge.name}</Text>
                      <Text style={[styles.challengeDescription, { color: colors.textSecondary }]}>
                        {challenge.description}
                      </Text>
                    </LinearGradient>
                  </BlurView>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Tribe Activity</Text>
            <View style={styles.activitiesContainer}>
              {mockActivities.map((activity) => (
                <BlurView key={activity.id} intensity={15} tint={activeTheme === 'dark' ? 'dark' : 'light'} style={[styles.activityCard, { borderColor: colors.border }]}>
                  <View style={styles.activityContent}>
                    <View style={[styles.activityIconContainer, { backgroundColor: colors.surfaceLight }]}>
                      <Users size={20} color={colors.primary} strokeWidth={2} />
                    </View>
                    <View style={styles.activityTextContainer}>
                      <Text style={[styles.activityText, { color: colors.text }]}>
                        <Text style={[styles.activityUser, { color: colors.primary }]}>{activity.user}</Text>
                        {' '}
                        {activity.action}
                      </Text>
                      <Text style={[styles.activityMeta, { color: colors.textSecondary }]}>
                        {activity.tribe} • {activity.time}
                      </Text>
                    </View>
                  </View>
                </BlurView>
              ))}
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
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  greeting: {
    fontSize: 14,
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800' as const,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    overflow: 'hidden',
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    gap: 24,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  quickActionGradient: {
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    marginTop: 4,
  },
  quickActionDescription: {
    fontSize: 12,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  statContent: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statTextContainer: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800' as const,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800' as const,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginTop: -8,
  },
  challengesContainer: {
    gap: 12,
  },
  challengeCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  challengeGradient: {
    padding: 20,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  challengeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  challengeDifficulty: {
    fontSize: 11,
    fontWeight: '700' as const,
    textTransform: 'uppercase',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 184, 0, 0.2)',
    borderRadius: 8,
  },
  pointsText: {
    fontSize: 13,
    fontWeight: '700' as const,
  },
  challengeName: {
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 8,
  },
  challengeDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  activitiesContainer: {
    gap: 12,
  },
  activityCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  activityContent: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityTextContainer: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  activityUser: {
    fontWeight: '700' as const,
  },
  activityMeta: {
    fontSize: 12,
  },
});
