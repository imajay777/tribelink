import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const { userProfile, setTribeName, setUserProfile } = useUser();

  const [tribeName, setTribeNameLocal] = useState(userProfile?.tribe?.name ?? '');
  const [isMatchingOpen, setIsMatchingOpen] = useState(userProfile?.tribe?.isMatchingOpen ?? true);

  useEffect(() => {
    if (userProfile?.tribe) {
      setTribeNameLocal(userProfile.tribe.name ?? '');
      setIsMatchingOpen(userProfile.tribe.isMatchingOpen ?? true);
    }
  }, [userProfile]);

  const save = async () => {
    await setTribeName(tribeName);
    await setUserProfile({ ...(userProfile || {}), tribe: { ...(userProfile?.tribe || {}), name: tribeName, isMatchingOpen } });
  };

  return (
    <LinearGradient colors={[colors.background, colors.background]} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
        </View>

        <View style={styles.content}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Tribe Settings</Text>

          <View style={styles.fieldRow}>
            <Text style={[styles.fieldLabel, { color: colors.text }]}>Tribe Name</Text>
            <TextInput
              value={tribeName}
              onChangeText={setTribeNameLocal}
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              placeholder="Enter tribe name"
              placeholderTextColor={colors.textTertiary}
            />
          </View>

          <View style={styles.fieldRowHorizontal}>
            <Text style={[styles.fieldLabel, { color: colors.text }]}>Open for Matching</Text>
            <Switch value={isMatchingOpen} onValueChange={setIsMatchingOpen} trackColor={{ true: colors.primary, false: colors.card }} />
          </View>

          <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.primary }]} onPress={save}>
            <Text style={[styles.saveText, { color: '#fff' }]}>Save Tribe Settings</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { padding: 20 },
  title: { fontSize: 28, fontWeight: '700' as const },
  content: { padding: 20 },
  item: { fontSize: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  fieldRow: { marginBottom: 16 },
  fieldRowHorizontal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  fieldLabel: { fontSize: 14, marginBottom: 8 },
  input: { padding: 12, borderRadius: 8, borderWidth: 1 },
  saveButton: { padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  saveText: { fontSize: 16, fontWeight: '700' as const },
});
