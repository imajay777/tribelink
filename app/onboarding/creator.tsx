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
  Switch,
  Alert,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { NICHES, POSTING_FREQUENCIES, VIBES, NicheCategory } from '@/constants/data';
import { useUser } from '@/contexts/UserContext';
import RecommendationsList from '@/app/components/RecommendationsList';

export default function CreatorOnboardingScreen() {
  const router = useRouter();
  const { setUserType, setPreferences, getTribeRecommendations } = useUser();
  const [step, setStep] = useState(1);
  
  const [selectedNiches, setSelectedNiches] = useState<{ category: NicheCategory; subNiche: string }[]>([]);
  const [currentCategory, setCurrentCategory] = useState<NicheCategory | null>(null);
  const [currentSubNiche, setCurrentSubNiche] = useState<string | null>(null);
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const [postingFrequency, setPostingFrequency] = useState<string | null>(null);
  const [openToIRL, setOpenToIRL] = useState(false);
  const [recommendations, setRecommendations] = useState<any[] | null>(null);

  const removeNiche = (index: number) => {
    setSelectedNiches(selectedNiches.filter((_, i) => i !== index));
  };

  const handleComplete = async () => {
    const prefs = {
      niches: selectedNiches,
      vibe: selectedVibe,
      postingFrequency,
      openToIRL,
    };
    if (setPreferences) await setPreferences(prefs);
    await setUserType('creator');
    router.replace('/(tabs)/home');
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Choose Your Niches</Text>
      <Text style={styles.stepDescription}>
        Select up to 3 niches that best describe your content
      </Text>

      {selectedNiches.length > 0 && (
        <View style={styles.selectedNichesContainer}>
          {selectedNiches.map((niche, index) => (
            <BlurView key={index} intensity={20} tint="dark" style={styles.selectedNicheChip}>
              <Text style={styles.selectedNicheText}>{niche.category} - {niche.subNiche}</Text>
              <TouchableOpacity onPress={() => removeNiche(index)}>
                <Text style={styles.removeNicheText}>✕</Text>
              </TouchableOpacity>
            </BlurView>
          ))}
        </View>
      )}

      {selectedNiches.length < 3 && (
        <>
          <View style={styles.optionsGrid}>
            {Object.keys(NICHES).map((category) => (
              <TouchableOpacity
                key={category}
                activeOpacity={0.7}
                onPress={() => {
                  setCurrentCategory(category as NicheCategory);
                  setCurrentSubNiche(null);
                }}
              >
                <BlurView
                  intensity={currentCategory === category ? 30 : 15}
                  tint="dark"
                  style={[
                    styles.optionCard,
                    currentCategory === category && styles.optionCardSelected,
                  ]}
                >
                  <Text style={styles.optionText}>{category}</Text>
                  {currentCategory === category && (
                    <CheckCircle2 size={20} color={Colors.primary} strokeWidth={2.5} />
                  )}
                </BlurView>
              </TouchableOpacity>
            ))}
          </View>

          {currentCategory && (
            <View style={styles.subNichesContainer}>
              <Text style={styles.subNichesTitle}>Select sub-niche:</Text>
              <View style={styles.optionsGrid}>
                {NICHES[currentCategory].map((subNiche) => (
                  <TouchableOpacity
                    key={subNiche}
                    activeOpacity={0.7}
                    onPress={() => {
                      setCurrentSubNiche(subNiche);
                      setTimeout(() => {
                        if (currentCategory && subNiche) {
                          setSelectedNiches([...selectedNiches, { category: currentCategory, subNiche }]);
                          setCurrentCategory(null);
                          setCurrentSubNiche(null);
                        }
                      }, 100);
                    }}
                  >
                    <BlurView
                      intensity={currentSubNiche === subNiche ? 30 : 15}
                      tint="dark"
                      style={[
                        styles.optionCard,
                        currentSubNiche === subNiche && styles.optionCardSelected,
                      ]}
                    >
                      <Text style={styles.optionText}>{subNiche}</Text>
                    </BlurView>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </>
      )}

      {selectedNiches.length > 0 && (
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => setStep(2)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
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
      <Text style={styles.stepTitle}>What&apos;s Your Vibe?</Text>
      <Text style={styles.stepDescription}>
        Choose the vibe that best matches your content style
      </Text>

      <View style={styles.vibesGrid}>
        {VIBES.map((vibe) => (
          <TouchableOpacity
            key={vibe.id}
            activeOpacity={0.7}
            onPress={() => setSelectedVibe(vibe.id)}
          >
            <BlurView
              intensity={selectedVibe === vibe.id ? 30 : 15}
              tint="dark"
              style={[
                styles.vibeCard,
                selectedVibe === vibe.id && styles.optionCardSelected,
              ]}
            >
              <Text style={styles.vibeEmoji}>{vibe.emoji}</Text>
              <Text style={styles.vibeLabel}>{vibe.label}</Text>
              {selectedVibe === vibe.id && (
                <CheckCircle2 size={20} color={Colors.primary} strokeWidth={2.5} />
              )}
            </BlurView>
          </TouchableOpacity>
        ))}
      </View>

      {selectedVibe && (
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => setStep(3)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
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
      <Text style={styles.stepTitle}>How Often Do You Post?</Text>
      <Text style={styles.stepDescription}>
        This helps us match you with creators at similar activity levels
      </Text>

      <View style={styles.optionsList}>
        {POSTING_FREQUENCIES.map((frequency) => (
          <TouchableOpacity
            key={frequency}
            activeOpacity={0.7}
            onPress={() => setPostingFrequency(frequency)}
          >
            <BlurView
              intensity={postingFrequency === frequency ? 30 : 15}
              tint="dark"
              style={[
                styles.optionCardWide,
                postingFrequency === frequency && styles.optionCardSelected,
              ]}
            >
              <Text style={styles.optionText}>{frequency}</Text>
              {postingFrequency === frequency && (
                <CheckCircle2 size={20} color={Colors.primary} strokeWidth={2.5} />
              )}
            </BlurView>
          </TouchableOpacity>
        ))}
      </View>

      <BlurView intensity={15} tint="dark" style={styles.switchCard}>
        <View style={styles.switchContent}>
          <View style={styles.switchTextContainer}>
            <Text style={styles.switchLabel}>Open to IRL Collaborations?</Text>
            <Text style={styles.switchDescription}>
              Meet up with nearby creators for content shoots
            </Text>
          </View>
          <Switch
            value={openToIRL}
            onValueChange={setOpenToIRL}
            trackColor={{ false: Colors.surfaceLight, true: Colors.primary }}
            thumbColor={Colors.text}
          />
        </View>
      </BlurView>

      {postingFrequency && (
        <>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => {
              const recs = getTribeRecommendations ? getTribeRecommendations({ topK: 5 }) : null;
              if (recs) setRecommendations(recs);
            }}
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
              colors={[Colors.primary, Colors.primaryDark]}
              style={styles.nextButtonGradient}
            >
              <Text style={styles.nextButtonText}>Complete Setup</Text>
              <CheckCircle2 size={20} color={Colors.text} strokeWidth={2.5} />
            </LinearGradient>
          </TouchableOpacity>

          {recommendations && (
            <>
              <Text style={{ color: Colors.textSecondary, marginBottom: 8 }}>Recommended Tribes</Text>
              <RecommendationsList
                recommendations={recommendations}
                onSave={async (tribe) => {
                  const existing = userProfile?.savedTribes || [];
                  if (!existing.find((t: any) => t.id === tribe.id)) {
                    const updated = { ...(userProfile || {}), savedTribes: [...existing, tribe] };
                    if (setUserProfile) await setUserProfile(updated);
                  }
                }}
                onView={(tribe) => alert(`${tribe.name} — ${Math.round((recommendations?.find((r: any)=>r.tribe.id===tribe.id)?.score||0)*100)}% match`)}
              />
            </>
          )}
        </>
      )}
    </View>
  );

  return (
    <LinearGradient
      colors={[Colors.background, Colors.primaryDark, Colors.background]}
      locations={[0, 0.5, 1]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <View style={styles.progressContainer}>
          {[1, 2, 3].map((s) => (
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
    backgroundColor: Colors.primary,
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
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  selectedNichesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  selectedNicheChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
    overflow: 'hidden',
  },
  selectedNicheText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  removeNicheText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.error,
  },
  subNichesContainer: {
    gap: 16,
    marginTop: 8,
  },
  subNichesTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  vibesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  vibeCard: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    gap: 8,
    minWidth: 100,
  },
  vibeEmoji: {
    fontSize: 32,
  },
  vibeLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  switchCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    marginTop: 8,
  },
  switchContent: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
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
