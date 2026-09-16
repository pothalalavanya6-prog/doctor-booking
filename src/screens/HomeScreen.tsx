import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../components/UI';
import { healthIssues } from '../mockData';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const specialists = [
  'Cardiologist',
  'Gynecologist',
  'General Physician',
  'Psychiatrist',
  'Orthopedist',
  'Dermatologist',
  'Neurologist',
  'Dentist',
  'Ophthalmologist',
];

const issueTheme: Record<string, { iconColor: string; cardBg: string; borderColor: string; tag: string }> = {
  fever: { iconColor: '#E53E3E', cardBg: '#FFF5F5', borderColor: '#FECDD3', tag: 'Fever & Care' },
  checkup: { iconColor: '#2563EB', cardBg: '#F0F9FF', borderColor: '#BAE6FD', tag: 'Full Checkup' },
  pediatric: { iconColor: '#7C3AED', cardBg: '#FAF5FF', borderColor: '#E9D5FF', tag: 'Kids Health' },
  elderly: { iconColor: '#0D9488', cardBg: '#F0FDFA', borderColor: '#99F6E4', tag: 'Senior Care' },
  diabetes: { iconColor: '#EA580C', cardBg: '#FFF7ED', borderColor: '#FED7AA', tag: 'Sugar Control' },
  skin: { iconColor: '#DB2777', cardBg: '#FDF2F8', borderColor: '#FBCFE8', tag: 'Dermatology' },
};

const specialistData: Record<string, { icon: string; iconColor: string; bgColor: string; tag: string }> = {
  Cardiologist: {
    icon: 'heart-outline',
    iconColor: '#E53E3E',
    bgColor: '#FFF5F5',
    tag: 'Heart & Vascular Care',
  },
  Gynecologist: {
    icon: 'woman-outline',
    iconColor: '#D53F8C',
    bgColor: '#FFF5F7',
    tag: "Women's Health & Wellness",
  },
  'General Physician': {
    icon: 'medkit-outline',
    iconColor: '#2563EB',
    bgColor: '#F0F9FF',
    tag: 'Primary & Family Healthcare',
  },
  Psychiatrist: {
    icon: 'fitness-outline',
    iconColor: '#7C3AED',
    bgColor: '#FAF5FF',
    tag: 'Mental Health & Mind Care',
  },
  Orthopedist: {
    icon: 'body-outline',
    iconColor: '#EA580C',
    bgColor: '#FFF7ED',
    tag: 'Bone, Joint & Muscle Care',
  },
  Dermatologist: {
    icon: 'sparkles-outline',
    iconColor: '#DB2777',
    bgColor: '#FDF2F8',
    tag: 'Skin, Hair & Aesthetics',
  },
  Neurologist: {
    icon: 'pulse-outline',
    iconColor: '#0D9488',
    bgColor: '#F0FDFA',
    tag: 'Brain & Nervous System',
  },
  Dentist: {
    icon: 'happy-outline',
    iconColor: '#0284C7',
    bgColor: '#F0F9FF',
    tag: 'Dental & Oral Surgery',
  },
  Ophthalmologist: {
    icon: 'eye-outline',
    iconColor: '#16A34A',
    bgColor: '#F0FDF4',
    tag: 'Eye & Vision Treatment',
  },
};

export function HomeScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Clean Home Visits Title */}
        <View style={styles.titleOnlyContainer}>
          <Text style={styles.appTitle}>
            <Text style={styles.titleHome}>Home </Text>
            <Text style={styles.titleVisits}>Visits</Text>
          </Text>
          <View style={styles.headerTagline}>
            <Ionicons name="sparkles" size={12} color="#5FAF45" />
            <Text style={styles.headerTaglineText}>Doctor at your doorstep</Text>
          </View>
        </View>

        {/* Compact Hero Banner */}
        <View style={styles.banner}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerKicker}>PERSONALIZED CARE</Text>
            <Text style={styles.bannerText}>A better way to feel better.</Text>
          </View>
          <View style={styles.bannerIconBadge}>
            <Ionicons name="home" size={26} color="#FFFFFF" />
          </View>
        </View>

        {/* Compact & Stylish Search Bar */}
        <View style={styles.search}>
          <Ionicons name="search" size={18} color="#5FAF45" style={{ marginRight: 6 }} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search health issue or specialist..."
            placeholderTextColor="#888888"
            style={styles.searchInput}
            returnKeyType="search"
            onSubmitEditing={() => navigation.navigate('Doctors', { query })}
          />
        </View>

        {/* Most common visits section */}
        <View style={styles.sectionGroup}>
          <View style={styles.headingBadge}>
            <Text style={styles.headingTitle}>Most common visits</Text>
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            contentContainerStyle={styles.posterScrollContainer}
          >
            {healthIssues.map((issue) => {
              const theme = issueTheme[issue.id] || {
                iconColor: '#3D7C2A',
                cardBg: '#F0F7ED',
                borderColor: '#CBE2C4',
                tag: 'Home Visit',
              };
              return (
                <Pressable
                  key={issue.id}
                  onPress={() => navigation.navigate('Doctors', { issueId: issue.id })}
                  style={[styles.posterCard, { backgroundColor: theme.cardBg, borderColor: theme.borderColor }]}
                >
                  <View style={styles.posterIconBadge}>
                    <Ionicons name={issue.icon as keyof typeof Ionicons.glyphMap} size={24} color={theme.iconColor} />
                  </View>
                  <Text style={styles.posterText}>{issue.name}</Text>
                  <View style={styles.posterTag}>
                    <Text style={styles.posterTagText}>{theme.tag}</Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Popular specialists section (Line-by-Line with Medical Badges) */}
        <View style={styles.sectionGroup}>
          <View style={styles.headingBadge}>
            <Text style={styles.headingTitle}>Popular specialists</Text>
          </View>
          
          <View style={styles.specialistList}>
            {specialists.map((specialist) => {
              const data = specialistData[specialist] || {
                icon: 'person-outline',
                iconColor: '#3D7C2A',
                bgColor: '#F0F7ED',
                tag: 'Medical Specialist',
              };
              return (
                <Pressable
                  key={specialist}
                  onPress={() => navigation.navigate('Doctors', { query: specialist })}
                  style={styles.specialistRowCard}
                >
                  <View style={[styles.specialistIconBadge, { backgroundColor: data.bgColor }]}>
                    <Ionicons name={data.icon as keyof typeof Ionicons.glyphMap} size={18} color={data.iconColor} />
                  </View>
                  <View style={styles.specialistInfo}>
                    <Text style={styles.specialistName}>{specialist}</Text>
                    <Text style={styles.specialistTag}>{data.tag}</Text>
                  </View>
                  <View style={styles.specialistArrowBadge}>
                    <Ionicons name="chevron-forward" size={15} color="#5FAF45" />
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  container: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 28 },
  
  // Clean Title Only
  titleOnlyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 2,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  titleHome: {
    color: '#000000',
  },
  titleVisits: {
    color: '#5FAF45',
  },
  headerTagline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0F7ED',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  headerTaglineText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5FAF45',
  },

  banner: {
    backgroundColor: '#F0F7ED',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerKicker: { fontSize: 10, color: colors.green, fontWeight: '800', letterSpacing: 0.8 },
  bannerText: { color: colors.ink, fontSize: 18, fontWeight: '800', lineHeight: 22, marginTop: 2 },
  bannerIconBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#5FAF45',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5FAF45',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },

  // Compact Search Bar
  search: {
    height: 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginTop: 10,
    marginBottom: 14,
  },
  searchInput: { flex: 1, fontSize: 13.5, color: colors.ink, paddingVertical: 0 },
  searchFilterBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EBF7E7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Compact Section Spacing
  sectionGroup: { marginBottom: 14 },
  headingBadge: {
    backgroundColor: '#5FAF45',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  headingTitle: { fontSize: 14, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.2 },
  
  posterScrollContainer: { paddingVertical: 2, paddingRight: 6, gap: 10 },
  posterCard: {
    width: 120,
    height: 135,
    borderRadius: 16,
    borderWidth: 1.2,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  posterIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  posterText: { color: '#000000', fontWeight: '800', fontSize: 12, textAlign: 'center', lineHeight: 15 },
  posterTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  posterTagText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#444444',
  },

  // Popular Specialists Vertical Line-Wise List with Images
  specialistList: {
    gap: 8,
  },
  specialistRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1.5,
  },
  specialistImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  specialistIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  specialistInfo: {
    flex: 1,
  },
  specialistName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#000000',
  },
  specialistTag: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666666',
    marginTop: 1,
  },
  specialistArrowBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F2F9EF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});