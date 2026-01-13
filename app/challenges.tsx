import { LinearGradient } from 'expo-linear-gradient';
import { Target, Zap, CheckCircle2, Clock } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/contexts/ThemeContext';
import { CHALLENGES } from '@/constants/data';
import { useUser } from '@/contexts/UserContext';

export default function ChallengesScreen() {
  const { colors, activeTheme } = useTheme();
  const { userProfile, setUserProfile } = useUser();

  const mockChallengesWithProgress = [
    {
      ...CHALLENGES[0],
      completed: false,
      progress: 0,
      maxProgress: 2,
    },
    {
      ...CHALLENGES[1],
      completed: false,
      progress: 1,
      maxProgress: 1,
    },
    {
      ...CHALLENGES[2],
      completed: true,
      progress: 1,
      maxProgress: 1,
    },
  ];

  const [challenges, setChallenges] = useState(mockChallengesWithProgress);

  const completedCount = challenges.filter(c => c.completed).length;
  const totalPoints = challenges.reduce((sum, c) => sum + (c.completed ? c.points : 0), 0);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('challenges_progress_v1');
        if (raw) {
          const parsed = JSON.parse(raw);
          const merged = mockChallengesWithProgress.map(base => {
            const saved = parsed.find((s: any) => s.id === base.id);
            return saved ? { ...base, ...saved } : base;
          });
          setChallenges(merged);
        }
      } catch (e) {}
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem('challenges_progress_v1', JSON.stringify(challenges));
      } catch (e) {}
    })();
  }, [challenges]);

  const handleStartChallenge = (id: string) => {
    setChallenges(prev => {
      return prev.map(c => {
        if (c.id !== id) return c;

        const nextProgress = (c.progress || 0) + 1;
        const completed = nextProgress >= (c.maxProgress || 1);

        const updated = { ...c, progress: nextProgress, completed };

          if (completed) {
          Alert.alert('Challenge Complete', `${c.name} completed! You earned ${c.points} points.`);
          if (setUserProfile) {
            const current = userProfile || {};
            const tribe = current.tribe || {};
            const currentTotal = tribe.totalAllyScore || 0;
            const points = c.points || 0;

            const members = Array.isArray(tribe.members) ? tribe.members : [];
            let updatedMembers = members.slice();
            if (members.length > 0 && points > 0) {
              const baseShare = Math.floor(points / members.length);
              let remainder = points % members.length;
              updatedMembers = members.map((m: any, idx: number) => ({
                ...m,
                allyScore: (m.allyScore || 0) + baseShare + (idx < remainder ? 1 : 0),
              }));
            }

            const updatedProfile: any = {
              ...current,
              tribe: {
                ...tribe,
                totalAllyScore: currentTotal + points,
                members: updatedMembers,
              },
            };

            setUserProfile(updatedProfile);
          }
        } else {
          Alert.alert('Progress Saved', `${c.name}: ${nextProgress}/${c.maxProgress}`);
        }

        return updated;
      });
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.primary, colors.primaryDark, colors.background]}
        locations={[0, 0.3, 0.7]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Challenges</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Complete to boost your Ally Score
            </Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.progressSection}>
            <BlurView
              intensity={20}
              tint={activeTheme === 'dark' ? 'dark' : 'light'}
              style={[styles.progressCard, { borderColor: colors.border }]}
            >
              <LinearGradient
                colors={['rgba(225, 48, 108, 0.2)', 'rgba(131, 58, 180, 0.2)']}
                style={styles.progressCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.progressHeader}>
                  <Target size={32} color={colors.accent} strokeWidth={2} />
                  <View style={styles.progressTextContainer}>
                    <Text style={[styles.progressValue, { color: colors.text }]}>
                      {completedCount}/{mockChallengesWithProgress.length}
                    </Text>
                    <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
                      Challenges Complete
                    </Text>
                  </View>
                </View>

                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBarBg, { backgroundColor: colors.surfaceLight }]}>
                    <Animated.View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${(completedCount / mockChallengesWithProgress.length) * 100}%`,
                        },
                      ]}
                    >
                      <LinearGradient
                        colors={colors.gradient as any}
                        style={StyleSheet.absoluteFill}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      />
                    </Animated.View>
                  </View>
                </View>

                <View style={styles.pointsRow}>
                  <View style={styles.pointsBadge}>
                    <Zap size={20} color={colors.warning} strokeWidth={2.5} />
                    <Text style={[styles.pointsValue, { color: colors.text }]}>
                      {totalPoints} Points Earned
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </BlurView>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              This Week&apos;s Challenges
            </Text>
            <View style={styles.challengesList}>
              {challenges.map((challenge) => (
                <TouchableOpacity
                  key={challenge.id}
                  activeOpacity={0.8}
                  onPress={() => Alert.alert('Challenge', 'Tap the Start button to begin this challenge.')}
                >
                  <BlurView
                    intensity={15}
                    tint={activeTheme === 'dark' ? 'dark' : 'light'}
                    style={[
                      styles.challengeCard,
                      {
                        borderColor: challenge.completed
                          ? colors.success
                          : colors.border,
                        opacity: challenge.completed ? 0.7 : 1,
                      },
                    ]}
                  >
                    <LinearGradient
                      colors={[`${challenge.color}20`, `${challenge.color}05`]}
                      style={styles.challengeGradient}
                    >
                      <View style={styles.challengeHeader}>
                        <View style={styles.challengeTopRow}>
                          <View
                            style={[
                              styles.challengeBadge,
                              { backgroundColor: colors.surfaceLight },
                            ]}
                          >
                            <Text
                              style={[
                                styles.challengeDifficulty,
                                { color: colors.textSecondary },
                              ]}
                            >
                              {challenge.difficulty}
                            </Text>
                          </View>
                          <View style={styles.pointsBadgeSmall}>
                            <Zap size={14} color={colors.warning} strokeWidth={2.5} />
                            <Text style={[styles.pointsText, { color: colors.warning }]}>
                              {challenge.points}
                            </Text>
                          </View>
                        </View>
                        {challenge.completed && (
                          <View style={styles.completedBadge}>
                            <CheckCircle2
                              size={24}
                              color={colors.success}
                              strokeWidth={2.5}
                            />
                          </View>
                        )}
                      </View>

                      <Text style={[styles.challengeName, { color: colors.text }]}>
                        {challenge.name}
                      </Text>
                      <Text
                        style={[styles.challengeDescription, { color: colors.textSecondary }]}
                      >
                        {challenge.description}
                      </Text>

                      {!challenge.completed && challenge.maxProgress && (
                        <View style={styles.challengeProgress}>
                          <View style={styles.progressLabelRow}>
                            <Clock size={14} color={colors.textSecondary} strokeWidth={2} />
                            <Text
                              style={[styles.progressLabelText, { color: colors.textSecondary }]}
                            >
                              Progress: {challenge.progress}/{challenge.maxProgress}
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.challengeProgressBar,
                              { backgroundColor: colors.surfaceLight },
                            ]}
                          >
                            <View
                              style={[
                                styles.challengeProgressFill,
                                {
                                  width: `${((challenge.progress || 0) / challenge.maxProgress) * 100}%`,
                                  backgroundColor: challenge.color,
                                },
                              ]}
                            />
                          </View>
                        </View>
                      )}

                      {!challenge.completed && (
                        <TouchableOpacity
                          style={[
                            styles.challengeButton,
                            { backgroundColor: challenge.color },
                          ]}
                          activeOpacity={0.8}
                          onPress={() => handleStartChallenge(challenge.id)}
                        >
                          <Text style={styles.challengeButtonText}>
                            {challenge.progress && challenge.progress > 0
                              ? 'Continue'
                              : 'Start Challenge'}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </LinearGradient>
                  </BlurView>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
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
  title: {
    fontSize: 32,
    fontWeight: '800' as const,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    gap: 32,
  },
  progressSection: {
    marginBottom: -8,
  },
  progressCard: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  progressCardGradient: {
    padding: 24,
    gap: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  progressTextContainer: {
    flex: 1,
  },
  progressValue: {
    fontSize: 32,
    fontWeight: '800' as const,
    lineHeight: 36,
  },
  progressLabel: {
    fontSize: 14,
    marginTop: 2,
  },
  progressBarContainer: {
    gap: 8,
  },
  progressBarBg: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
    overflow: 'hidden',
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pointsValue: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800' as const,
  },
  challengesList: {
    gap: 16,
  },
  challengeCard: {
    borderRadius: 20,
    borderWidth: 2,
    overflow: 'hidden',
  },
  challengeGradient: {
    padding: 20,
    gap: 16,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  challengeTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
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
  pointsBadgeSmall: {
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
  completedBadge: {
    marginLeft: 8,
  },
  challengeName: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  challengeDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  challengeProgress: {
    gap: 8,
  },
  progressLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  progressLabelText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  challengeProgressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  challengeProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  challengeButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  challengeButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700' as const,
  },
});
