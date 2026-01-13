import { LinearGradient } from 'expo-linear-gradient';
import {
  Users,
  Crown,
  UserPlus,
  TrendingUp,
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
  Modal,
  TextInput,
  Pressable,
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
        { category: 'Lifestyle', subNiche: 'Minimalism' },
      ],
      message: "I'd love to collaborate with your tribe on wellness content!",
      timestamp: Date.now() - 3600000,
    },
    {
      id: '2',
      creatorName: 'David Kim',
      followers: 38900,
      niches: [
        { category: 'Fitness', subNiche: 'Bodybuilding' },
      ],
      message: 'Looking for like-minded fitness creators to grow with.',
      timestamp: Date.now() - 7200000,
    },
  ];

  const formatTimestamp = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / 3600000);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const { userProfile, setUserProfile } = useUser();
  const [members, setMembers] = useState(mockTribe.members);
  const [joinRequests, setJoinRequests] = useState(mockJoinRequests);
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [inviteName, setInviteName] = useState('');

  React.useEffect(() => {
    if (userProfile?.tribe?.members) setMembers(userProfile.tribe.members);
    if (userProfile?.tribe?.joinRequests) setJoinRequests(userProfile.tribe.joinRequests);
  }, [userProfile]);

  const derivedTribeName = userProfile?.tribe?.name ?? mockTribe.name;

  const handleAccept = async (id: string) => {
    const req = joinRequests.find(r => r.id === id);
    if (!req) return;
    const newMember = { id: req.id, name: req.creatorName, followers: req.followers, allyScore: 0 };
    setMembers(prev => [newMember, ...prev]);
    setJoinRequests(prev => prev.filter(r => r.id !== id));
    if (setUserProfile) {
      const updated = { ...(userProfile || {}), tribe: { ...(userProfile?.tribe || {}), members: [newMember, ...(userProfile?.tribe?.members || [])] } };
      await setUserProfile(updated);
    }
  };

  const handleDecline = (id: string) => {
    setJoinRequests(prev => prev.filter(r => r.id !== id));
  };

  const handleInvite = async () => {
    if (!inviteName.trim()) return Alert.alert('Invite', 'Please enter a name or handle.');
    const newMember = { id: Date.now().toString(), name: inviteName.trim(), followers: 0, allyScore: 0 };
    setMembers(prev => [newMember, ...prev]);
    setInviteName('');
    setInviteModalVisible(false);
    if (setUserProfile) {
      const updated = { ...(userProfile || {}), tribe: { ...(userProfile?.tribe || {}), members: [newMember, ...(userProfile?.tribe?.members || [])] } };
      await setUserProfile(updated);
    }
  };

  const handleRemoveMember = async (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    if (setUserProfile) {
      const updated = { ...(userProfile || {}), tribe: { ...(userProfile?.tribe || {}), members: (userProfile?.tribe?.members || []).filter((m: any) => m.id !== id) } };
      await setUserProfile(updated);
    }
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
            <Text style={[styles.title, { color: colors.text }]}>My Tribe</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {members.length} active members
            </Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.tribeHeader}>
            <BlurView
              intensity={20}
              tint={activeTheme === 'dark' ? 'dark' : 'light'}
              style={[styles.tribeCard, { borderColor: colors.border }]}
            >
              <LinearGradient
                colors={['rgba(225, 48, 108, 0.2)', 'rgba(131, 58, 180, 0.2)']}
                style={styles.tribeCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Crown size={40} color={colors.warning} strokeWidth={2} />
                <Text style={[styles.tribeName, { color: colors.text }]}> 
                  {derivedTribeName}
                </Text>
                <View style={styles.tribeStatsRow}>
                  <View style={styles.tribeStat}>
                    <Award size={20} color={colors.accent} strokeWidth={2} />
                    <Text style={[styles.tribeStatValue, { color: colors.text }]}>
                      {mockTribe.totalAllyScore}
                    </Text>
                    <Text style={[styles.tribeStatLabel, { color: colors.textSecondary }]}>
                      Total Score
                    </Text>
                  </View>
                  <View style={styles.tribeStat}>
                    <TrendingUp size={20} color={colors.success} strokeWidth={2} />
                    <Text style={[styles.tribeStatValue, { color: colors.text }]}>
                      #{mockTribe.rankings.byNiche.rank}
                    </Text>
                    <Text style={[styles.tribeStatLabel, { color: colors.textSecondary }]}>
                      Niche Rank
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </BlurView>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Matching Settings</Text>
            </View>
            <BlurView
              intensity={15}
              tint={activeTheme === 'dark' ? 'dark' : 'light'}
              style={[styles.settingsCard, { borderColor: colors.border }]}
            >
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingLabel, { color: colors.text }]}>
                    Open for New Members
                  </Text>
                  <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                    {members.length < 3
                      ? 'Need at least 3 members to close matching'
                      : 'Allow others to send join requests'}
                  </Text>
                </View>
                <Switch
                  value={isMatchingOpen}
                  onValueChange={setIsMatchingOpen}
                  disabled={members.length < 3}
                  trackColor={{ false: colors.surfaceLight, true: colors.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </BlurView>
          </View>

          {joinRequests.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Join Requests
                </Text>
                <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.badgeText}>{joinRequests.length}</Text>
                </View>
              </View>

              <View style={styles.requestsList}>
                {joinRequests.map((request) => (
                  <BlurView
                    key={request.id}
                    intensity={15}
                    tint={activeTheme === 'dark' ? 'dark' : 'light'}
                    style={[styles.requestCard, { borderColor: colors.border }]}
                  >
                    <View style={styles.requestHeader}>
                      <LinearGradient
                        colors={colors.gradient as any}
                        style={styles.requestAvatar}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Text style={styles.requestAvatarText}>
                          {request.creatorName.split(' ').map(n => n[0]).join('')}
                        </Text>
                      </LinearGradient>
                      <View style={styles.requestInfo}>
                        <Text style={[styles.requestName, { color: colors.text }]}>
                          {request.creatorName}
                        </Text>
                        <View style={styles.requestMetaRow}>
                          <Users size={14} color={colors.textSecondary} strokeWidth={2} />
                          <Text style={[styles.requestMetaText, { color: colors.textSecondary }]}>
                            {(request.followers / 1000).toFixed(1)}K
                          </Text>
                          <Text style={[styles.requestDot, { color: colors.textSecondary }]}>•</Text>
                          <Text style={[styles.requestMetaText, { color: colors.textSecondary }]}>
                            {formatTimestamp(request.timestamp)}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.requestNiches}>
                      {request.niches.map((niche, idx) => (
                        <View
                          key={idx}
                          style={[styles.requestNicheTag, { backgroundColor: colors.surfaceLight }]}
                        >
                          <Text style={[styles.requestNicheText, { color: colors.text }]}>
                            {niche.subNiche}
                          </Text>
                        </View>
                      ))}
                    </View>

                    <Text style={[styles.requestMessage, { color: colors.textSecondary }]}>
                      {request.message}
                    </Text>

                    <View style={styles.requestActions}>
                      <TouchableOpacity
                        style={[styles.requestActionButton, { backgroundColor: colors.surfaceLight }]}
                        activeOpacity={0.7}
                        onPress={() => handleDecline(request.id)}
                      >
                        <X size={20} color={colors.error} strokeWidth={2.5} />
                        <Text style={[styles.requestActionText, { color: colors.error }]}>Decline</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.requestActionButton, { backgroundColor: colors.primary }]}
                        activeOpacity={0.7}
                        onPress={() => handleAccept(request.id)}
                      >
                        <Check size={20} color="#FFFFFF" strokeWidth={2.5} />
                        <Text style={[styles.requestActionText, { color: '#FFFFFF' }]}>Accept</Text>
                      </TouchableOpacity>
                    </View>
                  </BlurView>
                ))}
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Members</Text>
            <View style={styles.membersList}>
              {members.map((member) => (
                <BlurView
                  key={member.id}
                  intensity={15}
                  tint={activeTheme === 'dark' ? 'dark' : 'light'}
                  style={[styles.memberCard, { borderColor: colors.border }]}
                >
                  <View style={styles.memberContent}>
                    <LinearGradient
                      colors={colors.gradient as any}
                      style={styles.memberAvatar}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Text style={styles.memberAvatarText}>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </Text>
                    </LinearGradient>
                    <View style={styles.memberInfo}>
                      <Text style={[styles.memberName, { color: colors.text }]}>
                        {member.name}
                      </Text>
                      <View style={styles.memberStats}>
                        <View style={styles.memberStat}>
                          <Users size={14} color={colors.primary} strokeWidth={2} />
                          <Text style={[styles.memberStatText, { color: colors.textSecondary }]}>
                            {(member.followers / 1000).toFixed(1)}K
                          </Text>
                        </View>
                        <Text style={[styles.memberDot, { color: colors.textSecondary }]}>•</Text>
                        <View style={styles.memberStat}>
                          <Award size={14} color={colors.warning} strokeWidth={2} />
                          <Text style={[styles.memberStatText, { color: colors.textSecondary }]}>
                            {member.allyScore}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.removeMemberButton}
                      onPress={() => handleRemoveMember(member.id)}
                      activeOpacity={0.8}
                    >
                      <X size={16} color={colors.error} strokeWidth={2} />
                    </TouchableOpacity>
                  </View>
                </BlurView>
              ))}
            </View>
            {members.length < 5 && (
              <TouchableOpacity
                style={styles.addMemberButton}
                activeOpacity={0.7}
                onPress={() => setInviteModalVisible(true)}
              >
                <BlurView
                  intensity={15}
                  tint={activeTheme === 'dark' ? 'dark' : 'light'}
                  style={[styles.addMemberButtonInner, { borderColor: colors.border }]}
                >
                  <UserPlus size={22} color={colors.primary} strokeWidth={2} />
                  <Text style={[styles.addMemberButtonText, { color: colors.primary }]}>Invite Member</Text>
                </BlurView>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
        <Modal
          visible={inviteModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setInviteModalVisible(false)}
        >
          <View style={[styles.modalBackdrop, { backgroundColor: 'rgba(0,0,0,0.4)' }]}>
            <View style={[styles.modalContent, { backgroundColor: colors.surface || '#fff' }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Invite Member</Text>
              <TextInput
                placeholder="Name or handle"
                placeholderTextColor={colors.textSecondary}
                value={inviteName}
                onChangeText={setInviteName}
                style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]}
              />
              <View style={styles.modalActions}>
                <Pressable onPress={() => setInviteModalVisible(false)} style={styles.modalButton}>
                  <Text style={{ color: colors.textSecondary }}>Cancel</Text>
                </Pressable>
                <Pressable onPress={handleInvite} style={styles.modalButton}>
                  <Text style={{ color: colors.primary }}>Send Invite</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
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
  tribeHeader: {
    marginBottom: -8,
  },
  tribeCard: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  tribeCardGradient: {
    padding: 32,
    alignItems: 'center',
    gap: 16,
  },
  tribeName: {
    fontSize: 28,
    fontWeight: '800' as const,
  },
  tribeStatsRow: {
    flexDirection: 'row',
    gap: 32,
    marginTop: 8,
  },
  tribeStat: {
    alignItems: 'center',
    gap: 6,
  },
  tribeStatValue: {
    fontSize: 24,
    fontWeight: '800' as const,
  },
  tribeStatLabel: {
    fontSize: 12,
  },
  section: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800' as const,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700' as const,
  },
  settingsCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  settingInfo: {
    flex: 1,
    gap: 4,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  settingDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  requestsList: {
    gap: 16,
  },
  requestCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 20,
    gap: 16,
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  requestAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestAvatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800' as const,
  },
  requestInfo: {
    flex: 1,
    gap: 4,
  },
  requestName: {
    fontSize: 17,
    fontWeight: '700' as const,
  },
  requestMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  requestMetaText: {
    fontSize: 13,
  },
  requestDot: {
    fontSize: 13,
  },
  requestNiches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  requestNicheTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  requestNicheText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  requestMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
  requestActions: {
    flexDirection: 'row',
    gap: 12,
  },
  requestActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  requestActionText: {
    fontSize: 15,
    fontWeight: '700' as const,
  },
  membersList: {
    gap: 12,
  },
  memberCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  memberContent: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberAvatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800' as const,
  },
  memberInfo: {
    flex: 1,
    gap: 6,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  memberStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  memberStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  memberStatText: {
    fontSize: 13,
  },
  memberDot: {
    fontSize: 13,
  },
  addMemberButton: {
    marginTop: 4,
  },
  addMemberButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  addMemberButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  removeMemberButton: {
    padding: 8,
    borderRadius: 12,
    marginLeft: 8,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800' as const,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
