import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Users, Award, X } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';

export default function MemberDetail() {
  const { colors } = useTheme();
  const { userProfile, setUserProfile } = useUser();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const member = userProfile?.tribe?.members?.find((m: any) => String(m.id) === String(id));

  if (!member) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}> 
        <Text style={[styles.message, { color: colors.text }]}>Member not found.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={{ color: colors.primary }}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleRemove = async () => {
    Alert.alert('Remove Member', `Remove ${member.name} from the tribe?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: async () => {
        const updatedMembers = (userProfile?.tribe?.members || []).filter((m: any) => String(m.id) !== String(id));
        const updated = { ...(userProfile || {}), tribe: { ...(userProfile?.tribe || {}), members: updatedMembers } };
        if (setUserProfile) await setUserProfile(updated);
        router.back();
      } }
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <BlurView intensity={30} tint={colors.background ? 'light' : 'light'} style={[styles.card, { borderColor: colors.border }]}> 
        <View style={styles.header}>
          <Users size={48} color={colors.primary} />
          <Text style={[styles.name, { color: colors.text }]}>{member.name}</Text>
        </View>

        <View style={styles.row}>
          <Award size={20} color={colors.warning} />
          <Text style={[styles.rowText, { color: colors.text }]}>Ally Score: {member.allyScore}</Text>
        </View>
        <View style={styles.row}>
          <Users size={20} color={colors.primary} />
          <Text style={[styles.rowText, { color: colors.text }]}>{member.followers.toLocaleString()} followers</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={[styles.removeButton, { borderColor: colors.border }]} onPress={handleRemove}>
            <X size={18} color={colors.error} />
            <Text style={[styles.removeText, { color: colors.error }]}>Remove Member</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  card: { padding: 20, borderRadius: 16, borderWidth: 1 },
  header: { alignItems: 'center', gap: 12, marginBottom: 12 },
  name: { fontSize: 20, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 6 },
  rowText: { fontSize: 16 },
  actions: { marginTop: 20 },
  removeButton: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 12, borderWidth: 1, justifyContent: 'center' },
  removeText: { fontSize: 16, fontWeight: '600' },
  backButton: { marginTop: 12 },
  message: { fontSize: 16 },
});
