import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { 
  Users, 
  TrendingUp, 
  MapPin, 
  Instagram, 
  Youtube, 
  Facebook,
  Filter,
  X,
  Star,
  Zap,
  Search
} from 'lucide-react-native';
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { NICHES, FOLLOWER_BRACKETS } from '@/constants/data';
import { CreatorProfile } from '@/types';

const MOCK_CREATORS: CreatorProfile[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    bio: 'Fitness & wellness creator | Yoga enthusiast',
    location: 'Los Angeles, CA',
    niches: [
      { category: 'Fitness', subNiche: 'Yoga' },
      { category: 'Lifestyle', subNiche: 'Minimalism' }
    ],
    postingFrequency: '5-7 times per week',
    openToIRL: true,
    followerCount: 45000,
    followerGrowth: 12.5,
    engagementRate: 4.8,
    allyScore: 85,
    vibe: 'authentic',
    platformsBadges: {
      instagram: true,
      tiktok: false,
      youtube: true,
      facebook: false,
    },
    tribe: {
      id: 't1',
      name: 'Wellness Warriors',
      memberCount: 4,
      isMatchingOpen: false,
    },
    isLookingForTribe: false,
  },
  {
    id: '2',
    name: 'Marcus Chen',
    bio: 'Tech reviews & AI commentary',
    location: 'San Francisco, CA',
    niches: [
      { category: 'Tech', subNiche: 'Gadget Reviews' },
      { category: 'Tech', subNiche: 'AI & Machine Learning' }
    ],
    postingFrequency: '3-4 times per week',
    openToIRL: true,
    followerCount: 120000,
    followerGrowth: 18.2,
    engagementRate: 6.2,
    allyScore: 92,
    vibe: 'professional',
    platformsBadges: {
      instagram: true,
      tiktok: true,
      youtube: true,
      facebook: false,
    },
    tribe: {
      id: 't2',
      name: 'Tech Innovators',
      memberCount: 5,
      isMatchingOpen: false,
    },
    isLookingForTribe: false,
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    bio: 'Sustainable fashion advocate',
    location: 'New York, NY',
    niches: [
      { category: 'Fashion', subNiche: 'Sustainable Fashion' },
      { category: 'Lifestyle', subNiche: 'DIY & Crafts' }
    ],
    postingFrequency: 'Daily',
    openToIRL: true,
    followerCount: 78000,
    followerGrowth: 15.8,
    engagementRate: 5.4,
    allyScore: 88,
    vibe: 'inspiring',
    platformsBadges: {
      instagram: true,
      tiktok: true,
      youtube: false,
      facebook: true,
    },
    isLookingForTribe: true,
  },
  {
    id: '4',
    name: 'David Park',
    bio: 'Food & recipe creator | Vegan chef',
    location: 'Seattle, WA',
    niches: [
      { category: 'Food', subNiche: 'Vegan' },
      { category: 'Food', subNiche: 'Meal Prep' }
    ],
    postingFrequency: '5-7 times per week',
    openToIRL: false,
    followerCount: 32000,
    followerGrowth: 9.4,
    engagementRate: 7.1,
    allyScore: 76,
    vibe: 'creative',
    platformsBadges: {
      instagram: true,
      tiktok: true,
      youtube: false,
      facebook: false,
    },
    tribe: {
      id: 't3',
      name: 'Plant Power Crew',
      memberCount: 3,
      isMatchingOpen: true,
    },
    isLookingForTribe: false,
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    bio: 'Business coach & entrepreneur',
    location: 'Austin, TX',
    niches: [
      { category: 'Business', subNiche: 'Entrepreneurship' },
      { category: 'Business', subNiche: 'Marketing' }
    ],
    postingFrequency: '3-4 times per week',
    openToIRL: true,
    followerCount: 156000,
    followerGrowth: 22.1,
    engagementRate: 4.2,
    allyScore: 94,
    vibe: 'professional',
    platformsBadges: {
      instagram: true,
      tiktok: false,
      youtube: true,
      facebook: true,
    },
    tribe: {
      id: 't4',
      name: 'Business Builders',
      memberCount: 6,
      isMatchingOpen: false,
    },
    isLookingForTribe: false,
  },
];

export default function BrandSearchScreen() {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [selectedFollowerBrackets, setSelectedFollowerBrackets] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [savedCreators, setSavedCreators] = useState<Set<string>>(new Set());

  const filteredCreators = useMemo(() => {
    return MOCK_CREATORS.filter(creator => {
      const matchesSearch = searchQuery === '' || 
        creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.niches.some(n => 
          n.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.subNiche.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesNiche = selectedNiches.length === 0 ||
        creator.niches.some(n => selectedNiches.includes(n.category));

      const matchesFollowers = selectedFollowerBrackets.length === 0 ||
        selectedFollowerBrackets.some(bracket => {
          const followers = creator.followerCount;
          switch (bracket) {
            case 'nano': return followers >= 1000 && followers < 10000;
            case 'micro': return followers >= 10000 && followers < 50000;
            case 'mid': return followers >= 50000 && followers < 500000;
            case 'macro': return followers >= 500000;
            default: return true;
          }
        });

      const matchesLocation = !selectedLocation || 
        creator.location.toLowerCase().includes(selectedLocation.toLowerCase());

      return matchesSearch && matchesNiche && matchesFollowers && matchesLocation;
    });
  }, [searchQuery, selectedNiches, selectedFollowerBrackets, selectedLocation]);

  const toggleSave = (creatorId: string) => {
    setSavedCreators(prev => {
      const newSet = new Set(prev);
      if (newSet.has(creatorId)) {
        newSet.delete(creatorId);
      } else {
        newSet.add(creatorId);
      }
      return newSet;
    });
  };

  const toggleNiche = (niche: string) => {
    setSelectedNiches(prev => 
      prev.includes(niche) 
        ? prev.filter(n => n !== niche)
        : [...prev, niche]
    );
  };

  const toggleFollowerBracket = (bracket: string) => {
    setSelectedFollowerBrackets(prev => 
      prev.includes(bracket)
        ? prev.filter(b => b !== bracket)
        : [...prev, bracket]
    );
  };

  const clearFilters = () => {
    setSelectedNiches([]);
    setSelectedFollowerBrackets([]);
    setSelectedLocation(null);
  };

  const activeFilterCount = selectedNiches.length + selectedFollowerBrackets.length + (selectedLocation ? 1 : 0);

  return (
    <LinearGradient
      colors={[colors.background, colors.background]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Discover Creators
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Find the perfect creators for your brand
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <BlurView intensity={20} tint="dark" style={styles.searchBar}>
            <Search size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search creators, niches..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </BlurView>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowFilters(true)}
          >
            <BlurView intensity={20} tint="dark" style={styles.filterButton}>
              <Filter size={20} color={colors.text} />
              {activeFilterCount > 0 && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
                </View>
              )}
            </BlurView>
          </TouchableOpacity>
        </View>

        {activeFilterCount > 0 && (
          <View style={styles.activeFiltersContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.activeFiltersContent}
            >
              {selectedNiches.map(niche => (
                <TouchableOpacity
                  key={niche}
                  activeOpacity={0.7}
                  onPress={() => toggleNiche(niche)}
                >
                  <BlurView intensity={20} tint="dark" style={styles.activeFilterChip}>
                    <Text style={[styles.activeFilterText, { color: colors.text }]}>
                      {niche}
                    </Text>
                    <X size={14} color={colors.text} />
                  </BlurView>
                </TouchableOpacity>
              ))}
              {selectedFollowerBrackets.map(bracket => {
                const label = FOLLOWER_BRACKETS.find(b => b.value === bracket)?.label;
                return (
                  <TouchableOpacity
                    key={bracket}
                    activeOpacity={0.7}
                    onPress={() => toggleFollowerBracket(bracket)}
                  >
                    <BlurView intensity={20} tint="dark" style={styles.activeFilterChip}>
                      <Text style={[styles.activeFilterText, { color: colors.text }]}>
                        {label}
                      </Text>
                      <X size={14} color={colors.text} />
                    </BlurView>
                  </TouchableOpacity>
                );
              })}
              <TouchableOpacity activeOpacity={0.7} onPress={clearFilters}>
                <Text style={[styles.clearFiltersText, { color: colors.primary }]}>
                  Clear All
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}

        <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>
          {filteredCreators.length} creator{filteredCreators.length !== 1 ? 's' : ''} found
        </Text>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredCreators.map(creator => (
            <TouchableOpacity key={creator.id} activeOpacity={0.9}>
              <BlurView intensity={15} tint="dark" style={styles.creatorCard}>
                <View style={styles.creatorHeader}>
                  <View style={styles.creatorAvatar}>
                    <Users size={32} color={colors.primary} />
                  </View>
                  <View style={styles.creatorInfo}>
                    <Text style={[styles.creatorName, { color: colors.text }]}>
                      {creator.name}
                    </Text>
                    <Text style={[styles.creatorBio, { color: colors.textSecondary }]} numberOfLines={1}>
                      {creator.bio}
                    </Text>
                    <View style={styles.creatorLocation}>
                      <MapPin size={12} color={colors.textSecondary} />
                      <Text style={[styles.creatorLocationText, { color: colors.textSecondary }]}>
                        {creator.location}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => toggleSave(creator.id)}
                    style={styles.saveButton}
                  >
                    <Star
                      size={20}
                      color={savedCreators.has(creator.id) ? Colors.accent : colors.textSecondary}
                      fill={savedCreators.has(creator.id) ? Colors.accent : 'transparent'}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.platformBadges}>
                  {creator.platformsBadges.instagram && (
                    <View style={[styles.platformBadge, { backgroundColor: colors.surfaceLight }]}>
                      <Instagram size={14} color="#E4405F" />
                    </View>
                  )}
                  {creator.platformsBadges.youtube && (
                    <View style={[styles.platformBadge, { backgroundColor: colors.surfaceLight }]}>
                      <Youtube size={14} color="#FF0000" />
                    </View>
                  )}
                  {creator.platformsBadges.facebook && (
                    <View style={[styles.platformBadge, { backgroundColor: colors.surfaceLight }]}>
                      <Facebook size={14} color="#1877F2" />
                    </View>
                  )}
                </View>

                <View style={styles.nichesContainer}>
                  {creator.niches.map((niche, idx) => (
                    <View key={idx} style={[styles.nicheTag, { backgroundColor: colors.surfaceLight }]}>
                      <Text style={[styles.nicheText, { color: colors.text }]}>
                        {niche.category} • {niche.subNiche}
                      </Text>
                    </View>
                  ))}
                </View>

                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Users size={16} color={colors.primary} />
                    <Text style={[styles.statValue, { color: colors.text }]}>
                      {creator.followerCount >= 1000 
                        ? `${(creator.followerCount / 1000).toFixed(1)}K`
                        : creator.followerCount}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                      Followers
                    </Text>
                  </View>

                  <View style={styles.statDivider} />

                  <View style={styles.statItem}>
                    <TrendingUp size={16} color={Colors.success} />
                    <Text style={[styles.statValue, { color: colors.text }]}>
                      {creator.followerGrowth}%
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                      Growth
                    </Text>
                  </View>

                  <View style={styles.statDivider} />

                  <View style={styles.statItem}>
                    <Zap size={16} color={Colors.warning} />
                    <Text style={[styles.statValue, { color: colors.text }]}>
                      {creator.engagementRate}%
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                      Engagement
                    </Text>
                  </View>

                  <View style={styles.statDivider} />

                  <View style={styles.statItem}>
                    <Star size={16} color={Colors.accent} />
                    <Text style={[styles.statValue, { color: colors.text }]}>
                      {creator.allyScore}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                      Ally Score
                    </Text>
                  </View>
                </View>

                {creator.tribe && (
                  <View style={[styles.tribeInfo, { backgroundColor: colors.surfaceLight }]}>
                    <Users size={14} color={colors.primary} />
                    <Text style={[styles.tribeInfoText, { color: colors.text }]}>
                      Part of {creator.tribe.name} ({creator.tribe.memberCount} members)
                    </Text>
                  </View>
                )}

                <TouchableOpacity style={styles.contactButton} activeOpacity={0.8}>
                  <LinearGradient
                    colors={[Colors.accent, Colors.accentDark]}
                    style={styles.contactButtonGradient}
                  >
                    <Text style={styles.contactButtonText}>Request Collaboration</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </BlurView>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>

      <Modal
        visible={showFilters}
        animationType="slide"
        transparent
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <BlurView intensity={40} tint="dark" style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Filters</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <Text style={[styles.filterSectionTitle, { color: colors.text }]}>Niches</Text>
              <View style={styles.filterOptions}>
                {Object.keys(NICHES).map(niche => (
                  <TouchableOpacity
                    key={niche}
                    activeOpacity={0.7}
                    onPress={() => toggleNiche(niche)}
                  >
                    <View style={[
                      styles.filterOption,
                      { backgroundColor: colors.surfaceLight },
                      selectedNiches.includes(niche) && styles.filterOptionSelected
                    ]}>
                      <Text style={[
                        styles.filterOptionText,
                        { color: colors.text },
                        selectedNiches.includes(niche) && styles.filterOptionTextSelected
                      ]}>
                        {niche}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.filterSectionTitle, { color: colors.text }]}>Follower Count</Text>
              <View style={styles.filterOptions}>
                {FOLLOWER_BRACKETS.map(bracket => (
                  <TouchableOpacity
                    key={bracket.value}
                    activeOpacity={0.7}
                    onPress={() => toggleFollowerBracket(bracket.value)}
                  >
                    <View style={[
                      styles.filterOption,
                      { backgroundColor: colors.surfaceLight },
                      selectedFollowerBrackets.includes(bracket.value) && styles.filterOptionSelected
                    ]}>
                      <Text style={[
                        styles.filterOptionText,
                        { color: colors.text },
                        selectedFollowerBrackets.includes(bracket.value) && styles.filterOptionTextSelected
                      ]}>
                        {bracket.label}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => setShowFilters(false)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[Colors.accent, Colors.accentDark]}
                  style={styles.applyButtonGradient}
                >
                  <Text style={styles.applyButtonText}>Apply Filters</Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800' as const,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    fontWeight: '400' as const,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500' as const,
  },
  filterButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  filterBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.accent,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: Colors.text,
    fontSize: 10,
    fontWeight: '700' as const,
  },
  activeFiltersContainer: {
    paddingVertical: 12,
  },
  activeFiltersContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  activeFilterText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  clearFiltersText: {
    fontSize: 13,
    fontWeight: '600' as const,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  resultsCount: {
    paddingHorizontal: 20,
    fontSize: 13,
    fontWeight: '500' as const,
    marginBottom: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  creatorCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  creatorHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  creatorAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  creatorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  creatorName: {
    fontSize: 18,
    fontWeight: '700' as const,
    marginBottom: 2,
  },
  creatorBio: {
    fontSize: 14,
    marginBottom: 6,
  },
  creatorLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  creatorLocationText: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  saveButton: {
    padding: 8,
  },
  platformBadges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  platformBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nichesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  nicheTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  nicheText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500' as const,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.border,
  },
  tribeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
  tribeInfoText: {
    fontSize: 13,
    fontWeight: '600' as const,
    flex: 1,
  },
  contactButton: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  contactButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactButtonText: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '80%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800' as const,
  },
  modalScroll: {
    flex: 1,
    padding: 20,
  },
  filterSectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    marginBottom: 12,
    marginTop: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterOptionSelected: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  filterOptionText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  filterOptionTextSelected: {
    color: Colors.text,
  },
  applyButton: {
    marginTop: 12,
    marginBottom: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  applyButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.text,
  },
});
