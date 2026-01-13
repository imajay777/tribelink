import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Users, Building2, Sparkles } from 'lucide-react-native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';

import { useTheme } from '@/contexts/ThemeContext';

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors, activeTheme } = useTheme();

  return (
    <LinearGradient
      colors={[colors.background, colors.primaryDark, colors.background]}
      locations={[0, 0.5, 1]}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Sparkles size={48} color={colors.accent} strokeWidth={2.5} />
          <Text style={[styles.title, { color: colors.text }]}>TribeLink</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Where Creators Unite & Brands Connect</Text>
        </View>

        <View style={styles.cardContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/onboarding/creator')}
          >
            <BlurView intensity={20} tint={activeTheme === 'dark' ? 'dark' : 'light'} style={[styles.card, { borderColor: colors.border }]}>
              <View style={styles.cardGradient}>
                <LinearGradient
                  colors={['rgba(193, 53, 132, 0.3)', 'rgba(193, 53, 132, 0.05)']}
                  style={styles.cardInner}
                >
                  <Users size={56} color={colors.primary} strokeWidth={2} />
                  <Text style={[styles.cardTitle, { color: colors.text }]}>I&apos;m a Creator</Text>
                  <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
                    Join tribes, collaborate with creators, and get discovered by brands
                  </Text>
                </LinearGradient>
              </View>
            </BlurView>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/onboarding/brand')}
          >
            <BlurView intensity={20} tint={activeTheme === 'dark' ? 'dark' : 'light'} style={[styles.card, { borderColor: colors.border }]}>
              <View style={styles.cardGradient}>
                <LinearGradient
                  colors={['rgba(253, 29, 29, 0.3)', 'rgba(253, 29, 29, 0.05)']}
                  style={styles.cardInner}
                >
                  <Building2 size={56} color={colors.accent} strokeWidth={2} />
                  <Text style={[styles.cardTitle, { color: colors.text }]}>I&apos;m a Brand</Text>
                  <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
                    Discover high-performing creator tribes for your campaigns
                  </Text>
                </LinearGradient>
              </View>
            </BlurView>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 42,
    fontWeight: '800' as const,
    marginTop: 16,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  cardContainer: {
    gap: 24,
  },
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
  },
  cardGradient: {
    overflow: 'hidden',
    borderRadius: 24,
  },
  cardInner: {
    padding: 32,
    alignItems: 'center',
    minHeight: 240,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    marginTop: 20,
    marginBottom: 12,
  },
  cardDescription: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
});
