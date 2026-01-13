import { LinearGradient } from 'expo-linear-gradient';
import { Target, Zap, CheckCircle2, Clock } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
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
          // ensure shape: map over mockChallenges to avoid stale schema
          const merged = mockChallengesWithProgress.map(base => {
            const saved = parsed.find((s: any) => s.id === base.id);
            return saved ? { ...base, ...saved } : base;
          });
          setChallenges(merged);
        }
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem('challenges_progress_v1', JSON.stringify(challenges));
      } catch (e) {
        // ignore
      }
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

            // Distribute points across members (even split, remainder to first members)
            const members = Array.isArray(tribe.members) ? tribe.members : [];
            let updatedMembers = members.slice();
            if (members.length > 0 && points > 0) {
              const baseShare = Math.floor(points / members.length);
              let remainder = points % members.length;
              updatedMembers = members.map((m: any, idx: number) => ({
                ...m,
                allyScore: (m.allyScore || 0) + baseShare + (remainder > 0 ? 1 : 0),
              })).map((m: any, idx: number) => {
                if (idx < remainder) return m;
                return m;
              });
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
        locations={[0, 0.2, 0.6]}
        style={styles.gradientBackground}
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Weekly Challenges
          </Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <BlurView
              intensity={activeTheme === 'dark' ? 30 : 80}
              tint={activeTheme === 'dark' ? 'dark' : 'light'}
              style={[styles.progressCard, { backgroundColor: colors.cardTransparent }]}
            >
              <View style={styles.progressHeader}>
                <Target size={32} color={colors.primary} />
                <Text style={[styles.progressTitle, { color: colors.text }]}>
                  This Week&apos;s Progress
                </Text>
              </View>

              <View style={styles.progressStats}>
                <View style={styles.progressStat}>
                  <Text style={[styles.progressStatValue, { color: colors.primary }]}>
                    {completedCount}/{mockChallengesWithProgress.length}
                  </Text>
                  <Text style={[styles.progressStatLabel, { color: colors.textSecondary }]}>
                    Completed
                  </Text>
                </View>

                <View style={styles.progressDivider} />

                <View style={styles.progressStat}>
                  <Text style={[styles.progressStatValue, { color: colors.success }]}>
                    {totalPoints}
                  </Text>
                  <Text style={[styles.progressStatLabel, { color: colors.textSecondary }]}>
                    Points Earned
                  </Text>
                </View>
              </View>

              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    { backgroundColor: colors.border },
                  ]}
                >
                  <LinearGradient
                    colors={[colors.primary, colors.accent]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${(completedCount / mockChallengesWithProgress.length) * 100}%`,
                      },
                    ]}
                  />
                </View>
              </View>
            </BlurView>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                The Tribe Trio
              </Text>

              {challenges.map((challenge, index) => {
                const progressPercentage = (challenge.progress / challenge.maxProgress) * 100;

                return (
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

                      {challenge.completed ? (
                        <View style={styles.completedBadge}>
                          <CheckCircle2 size={20} color={colors.success} />
                          <Text style={[styles.completedText, { color: colors.success }]}>
                            Completed
                          </Text>
                        </View>
                      ) : (
                        <View style={styles.pointsBadge}>
                          <Zap size={16} color={colors.primary} />
                          <Text style={[styles.pointsText, { color: colors.primary }]}>
                            +{challenge.points}
                          </Text>
                        </View>
                      )}
                    </View>

                    <Text style={[styles.challengeTitle, { color: colors.text }]}>
                      {challenge.name}
                    </Text>

                    <Text style={[styles.challengeAction, { color: colors.textSecondary }]}>
                      {challenge.action}
                    </Text>

                    <View style={styles.verificationSection}>
                      <Clock size={14} color={colors.textTertiary} />
                      <Text style={[styles.verificationText, { color: colors.textTertiary }]}>
                        {challenge.verification}
                      </Text>
                    </View>

                    {!challenge.completed && (
                      <>
                        <View style={styles.challengeProgressContainer}>
                          <View
                            style={[
                              styles.challengeProgressBar,
                              { backgroundColor: colors.border },
                            ]}
                          >
                            <LinearGradient
                              colors={[colors.primary, colors.accent]}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={[
                                styles.challengeProgressFill,
                                { width: `${progressPercentage}%` },
                              ]}
                            />
                          </View>
                          <Text style={[styles.challengeProgressText, { color: colors.textSecondary }]}>
                            {challenge.progress}/{challenge.maxProgress}
                          </Text>
                        </View>

                        <TouchableOpacity
                          style={[styles.startButton, { backgroundColor: colors.primary }]}
                          activeOpacity={0.8}
                          onPress={() => handleStartChallenge(challenge.id)}
                        >
                          <Text style={styles.startButtonText}>
                            {challenge.progress > 0 ? 'Continue' : 'Start Challenge'}
                          </Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </BlurView>
                );
              })}
            </View>

            <BlurView
              intensity={activeTheme === 'dark' ? 20 : 80}
              tint={activeTheme === 'dark' ? 'dark' : 'light'}
              style={[styles.infoCard, { backgroundColor: colors.cardTransparent }]}
            >
              <Text style={[styles.infoTitle, { color: colors.text }]}>
                How It Works
              </Text>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                Complete all three challenges each week to maximize your Ally Score and
                climb the leaderboards. Challenges reset every Monday at midnight.
              </Text>
            </BlurView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  progressCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 28,
    overflow: 'hidden',
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  progressTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  progressStats: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  progressStat: {
    flex: 1,
    alignItems: 'center',
  },
  progressStatValue: {
    fontSize: 32,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  progressStatLabel: {
    fontSize: 14,
  },
  progressDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 16,
  },
  challengeCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    overflow: 'hidden',
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  difficultyText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600' as const,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  completedText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '700' as const,
  },
  challengeTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 8,
  },
  challengeAction: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  verificationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  verificationText: {
    fontSize: 12,
  },
  challengeProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  challengeProgressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  challengeProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  challengeProgressText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  startButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  infoCard: {
    borderRadius: 16,
    padding: 20,
    overflow: 'hidden',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
