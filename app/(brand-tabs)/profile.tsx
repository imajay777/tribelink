import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { 
  Building2, 
  LogOut, 
  Moon, 
  Sun,
  ChevronRight,
  DollarSign,
  Target,
  Users,
  Settings
} from 'lucide-react-native';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import Colors from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';

export default function BrandProfileScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { setUserType } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await setUserType(null);
            router.replace('/');
          },
        },
      ]
    );
  };

  return (
    <LinearGradient
      colors={[colors.background, colors.background]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Brand Profile
          </Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <BlurView intensity={15} tint="dark" style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Building2 size={40} color={colors.primary} />
            </View>
            <Text style={[styles.brandName, { color: colors.text }]}>
              Demo Brand
            </Text>
            <Text style={[styles.brandIndustry, { color: colors.textSecondary }]}>
              Fashion Industry
            </Text>
          </BlurView>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Campaign Preferences
          </Text>

          <BlurView intensity={15} tint="dark" style={styles.settingsCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <DollarSign size={20} color={colors.primary} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  Budget Range
                </Text>
              </View>
              <View style={styles.settingRight}>
                <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
                  $5K-$20K
                </Text>
                <ChevronRight size={20} color={colors.textSecondary} />
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Users size={20} color={colors.primary} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  Target Creator Size
                </Text>
              </View>
              <View style={styles.settingRight}>
                <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
                  Micro (10K-50K)
                </Text>
                <ChevronRight size={20} color={colors.textSecondary} />
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Target size={20} color={colors.primary} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  Primary Goal
                </Text>
              </View>
              <View style={styles.settingRight}>
                <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
                  Brand Awareness
                </Text>
                <ChevronRight size={20} color={colors.textSecondary} />
              </View>
            </View>
          </BlurView>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Settings
          </Text>

          <BlurView intensity={15} tint="dark" style={styles.settingsCard}>
            <TouchableOpacity
              style={styles.settingItem}
              activeOpacity={0.7}
              onPress={toggleTheme}
            >
              <View style={styles.settingLeft}>
                {isDark ? (
                  <Moon size={20} color={colors.primary} />
                ) : (
                  <Sun size={20} color={colors.primary} />
                )}
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  Appearance
                </Text>
              </View>
              <View style={styles.settingRight}>
                <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
                  {isDark ? 'Dark' : 'Light'}
                </Text>
                <ChevronRight size={20} color={colors.textSecondary} />
              </View>
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <TouchableOpacity
              style={styles.settingItem}
              activeOpacity={0.7}
              onPress={() => router.push('/settings')}
            >
              <View style={styles.settingLeft}>
                <Settings size={20} color={colors.primary} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  Account Settings
                </Text>
              </View>
              <ChevronRight size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </BlurView>

          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.8}
            onPress={handleLogout}
          >
            <BlurView intensity={15} tint="dark" style={styles.logoutButtonContent}>
              <LogOut size={20} color={Colors.error} />
              <Text style={[styles.logoutButtonText, { color: Colors.error }]}>
                Sign Out
              </Text>
            </BlurView>
          </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800' as const,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  profileCard: {
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
    overflow: 'hidden',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  brandName: {
    fontSize: 24,
    fontWeight: '800' as const,
    marginBottom: 4,
  },
  brandIndustry: {
    fontSize: 15,
    fontWeight: '500' as const,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  settingsCard: {
    borderRadius: 20,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  logoutButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
  },
  logoutButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
});
