import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Users, TrendingUp, Zap, MapPin, Filter } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/contexts/ThemeContext';
import { VIBES, POSTING_FREQUENCIES } from '@/constants/data';

export default function DiscoverScreen() {
  const { colors, activeTheme } = useTheme();
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [selectedFrequency, setSelectedFrequency] = useState<string>('');

  const mockCreators = [
    {
      id: '1',
      name: 'Sarah Chen',
      bio: 'Yoga instructor & wellness advocate',
      location: 'Los Angeles, CA',
      followers: 28500,
      vibe: 'authentic',
      vibeEmoji: '✨',
      postingFrequency: '5-7 times per week',
      niches: [
        { category: 'Fitness', subNiche: 'Yoga' },
        { category: 'Lifestyle', subNiche: 'Minimalism' },
      ],
      matchScore: 98,
      isLookingForTribe: true,
      tribeSize: 2,
    },
    {
      id: '2',
      name: 'Mike Rodriguez',
      bio: 'Tech reviewer & gadget enthusiast',
      location: 'San Francisco, CA',
      followers: 42000,
      vibe: 'energetic',
      vibeEmoji: '⚡',
      postingFrequency: '3-4 times per week',
      niches: [
        { category: 'Tech', subNiche: 'Gadget Reviews' },
        { category: 'Gaming', subNiche: 'Streaming' },
      ],
      matchScore: 95,
      isLookingForTribe: true,
      tribeSize: 1,
    },
    {
      id: '3',
      name: 'Emma Watson',
      bio: 'Sustainable fashion advocate',
      location: 'New York, NY',
      followers: 51200,
      vibe: 'inspiring',
      vibeEmoji: '🚀',
      postingFrequency: 'Daily',
      niches: [
        { category: 'Fashion', subNiche: 'Sustainable Fashion' },
        { category: 'Lifestyle', subNiche: 'Minimalism' },
      ],
      matchScore: 92,
      isLookingForTribe: true,
      tribeSize: 2,
    },
  ];

  const toggleVibe = (vibeId: string) => {
    setSelectedVibes(prev =>
      prev.includes(vibeId)
        ? prev.filter(v => v !== vibeId)
        : [...prev, vibeId]
    );
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
            <Text style={[styles.title, { color: colors.text }]}>Discover</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Find your perfect tribe mates
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setFilterVisible(true)}
            activeOpacity={0.7}
          >
            <BlurView
              intensity={30}
              tint={activeTheme === 'dark' ? 'dark' : 'light'}
              style={[styles.filterButton, { borderColor: colors.border }]}
            >
              <Filter size={22} color={colors.text} strokeWidth={2} />
            </BlurView>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {mockCreators.map((creator) => (
            <View key={creator.id} style={styles.creatorCard}>
              <BlurView
                intensity={10}
                tint={activeTheme === 'dark' ? 'dark' : 'light'}
                style={[styles.cardBlur, { borderColor: colors.border }]}
              >
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                  <View style={styles.matchScoreBadge}>
                    <LinearGradient
                      colors={colors.gradient as any}
                      style={styles.matchScoreGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Heart size={14} color="#FFFFFF" strokeWidth={2.5} fill="#FFFFFF" />
                      <Text style={styles.matchScoreText}>{creator.matchScore}% Match</Text>
                    </LinearGradient>
                  </View>

                  <View style={styles.cardHeader}>
                    <LinearGradient
                      colors={colors.gradient as any}
                      style={styles.avatar}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Text style={styles.avatarText}>
                        {creator.name.split(' ').map(n => n[0]).join('')}
                      </Text>
                    </LinearGradient>
                    <View style={styles.cardHeaderInfo}>
                      <Text style={[styles.creatorName, { color: colors.text }]}>
                        {creator.name}
                      </Text>
                      <View style={styles.vibeContainer}>
                        <Text style={styles.vibeEmoji}>{creator.vibeEmoji}</Text>
                        <Text style={[styles.vibeText, { color: colors.textSecondary }]}>
                          {creator.vibe.charAt(0).toUpperCase() + creator.vibe.slice(1)} vibe
                        </Text>
                      </View>
                    </View>
                  </View>

                  <Text style={[styles.creatorBio, { color: colors.textSecondary }]}>
                    {creator.bio}
                  </Text>

                  <View style={styles.locationRow}>
                    <MapPin size={14} color={colors.textSecondary} strokeWidth={2} />
                    <Text style={[styles.locationText, { color: colors.textSecondary }]}>
                      {creator.location}
                    </Text>
                  </View>

                  <View style={styles.nichesRow}>
                    {creator.niches.map((niche, idx) => (
                      <View
                        key={idx}
                        style={[styles.nicheTag, { backgroundColor: colors.surfaceLight }]}
                      >
                        <Text style={[styles.nicheTagText, { color: colors.text }]}>
                          {niche.subNiche}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.statsRow}>
                    <View style={styles.stat}>
                      <Users size={16} color={colors.primary} strokeWidth={2} />
                      <Text style={[styles.statValue, { color: colors.text }]}>
                        {(creator.followers / 1000).toFixed(1)}K
                      </Text>
                    </View>
                    <View style={styles.stat}>
                      <TrendingUp size={16} color={colors.success} strokeWidth={2} />
                      <Text style={[styles.statValue, { color: colors.text }]}>
                        {creator.postingFrequency}
                      </Text>
                    </View>
                  </View>

                  {creator.tribeSize < 3 && (
                    <View style={[styles.tribeStatusBadge, { backgroundColor: colors.surfaceLight }]}>
                      <Users size={14} color={colors.warning} strokeWidth={2} />
                      <Text style={[styles.tribeStatusText, { color: colors.text }]}>
                        Tribe needs {3 - creator.tribeSize} more member{3 - creator.tribeSize > 1 ? 's' : ''}
                      </Text>
                    </View>
                  )}

                  <TouchableOpacity
                    style={styles.connectButton}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={colors.gradient as any}
                      style={styles.connectButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Zap size={18} color="#FFFFFF" strokeWidth={2.5} />
                      <Text style={styles.connectButtonText}>Send Request</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </BlurView>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>

      <Modal
        visible={filterVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <SafeAreaView edges={['bottom']}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Filters</Text>
                <TouchableOpacity onPress={() => setFilterVisible(false)}>
                  <Text style={[styles.modalDone, { color: colors.primary }]}>Done</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.modalScroll}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.filterSection}>
                  <Text style={[styles.filterSectionTitle, { color: colors.text }]}>
                    Vibe
                  </Text>
                  <View style={styles.vibesGrid}>
                    {VIBES.map((vibe) => {
                      const isSelected = selectedVibes.includes(vibe.id);
                      return (
                        <TouchableOpacity
                          key={vibe.id}
                          onPress={() => toggleVibe(vibe.id)}
                          activeOpacity={0.7}
                          style={[
                            styles.vibeChip,
                            {
                              backgroundColor: isSelected ? colors.primary : colors.surfaceLight,
                            },
                          ]}
                        >
                          <Text style={styles.vibeChipEmoji}>{vibe.emoji}</Text>
                          <Text
                            style={[
                              styles.vibeChipText,
                              { color: isSelected ? '#FFFFFF' : colors.text },
                            ]}
                          >
                            {vibe.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                <View style={styles.filterSection}>
                  <Text style={[styles.filterSectionTitle, { color: colors.text }]}>
                    Posting Frequency
                  </Text>
                  <View style={styles.frequencyList}>
                    {POSTING_FREQUENCIES.map((freq) => {
                      const isSelected = selectedFrequency === freq;
                      return (
                        <TouchableOpacity
                          key={freq}
                          onPress={() => setSelectedFrequency(isSelected ? '' : freq)}
                          activeOpacity={0.7}
                          style={[
                            styles.frequencyChip,
                            {
                              backgroundColor: isSelected ? colors.primary : colors.surfaceLight,
                              borderColor: isSelected ? colors.primary : colors.border,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.frequencyChipText,
                              { color: isSelected ? '#FFFFFF' : colors.text },
                            ]}
                          >
                            {freq}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </ScrollView>
            </SafeAreaView>
          </View>
        </View>
      </Modal>
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
  filterButton: {
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
    gap: 20,
  },
  creatorCard: {
    borderRadius: 24,
  },
  cardBlur: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
  },
  card: {
    padding: 20,
    gap: 16,
  },
  matchScoreBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    borderRadius: 20,
    overflow: 'hidden',
    zIndex: 1,
  },
  matchScoreGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  matchScoreText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700' as const,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800' as const,
  },
  cardHeaderInfo: {
    flex: 1,
    gap: 6,
  },
  creatorName: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  vibeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  vibeEmoji: {
    fontSize: 14,
  },
  vibeText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  creatorBio: {
    fontSize: 14,
    lineHeight: 20,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 13,
  },
  nichesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  nicheTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  nicheTagText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 20,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  tribeStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  tribeStatusText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  connectButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  connectButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  connectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700' as const,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800' as const,
  },
  modalDone: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  modalScroll: {
    paddingHorizontal: 24,
  },
  filterSection: {
    marginBottom: 32,
  },
  filterSectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    marginBottom: 16,
  },
  vibesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  vibeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
  },
  vibeChipEmoji: {
    fontSize: 16,
  },
  vibeChipText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  frequencyList: {
    gap: 10,
  },
  frequencyChip: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  frequencyChipText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
});
