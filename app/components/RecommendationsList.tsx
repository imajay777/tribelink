import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Award } from 'lucide-react-native';

type Rec = { tribe: any; score: number; breakdown?: Record<string, number> };

export default function RecommendationsList({ recommendations, onSave, onView }: { recommendations: Rec[]; onSave?: (t: any) => void; onView?: (t: any) => void; }) {
  const { colors } = useTheme();

  return (
    <View style={{ marginTop: 12 }}>
      {recommendations.map((r) => (
        <View key={r.tribe.id} style={[styles.row, { borderColor: colors.border }]}> 
          <View style={styles.meta}>
            <Text style={[styles.title, { color: colors.text }]}>{r.tribe.name}</Text>
            <View style={styles.scoreRow}>
              <Award size={14} color={colors.warning} />
              <Text style={[styles.scoreText, { color: colors.textSecondary }]}>{Math.round(r.score * 100)}%</Text>
            </View>
            <Text style={[styles.desc, { color: colors.textSecondary }]} numberOfLines={2}>{r.tribe.attributes?.activity || ''} • {r.tribe.attributes?.focus || ''}</Text>
          </View>

          <View style={styles.actions}>
            {onView && (
              <TouchableOpacity onPress={() => onView?.(r.tribe)} style={[styles.button, { borderColor: colors.border }]}> 
                <Text style={{ color: colors.primary }}>View</Text>
              </TouchableOpacity>
            )}
            {onSave && (
              <TouchableOpacity onPress={() => onSave?.(r.tribe)} style={[styles.button, { borderColor: colors.border, marginTop: 8 }]}> 
                <Text style={{ color: colors.primary }}>Save</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 8, alignItems: 'center' },
  meta: { flex: 1 },
  title: { fontSize: 16, fontWeight: '700' },
  desc: { fontSize: 13, marginTop: 6 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  scoreText: { fontSize: 13 },
  actions: { marginLeft: 12, alignItems: 'flex-end' },
  button: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
});
