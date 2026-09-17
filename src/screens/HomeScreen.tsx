import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../components/UI';
import { doctors, healthIssues } from '../mockData';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const specialists = [
  'General Physician',
  'Home Nurse Care',
  'Cardiologist',
  'Gynecologist',
  'Elderly Care Nurse',
  'Psychiatrist',
  'Orthopedist',
  'Dermatologist',
  'Neurologist',
  'Dentist',
];

const issueTheme: Record<string, { iconColor: string; cardBg: string; borderColor: string; tag: string }> = {
  fever: { iconColor: '#E53E3E', cardBg: '#FFF5F5', borderColor: '#FECDD3', tag: 'Fever & Care' },
  checkup: { iconColor: '#2563EB', cardBg: '#F0F9FF', borderColor: '#BAE6FD', tag: 'Full Checkup' },
  nursing: { iconColor: '#059669', cardBg: '#ECFDF5', borderColor: '#A7F3D0', tag: 'Nurse Visit' },
  elderly: { iconColor: '#0D9488', cardBg: '#F0FDFA', borderColor: '#99F6E4', tag: 'Senior Care' },
  pediatric: { iconColor: '#7C3AED', cardBg: '#FAF5FF', borderColor: '#E9D5FF', tag: 'Kids Health' },
  injections: { iconColor: '#0284C7', cardBg: '#F0F9FF', borderColor: '#BAE6FD', tag: 'IV & Injections' },
  diabetes: { iconColor: '#EA580C', cardBg: '#FFF7ED', borderColor: '#FED7AA', tag: 'Sugar Control' },
  skin: { iconColor: '#DB2777', cardBg: '#FDF2F8', borderColor: '#FBCFE8', tag: 'Dermatology' },
};

const specialistData: Record<string, { icon: string; iconColor: string; bgColor: string; tag: string }> = {
  'Home Nurse Care': {
    icon: 'bandage-outline',
    iconColor: '#059669',
    bgColor: '#ECFDF5',
    tag: 'Professional Nursing & Injections',
  },
  'Elderly Care Nurse': {
    icon: 'accessibility-outline',
    iconColor: '#0D9488',
    bgColor: '#F0FDFA',
    tag: 'Senior & Post-Op Recovery',
  },
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

const HEALTH_CATEGORIES = [
  {
    id: 'fever',
    name: 'Fever & Flu',
    iconName: 'thermometer-outline',
    description: 'Cold, Cough, Viral & High Temp',
    color: '#E11D48',
    bgColor: '#FFE4E6',
    query: 'fever',
  },
  {
    id: 'nursing',
    name: 'Home Nursing',
    iconName: 'bandage-outline',
    description: 'Professional Nurse & Dressing',
    color: '#059669',
    bgColor: '#D1FAE5',
    query: 'nurse',
  },
  {
    id: 'injections',
    name: 'Injections & IV',
    iconName: 'flask-outline',
    description: 'IV Drip & Injection at Home',
    color: '#0284C7',
    bgColor: '#E0F2FE',
    query: 'injection',
  },
  {
    id: 'elderly',
    name: 'Senior Care',
    iconName: 'accessibility-outline',
    description: 'Elderly Care & Post-Op Recovery',
    color: '#0D9488',
    bgColor: '#CCFBF1',
    query: 'elderly',
  },
  {
    id: 'peds',
    name: 'Child Care',
    iconName: 'happy-outline',
    description: 'Pediatric Care & Vaccination',
    color: '#2563EB',
    bgColor: '#DBEAFE',
    query: 'pediatric',
  },
  {
    id: 'derma',
    name: 'Skin Problems',
    iconName: 'sparkles-outline',
    description: 'Acne, Skin Rash & Allergy',
    color: '#D97706',
    bgColor: '#FEF3C7',
    query: 'skin',
  },
  {
    id: 'cardio',
    name: 'Heart & BP Care',
    iconName: 'heart-outline',
    description: 'Chest Pain & BP Wellness',
    color: '#DC2626',
    bgColor: '#FEE2E2',
    query: 'cardiologist',
  },
  {
    id: 'gastro',
    name: 'Stomach & Gas',
    iconName: 'medkit-outline',
    description: 'Stomach Ache & Acidity Care',
    color: '#EA580C',
    bgColor: '#FFEDD5',
    query: 'general physician',
  },
  {
    id: 'ortho',
    name: 'Bone & Joint Pain',
    iconName: 'body-outline',
    description: 'Joint Pain & Physio Support',
    color: '#475569',
    bgColor: '#F1F5F9',
    query: 'orthopedist',
  },
  {
    id: 'neuro',
    name: 'Migraine & Nerves',
    iconName: 'pulse-outline',
    description: 'Migraine & Nerve Health',
    color: '#6366F1',
    bgColor: '#EEF2FF',
    query: 'neurologist',
  },
  {
    id: 'gynae',
    name: "Women's Health",
    iconName: 'woman-outline',
    description: 'Periods & Women Wellness',
    color: '#BE185D',
    bgColor: '#FCE7F3',
    query: 'gynecologist',
  },
  {
    id: 'anxiety',
    name: 'Anxiety & Stress',
    iconName: 'fitness-outline',
    description: 'Stress & Mental Wellness',
    color: '#7C3AED',
    bgColor: '#F3E8FF',
    query: 'psychiatrist',
  },
];

const serviceCards = [
  {
    id: 'doctor-home-visit',
    title: 'Doctor Visit at Home',
    subtitle: 'General Physician & Specialist consultation at your doorstep',
    badgeText: 'Instant Visit',
    iconName: 'home-outline',
    iconColor: colors.primary,
    iconBgColor: '#F0FDF4',
    accentBorderColor: '#DCFCE7',
    query: 'general physician',
  },
  {
    id: 'home-nursing-care',
    title: 'Home Nursing & Injections',
    subtitle: 'Injections, IV Drip, Wound Dressing & Post-Op Recovery Care',
    badgeText: '24/7 Available',
    iconName: 'bandage-outline',
    iconColor: '#059669',
    iconBgColor: '#ECFDF5',
    accentBorderColor: '#A7F3D0',
    query: 'nurse',
  },
];

export function HomeScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const topDoctors = doctors.slice(0, 6);

  const handleCategoryPress = (catId: string, catQuery: string) => {
    setSelectedCatId((prev) => (prev === catId ? null : catId));
    navigation.navigate('Doctors', { query: catQuery, issueId: catId });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Header Title: One Buddy Home Visits */}
        <View style={styles.titleOnlyContainer}>
          <Text style={styles.appTitle}>
            <Text style={styles.titleBlack}>One </Text>
            <Text style={styles.titleBuddy}>Buddy</Text>
            <Text style={styles.titleBlack}> Home Visits</Text>
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.search}>
          <Ionicons name="search" size={18} color={colors.primary} style={{ marginRight: 8 }} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search symptoms, diseases or doctors..."
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
            returnKeyType="search"
            onSubmitEditing={() => navigation.navigate('Doctors', { query })}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} style={{ padding: 2 }}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </Pressable>
          )}
        </View>

        {/* Common Health Issues section (Horizontal Pills matching user screenshot) */}
        <View style={styles.sectionGroup}>
          <Text style={styles.headingTitle}>Common Health Issues</Text>
          <Text style={styles.subHeadingText}>Tap any issue to filter specialists</Text>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            contentContainerStyle={styles.popularPillsContainer}
          >
            {HEALTH_CATEGORIES.map((cat) => {
              const isSelected = selectedCatId === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => handleCategoryPress(cat.id, cat.query)}
                  style={({ pressed }) => [
                    styles.popularHealthPill,
                    isSelected && styles.popularHealthPillSelected,
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <View
                    style={[
                      styles.popularIconBox,
                      { backgroundColor: isSelected ? colors.primary : cat.bgColor },
                    ]}
                  >
                    <Ionicons
                      name={cat.iconName as keyof typeof Ionicons.glyphMap}
                      size={20}
                      color={isSelected ? '#FFFFFF' : cat.color}
                    />
                  </View>
                  <Text style={[styles.popularTextLabel, isSelected && styles.popularTextLabelSelected]}>
                    {cat.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Featured Specialists Section */}
        <View style={styles.sectionGroup}>
          <View style={styles.sectionHeaderRow}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={styles.headingTitle}>Featured Specialists</Text>
              <Text style={styles.subHeadingText}>Slide left to browse verified specialist doctors ({doctors.length})</Text>
            </View>
            <Pressable onPress={() => navigation.navigate('Doctors', {})}>
              <Text style={styles.seeAllText}>View All &gt;</Text>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            contentContainerStyle={styles.doctorScrollContainer}
          >
            {topDoctors.map((doc) => (
              <Pressable
                key={doc.id}
                style={styles.doctorSlideCard}
                onPress={() => navigation.navigate('Availability', { doctorId: doc.id })}
              >
                <View style={styles.docHeaderRow}>
                  {doc.avatar ? (
                    <Image source={{ uri: doc.avatar }} style={styles.docAvatar} />
                  ) : (
                    <View style={styles.docInitialsBadge}>
                      <Text style={styles.docInitialsText}>{doc.initials}</Text>
                    </View>
                  )}
                  <View style={styles.docHeaderInfo}>
                    <Text style={styles.docName} numberOfLines={1}>{doc.name}</Text>
                    <Text style={styles.docSpecialtyGreen} numberOfLines={1}>{doc.specialty}</Text>
                    <Text style={styles.docHospitalGray} numberOfLines={1}>{doc.hospital}</Text>
                    <View style={styles.ratingBadgeRow}>
                      <View style={styles.ratingBadgeYellow}>
                        <Ionicons name="star" size={11} color="#D97706" />
                        <Text style={styles.ratingBadgeText}>{doc.rating.toFixed(1)}</Text>
                      </View>
                      <View style={styles.expBadgeBlue}>
                        <Text style={styles.expBadgeText}>{doc.experience}y exp</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.docCardDivider} />

                <View style={styles.docFooterRow}>
                  <View>
                    <Text style={styles.feeLabel}>FEE</Text>
                    <Text style={styles.feeValue}>₹{doc.fee}</Text>
                  </View>
                  <View style={styles.bookBtn}>
                    <Text style={styles.bookBtnText}>Book Visit &gt;</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Popular specialists section */}
        <View style={styles.sectionGroup}>
          <Text style={styles.headingTitle}>Popular specialists</Text>
          
          <View style={styles.specialistList}>
            {specialists.map((specialist) => {
              const data = specialistData[specialist] || {
                icon: 'person-outline',
                iconColor: colors.primary,
                bgColor: colors.soft,
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
                    <Ionicons name="chevron-forward" size={15} color={colors.primary} />
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
  
  // Clean Title Header
  titleOnlyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 2,
  },
  appTitle: {
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  titleBlack: {
    color: '#000000',
  },
  titleBuddy: {
    color: colors.primary,
  },

  // Search Bar
  search: {
    height: 46,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginTop: 6,
    marginBottom: 16,
  },
  searchInput: { flex: 1, fontSize: 13.5, color: colors.ink, paddingVertical: 0 },

  // Service Cards (Matching OC-Hospital-1buddy ServiceCard)
  serviceSection: {
    marginBottom: 18,
    gap: 12,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1.5,
  },
  serviceTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  serviceIconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceBadge: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  serviceBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#2E7D32',
  },
  serviceTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  serviceSubtitle: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 10,
  },
  serviceActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  serviceActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  serviceArrowBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Section Headers & Groups
  sectionGroup: { marginBottom: 20 },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headingTitle: { fontSize: 19.5, fontWeight: '800', color: '#000000', letterSpacing: 0.2 },
  subHeadingText: { fontSize: 12.5, color: '#64748B', marginTop: 2, marginBottom: 12 },
  seeAllText: { fontSize: 13, fontWeight: '700', color: colors.primary },

  // Popular Health Issues Pills (Matching User Screenshot)
  popularPillsContainer: { paddingVertical: 4, paddingRight: 6, gap: 10 },
  popularHealthPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1.5,
  },
  popularHealthPillSelected: {
    borderColor: colors.primary,
    backgroundColor: '#F0FDF4',
  },
  popularIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  popularTextLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  popularTextLabelSelected: {
    color: colors.primary,
  },

  // Doctor Slide Cards (Horizontal Scroll)
  doctorScrollContainer: { paddingVertical: 4, paddingRight: 6, gap: 12 },
  doctorSlideCard: {
    width: 250,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  docHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  docAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 10,
    backgroundColor: colors.soft,
  },
  docInitialsBadge: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.soft,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  docInitialsText: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 15,
  },
  docHeaderInfo: {
    flex: 1,
  },
  docName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  docSpecialty: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  docSpecialtyGreen: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 1,
  },
  docHospitalGray: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  ratingBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  ratingBadgeYellow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3,
  },
  ratingBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
  },
  expBadgeBlue: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  expBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0F172A',
    marginLeft: 3,
  },
  expText: {
    fontSize: 11,
    color: '#64748B',
    marginLeft: 4,
  },
  docCardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  docFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  feeLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  feeValue: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
  },
  bookBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  bookBtnText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '700',
  },

  // Popular Specialists List
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
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1.5,
  },
  specialistIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
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
    color: '#64748B',
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
