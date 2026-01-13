import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, Medal, Crown, TrendingUp, Users, MapPin } from 'lucide-react-native';
import React, { useState } from 'react';
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

type LeaderboardCategory = 'niche' | 'followers' | 'location' | 'allyScore';

export default function LeaderboardsScreen() {
  const { colors, activeTheme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<LeaderboardCategory>('niche');

  const categories = [
    { id: 'niche' as const, label: 'By Niche', icon: Trophy },
    { id: 'followers' as const, label: 'By Followers', icon: Users },
    { id: 'location' as const, label: 'By Location', icon: MapPin },
    { id: 'allyScore' as const, label: 'Ally Score', icon: Crown },
  ];

  const { userProfile } = useUser();
  const globalTribe = userProfile?.tribe?.name ?? 'Fitness Warriors';

  const mockLeaderboard = {
    niche: [
      {
        rank: 1,
        tribeName: 'Wellness Warriors',
        category: 'Fitness - Yoga',
        totalFollowers: 234000,
        allyScore: 2450,
        members: 5,
      },
      {
        rank: 2,
        tribeName: 'Zen Masters',
        category: 'Fitness - Yoga',
        totalFollowers: 198000,
        allyScore: 2280,
        members: 4,
      },
      {
        rank: 12,
        tribeName: globalTribe,
        category: 'Fitness - Yoga',
        totalFollowers: 115700,
        allyScore: 2250,
        members: 3,
        isCurrentUser: true,
      },
      {
        rank: 13,
        tribeName: 'Yoga Flow',
        category: 'Fitness - Yoga',
        totalFollowers: 102000,
        allyScore: 2180,
        members: 4,
      },
    ],
    followers: [
      {
        rank: 1,
        tribeName: 'Tech Giants',
        category: 'Tech - AI',
        totalFollowers: 980000,
        allyScore: 2890,
        members: 5,
      },
      {
        rank: 87,
        tribeName: globalTribe,
        category: 'Fitness - Yoga',
        totalFollowers: 115700,
        allyScore: 2250,
        members: 3,
        isCurrentUser: true,
      },
    ],
    location: [
      {
        rank: 1,
        tribeName: 'LA Fitness Crew',
        category: 'Los Angeles',
        totalFollowers: 445000,
        allyScore: 3120,
        members: 5,
      },
      {
        rank: 5,
        tribeName: globalTribe,
        category: 'Los Angeles',
        totalFollowers: 115700,
        allyScore: 2250,
        members: 3,
        isCurrentUser: true,
      },
    ],
    allyScore: [
      {
        rank: 1,
        tribeName: 'Super Supporters',
        category: 'Lifestyle',
        totalFollowers: 156000,
        allyScore: 3450,
        members: 5,
      },
      {
        rank: 34,
        tribeName: globalTribe,
        category: 'Fitness - Yoga',
        totalFollowers: 115700,
        allyScore: 2250,
        members: 3,
        isCurrentUser: true,
      },
    ],
  };

  const currentLeaderboard = mockLeaderboard[selectedCategory];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown size={24} color="#FFD700" />;
    if (rank === 2) return <Medal size={24} color="#C0C0C0" />;
    if (rank === 3) return <Medal size={24} color="#CD7F32" />;
    return null;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.warning, colors.primary, colors.background]}
        locations={[0, 0.3, 0.7]}
        style={styles.gradientBackground}
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Leaderboards
          </Text>
        </View>

        <View style={styles.categoriesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categories}
          >
            {categories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;

              return (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => setSelectedCategory(category.id)}
                  style={[
                    styles.categoryButton,
                    {
                      backgroundColor: isSelected
                        ? colors.primary
                        : colors.card,
                    },
                  ]}
                >
                  <Icon
                    size={20}
                    color={isSelected ? '#ffffff' : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.categoryText,
                      {
                        color: isSelected ? '#ffffff' : colors.textSecondary,
                      },
                    ]}
                  >
                    {category.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {currentLeaderboard.slice(0, 3).map((tribe) => (
              <BlurView
                key={tribe.rank}
                intensity={activeTheme === 'dark' ? 30 : 80}
                tint={activeTheme === 'dark' ? 'dark' : 'light'}
                style={[
                  styles.topRankCard,
                  {
                    backgroundColor: tribe.isCurrentUser
                      ? colors.primary + '30'
                      : colors.cardTransparent,
                  },
                ]}
              >
                <View style={styles.rankSection}>
                  {getRankIcon(tribe.rank) || (
                    <View
                      style={[
                        styles.rankBadge,
                        { backgroundColor: colors.primary },
                      ]}
                    >
                      <Text style={styles.rankNumber}>#{tribe.rank}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.tribeInfo}>
                  <Text style={[styles.tribeName, { color: colors.text }]}>
                    {tribe.tribeName}
                    {tribe.isCurrentUser && (
                      <Text style={[styles.youBadge, { color: colors.primary }]}>
                        {' '}(You)
                      </Text>
                    )}
                  </Text>
                  <Text style={[styles.tribeCategory, { color: colors.textSecondary }]}>
                    {tribe.category}
                  </Text>

                  <View style={styles.tribeStats}>
                    <View style={styles.statItem}>
                      <Users size={14} color={colors.textSecondary} />
                      <Text style={[styles.statText, { color: colors.textSecondary }]}>
                        {(tribe.totalFollowers / 1000).toFixed(1)}K
                      </Text>
                    </View>
                    <View style={styles.statItem}>
                      <Crown size={14} color={colors.warning} />
                      <Text style={[styles.statText, { color: colors.textSecondary }]}>
                        {tribe.allyScore}
                      </Text>
                    </View>
                    <View style={styles.statItem}>
                      <TrendingUp size={14} color={colors.accent} />
                      <Text style={[styles.statText, { color: colors.textSecondary }]}>
                        {tribe.members} members
                      </Text>
                    </View>
                  </View>
                </View>
              </BlurView>
            ))}

            <View style={styles.restOfList}>
              {currentLeaderboard.slice(3).map((tribe) => (
                <BlurView
                  key={tribe.rank}
                  intensity={activeTheme === 'dark' ? 20 : 80}
                  tint={activeTheme === 'dark' ? 'dark' : 'light'}
                  style={[
                    styles.rankCard,
                    {
                      backgroundColor: tribe.isCurrentUser
                        ? colors.primary + '20'
                        : colors.cardTransparent,
                      borderWidth: tribe.isCurrentUser ? 2 : 0,
                      borderColor: tribe.isCurrentUser ? colors.primary : 'transparent',
                    },
                  ]}
                >
                  <View style={styles.rankCardContent}>
                    <View
                      style={[
                        styles.smallRankBadge,
                        { backgroundColor: colors.card },
                      ]}
                    >
                      <Text style={[styles.smallRankNumber, { color: colors.text }]}>
                        #{tribe.rank}
                      </Text>
                    </View>

                    <View style={styles.rankCardInfo}>
                      <Text style={[styles.rankCardName, { color: colors.text }]}>
                        {tribe.tribeName}
                        {tribe.isCurrentUser && (
                          <Text style={[styles.youBadge, { color: colors.primary }]}>
                            {' '}(You)
                          </Text>
                        )}
                      </Text>
                      <View style={styles.rankCardStats}>
                        <Users size={12} color={colors.textSecondary} />
                        <Text style={[styles.rankCardStat, { color: colors.textSecondary }]}>
                          {(tribe.totalFollowers / 1000).toFixed(1)}K
                        </Text>
                        <Crown size={12} color={colors.warning} />
                        <Text style={[styles.rankCardStat, { color: colors.textSecondary }]}>
                          {tribe.allyScore}
                        </Text>
                      </View>
                    </View>
                  </View>
                </BlurView>
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
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 400,
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
  categoriesContainer: {
    marginBottom: 20,
  },
  categories: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  topRankCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    gap: 16,
    overflow: 'hidden',
  },
  rankSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNumber: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#ffffff',
  },
  tribeInfo: {
    flex: 1,
  },
  tribeName: {
    fontSize: 18,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  youBadge: {
    fontWeight: '700' as const,
  },
  tribeCategory: {
    fontSize: 14,
    marginBottom: 12,
  },
  tribeStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  restOfList: {
    gap: 12,
  },
  rankCard: {
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
  },
  rankCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  smallRankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallRankNumber: {
    fontSize: 14,
    fontWeight: '700' as const,
  },
  rankCardInfo: {
    flex: 1,
  },
  rankCardName: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  rankCardStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rankCardStat: {
    fontSize: 12,
  },
});
