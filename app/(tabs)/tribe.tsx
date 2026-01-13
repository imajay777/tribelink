import { LinearGradient } from 'expo-linear-gradient';
import {
  Users,
  Crown,
  UserPlus,
  Award,
  X,
  Check,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';

export default function TribeScreen() {
  const { colors, activeTheme } = useTheme();
  const [isMatchingOpen, setIsMatchingOpen] = useState(true);

  const mockTribe = {
    name: 'Fitness Warriors',
    members: [
      { id: '1', name: 'Alex Thompson', followers: 45200, allyScore: 850 },
      { id: '2', name: 'Sarah Chen', followers: 28500, allyScore: 720 },
      { id: '3', name: 'Mike Rodriguez', followers: 42000, allyScore: 680 },
    ],
    totalAllyScore: 2250,
    rankings: {
      byNiche: { rank: 12, total: 450 },
      byFollowers: { rank: 87, total: 1200 },
      byLocation: { rank: 5, total: 89 },
    },
  };

  const mockJoinRequests = [
    {
      id: '1',
      creatorName: 'Emma Watson',
      followers: 51200,
      niches: [
        { category: 'Fitness', subNiche: 'Yoga' },
        { category: 'Lifestyle', subNiche: 'Wellness' },
      ],
      allyScore: 780,
      postingFrequency: 'Daily',
    },
    {
      id: '2',
      creatorName: 'James Wilson',
      followers: 38900,
      niches: [
        { category: 'Fitness', subNiche: 'Bodybuilding' },
      ],
      allyScore: 690,
      postingFrequency: '4-5x/week',
    },
  ];

  const { userProfile, setUserProfile } = useUser();
  const [members, setMembers] = useState(mockTribe.members);

  React.useEffect(() => {
    if (userProfile?.tribe?.members) setMembers(userProfile.tribe.members);
  }, [userProfile]);

  const derivedTribeName = userProfile?.tribe?.name ?? mockTribe.name;

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
            My Tribe
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
              style={[styles.tribeCard, { backgroundColor: colors.cardTransparent }]}
            >
              <View style={styles.tribeHeader}>
                <Crown size={32} color={colors.warning} />
                <Text style={[styles.tribeName, { color: colors.text }]}> 
                  {derivedTribeName}
                </Text>
              </View>

              <View style={styles.allyScoreSection}>
                <Text style={[styles.allyScoreLabel, { color: colors.textSecondary }]}>
                  Total Ally Score
                </Text>
                <Text style={[styles.allyScoreValue, { color: colors.primary }]}>
                  {mockTribe.totalAllyScore}
                </Text>
              </View>

              <View style={styles.rankingsSection}>
                <Text style={[styles.rankingsTitle, { color: colors.text }]}>
                  Tribe Rankings
                </Text>

                <View style={styles.rankingRow}>
                  <Text style={[styles.rankingLabel, { color: colors.textSecondary }]}>
                    By Niche (Fitness)
                  </Text>
                  <Text style={[styles.rankingValue, { color: colors.text }]}>
                    #{mockTribe.rankings.byNiche.rank} of {mockTribe.rankings.byNiche.total}
                  </Text>
                </View>

                <View style={styles.rankingRow}>
                  <Text style={[styles.rankingLabel, { color: colors.textSecondary }]}>
                    By Followers
                  </Text>
                  <Text style={[styles.rankingValue, { color: colors.text }]}>
                    #{mockTribe.rankings.byFollowers.rank} of {mockTribe.rankings.byFollowers.total}
                  </Text>
                </View>

                <View style={styles.rankingRow}>
                  <Text style={[styles.rankingLabel, { color: colors.textSecondary }]}>
                    By Location (LA)
                  </Text>
                  <Text style={[styles.rankingValue, { color: colors.text }]}>
                    #{mockTribe.rankings.byLocation.rank} of {mockTribe.rankings.byLocation.total}
                  </Text>
                </View>
              </View>
            </BlurView>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Tribe Members ({members.length}/5)</Text>

              {members.map((member) => (
                <BlurView
                  key={member.id}
                  intensity={activeTheme === 'dark' ? 20 : 80}
                  tint={activeTheme === 'dark' ? 'dark' : 'light'}
                  style={[styles.memberCard, { backgroundColor: colors.cardTransparent }]}
                >
                  <View style={styles.memberInfo}>
                    <View style={[styles.memberAvatar, { backgroundColor: colors.primary }]}>
                      <Text style={styles.memberInitial}>
                        {member.name.charAt(0)}
                      </Text>
                    </View>
                    <View style={styles.memberDetails}>
                      <Text style={[styles.memberName, { color: colors.text }]}>
                        {member.name}
                      </Text>
                      <View style={styles.memberStats}>
                        <Users size={14} color={colors.textSecondary} />
                        <Text style={[styles.memberStat, { color: colors.textSecondary }]}>
                          {(member.followers / 1000).toFixed(1)}K
                        </Text>
                        <Award size={14} color={colors.warning} />
                        <Text style={[styles.memberStat, { color: colors.textSecondary }]}>
                          {member.allyScore}
                        </Text>
                      </View>
                    </View>
                  </View>
                </BlurView>
              ))}

              {members.length < 5 && (
                <TouchableOpacity
                  style={[styles.addMemberButton, { backgroundColor: colors.card }]}
                  onPress={() => {
                    Alert.alert('Invite', 'Send a quick invite?', [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Send', onPress: async () => {
                        const newMember = { id: Date.now().toString(), name: 'Invited Member', followers: 0, allyScore: 0 };
                        setMembers(prev => [newMember, ...prev]);
                        if (setUserProfile) {
                          const updated = { ...(userProfile || {}), tribe: { ...(userProfile?.tribe || {}), members: [newMember, ...(userProfile?.tribe?.members || [])] } };
                          await setUserProfile(updated);
                        }
                      } }
                    ]);
                  }}
                >
                  <UserPlus size={24} color={colors.primary} />
                  <Text style={[styles.addMemberText, { color: colors.primary }]}>Invite New Members</Text>
                </TouchableOpacity>
              )}
            </View>

            {members.length < 3 && (
              <View style={styles.section}>
                <View style={styles.matchingHeader}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Tribe Matching
                  </Text>
                  <View style={styles.switchContainer}>
                    <Text style={[styles.switchLabel, { color: colors.textSecondary }]}>
                      {isMatchingOpen ? 'Open' : 'Closed'}
                    </Text>
                    <Switch
                      value={isMatchingOpen}
                      onValueChange={setIsMatchingOpen}
                      trackColor={{ false: colors.border, true: colors.primary }}
                      thumbColor="#ffffff"
                    />
                  </View>
                </View>

                {isMatchingOpen && (
                  <Text style={[styles.matchingInfo, { color: colors.textSecondary }]}>
                    Your tribe profile is visible on the matching page. You&apos;ll receive
                    join requests from creators looking to build tribes.
                  </Text>
                )}
              </View>
            )}

            {mockJoinRequests.length > 0 && isMatchingOpen && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Join Requests ({mockJoinRequests.length})
                </Text>

                {mockJoinRequests.map((request) => (
                  <BlurView
                    key={request.id}
                    intensity={activeTheme === 'dark' ? 20 : 80}
                    tint={activeTheme === 'dark' ? 'dark' : 'light'}
                    style={[styles.requestCard, { backgroundColor: colors.cardTransparent }]}
                  >
                    <View style={styles.requestHeader}>
                      <View style={[styles.requestAvatar, { backgroundColor: colors.accent }]}>
                        <Text style={styles.requestInitial}>
                          {request.creatorName.charAt(0)}
                        </Text>
                      </View>
                      <View style={styles.requestInfo}>
                        <Text style={[styles.requestName, { color: colors.text }]}>
                          {request.creatorName}
                        </Text>
                        <View style={styles.requestStats}>
                          <Users size={14} color={colors.textSecondary} />
                          <Text style={[styles.requestStat, { color: colors.textSecondary }]}>
                            {(request.followers / 1000).toFixed(1)}K
                          </Text>
                          <Award size={14} color={colors.warning} />
                          <Text style={[styles.requestStat, { color: colors.textSecondary }]}>
                            {request.allyScore}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.requestNiches}>
                      {request.niches.map((niche, index) => (
                        <View
                          key={index}
                          style={[styles.nicheBadge, { backgroundColor: colors.primary + '20' }]}
                        >
                          <Text style={[styles.nicheText, { color: colors.primary }]}>
                            {niche.category} - {niche.subNiche}
                          </Text>
                        </View>
                      ))}
                    </View>

                    <Text style={[styles.postingFrequency, { color: colors.textSecondary }]}>
                      Posts {request.postingFrequency}
                    </Text>

                    <View style={styles.requestActions}>
                      <TouchableOpacity
                        style={[styles.rejectButton, { backgroundColor: colors.error + '20' }]}
                      >
                        <X size={20} color={colors.error} />
                        <Text style={[styles.rejectText, { color: colors.error }]}>
                          Decline
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.acceptButton, { backgroundColor: colors.success }]}
                      >
                        <Check size={20} color="#ffffff" />
                        <Text style={styles.acceptText}>Accept</Text>
                      </TouchableOpacity>
                    </View>
                  </BlurView>
                ))}
              </View>
            )}
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
  tribeCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 28,
    overflow: 'hidden',
  },
  tribeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  tribeName: {
    fontSize: 24,
    fontWeight: '700' as const,
  },
  allyScoreSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
  },
  allyScoreLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  allyScoreValue: {
    fontSize: 48,
    fontWeight: '700' as const,
  },
  rankingsSection: {
    gap: 12,
  },
  rankingsTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  rankingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  rankingLabel: {
    fontSize: 14,
  },
  rankingValue: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 16,
  },
  memberCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberInitial: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  memberStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  memberStat: {
    fontSize: 14,
  },
  addMemberButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 20,
    borderRadius: 16,
    marginTop: 8,
  },
  addMemberText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  matchingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  matchingInfo: {
    fontSize: 14,
    lineHeight: 20,
  },
  requestCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  requestAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestInitial: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  requestInfo: {
    flex: 1,
  },
  requestName: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  requestStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  requestStat: {
    fontSize: 14,
  },
  requestNiches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
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
  postingFrequency: {
    fontSize: 14,
    marginBottom: 16,
  },
  requestActions: {
    flexDirection: 'row',
    gap: 12,
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
  },
  rejectText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  acceptButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
  },
  acceptText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#ffffff',
  },
});
