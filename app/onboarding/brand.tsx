import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowRight, CheckCircle2 } from 'lucide-react-native';
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

import Colors from '@/constants/colors';
import { NICHES, FOLLOWER_BRACKETS } from '@/constants/data';
import { useUser } from '@/contexts/UserContext';

const BUDGET_BRACKETS = ['$1K-$5K', '$5K-$20K', '$20K-$50K', '$50K+'];
const CAMPAIGN_GOALS = ['Brand Awareness', 'Product Launch', 'Content Creation', 'Sales Conversion'];

export default function BrandOnboardingScreen() {
  const router = useRouter();
  const { setUserType, setPreferences, getTribeRecommendations } = useUser();
  const [step, setStep] = useState(1);
  
  const [targetIndustry, setTargetIndustry] = useState<string | null>(null);
  const [budgetBracket, setBudgetBracket] = useState<string | null>(null);
  const [creatorSize, setCreatorSize] = useState<string | null>(null);
  const [campaignGoal, setCampaignGoal] = useState<string | null>(null);

  const handleComplete = async () => {
    const prefs = {
      industry: targetIndustry,
      budget: budgetBracket,
      creatorSize,
      campaignGoal,
    };
    if (setPreferences) await setPreferences(prefs);
    await setUserType('brand');
    router.replace('/(brand-tabs)/search');
  };

  const [recommendations, setRecommendations] = useState<any[] | null>(null);
  const previewRecommendations = () => {
    if (getTribeRecommendations) {
      const recs = getTribeRecommendations({ topK: 5 });
      setRecommendations(recs);
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What Industry Are You In?</Text>
      <Text style={styles.stepDescription}>
        We will match you with creators in relevant niches
      </Text>

      <View style={styles.optionsGrid}>
        {Object.keys(NICHES).map((industry) => (
          <TouchableOpacity
            key={industry}
            activeOpacity={0.7}
            onPress={() => setTargetIndustry(industry)}
          >
            <BlurView
              intensity={targetIndustry === industry ? 30 : 15}
              tint="dark"
              style={[
                styles.optionCard,
                targetIndustry === industry && styles.optionCardSelected,
              ]}
            >
              <Text style={styles.optionText}>{industry}</Text>
              {targetIndustry === industry && (
                <CheckCircle2 size={20} color={Colors.accent} strokeWidth={2.5} />
              )}
            </BlurView>
          </TouchableOpacity>
        ))}
      </View>

      {targetIndustry && (
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => setStep(2)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[Colors.accent, Colors.accentDark]}
            style={styles.nextButtonGradient}
          >
            <Text style={styles.nextButtonText}>Continue</Text>
            <ArrowRight size={20} color={Colors.text} strokeWidth={2.5} />
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Campaign Budget Range</Text>
      <Text style={styles.stepDescription}>
        This helps us suggest appropriate creator tiers
      </Text>

      <View style={styles.optionsList}>
        {BUDGET_BRACKETS.map((budget) => (
          <TouchableOpacity
            key={budget}
            activeOpacity={0.7}
            onPress={() => setBudgetBracket(budget)}
          >
            <BlurView
              intensity={budgetBracket === budget ? 30 : 15}
              tint="dark"
              style={[
                styles.optionCardWide,
                budgetBracket === budget && styles.optionCardSelected,
              ]}
            >
              <Text style={styles.optionText}>{budget}</Text>
              {budgetBracket === budget && (
                <CheckCircle2 size={20} color={Colors.accent} strokeWidth={2.5} />
              )}
            </BlurView>
          </TouchableOpacity>
        ))}
      </View>

      {budgetBracket && (
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => setStep(3)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[Colors.accent, Colors.accentDark]}
            style={styles.nextButtonGradient}
          >
            <Text style={styles.nextButtonText}>Continue</Text>
            <ArrowRight size={20} color={Colors.text} strokeWidth={2.5} />
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Target Creator Size</Text>
      <Text style={styles.stepDescription}>
        What size creators are you looking to work with?
      </Text>

      <View style={styles.optionsList}>
        {FOLLOWER_BRACKETS.map((bracket) => (
          <TouchableOpacity
            key={bracket.value}
            activeOpacity={0.7}
            onPress={() => setCreatorSize(bracket.value)}
          >
            <BlurView
              intensity={creatorSize === bracket.value ? 30 : 15}
              tint="dark"
              style={[
                styles.optionCardWide,
                creatorSize === bracket.value && styles.optionCardSelected,
              ]}
            >
              <Text style={styles.optionText}>{bracket.label}</Text>
              {creatorSize === bracket.value && (
                <CheckCircle2 size={20} color={Colors.accent} strokeWidth={2.5} />
              )}
            </BlurView>
          </TouchableOpacity>
        ))}
      </View>

      {creatorSize && (
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => setStep(4)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[Colors.accent, Colors.accentDark]}
            style={styles.nextButtonGradient}
          >
            <Text style={styles.nextButtonText}>Continue</Text>
            <ArrowRight size={20} color={Colors.text} strokeWidth={2.5} />
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Primary Campaign Goal</Text>
      <Text style={styles.stepDescription}>
        What do you want to achieve with creator partnerships?
      </Text>

      <View style={styles.optionsList}>
        {CAMPAIGN_GOALS.map((goal) => (
          <TouchableOpacity
            key={goal}
            activeOpacity={0.7}
            onPress={() => setCampaignGoal(goal)}
          >
            <BlurView
              intensity={campaignGoal === goal ? 30 : 15}
              tint="dark"
              style={[
                styles.optionCardWide,
                campaignGoal === goal && styles.optionCardSelected,
              ]}
            >
              <Text style={styles.optionText}>{goal}</Text>
              {campaignGoal === goal && (
                <CheckCircle2 size={20} color={Colors.accent} strokeWidth={2.5} />
              )}
            </BlurView>
          </TouchableOpacity>
        ))}
      </View>

      {campaignGoal && (
        <>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={previewRecommendations}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Colors.surfaceLight, Colors.surfaceLight]}
              style={styles.nextButtonGradient}
            >
              <Text style={[styles.nextButtonText, { color: Colors.textSecondary }]}>Preview Recommendations</Text>
              <ArrowRight size={20} color={Colors.textSecondary} strokeWidth={2.5} />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleComplete}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Colors.accent, Colors.accentDark]}
              style={styles.nextButtonGradient}
            >
              <Text style={styles.nextButtonText}>Complete Setup</Text>
              <CheckCircle2 size={20} color={Colors.text} strokeWidth={2.5} />
            </LinearGradient>
          </TouchableOpacity>

          {recommendations && (
            <View style={{ marginTop: 12 }}>
              <Text style={{ color: Colors.textSecondary, marginBottom: 8 }}>Recommended Tribes</Text>
              {recommendations.map((r: any) => (
                <BlurView key={r.tribe.id} intensity={10} tint="dark" style={[styles.optionCardWide, { marginBottom: 8 }]}> 
                  <Text style={styles.optionText}>{r.tribe.name} — {(r.score * 100).toFixed(0)}%</Text>
                </BlurView>
              ))}
            </View>
          )}
        </>
      )}
    </View>
  );

  return (
    <LinearGradient
      colors={[Colors.background, Colors.accentDark, Colors.background]}
      locations={[0, 0.5, 1]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <View style={styles.progressContainer}>
          {[1, 2, 3, 4].map((s) => (
            <View
              key={s}
              style={[
                styles.progressDot,
                step >= s && styles.progressDotActive,
              ]}
            />
          ))}
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
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
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 20,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.surfaceLight,
  },
  progressDotActive: {
    backgroundColor: Colors.accent,
    width: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  stepContainer: {
    gap: 24,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: Colors.text,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  optionsList: {
    gap: 12,
  },
  optionCard: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  optionCardWide: {
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionCardSelected: {
    borderColor: Colors.accent,
    borderWidth: 2,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  nextButton: {
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  nextButtonGradient: {
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  nextButtonText: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.text,
  },
});
