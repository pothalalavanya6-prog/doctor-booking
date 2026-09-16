import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, Header } from '../components/UI';
import { useBooking } from '../context/BookingContext';
import { doctors, healthIssues } from '../mockData';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Doctors'>;

export function DoctorsScreen({ navigation, route }: Props) {
  const { chooseDoctor } = useBooking();
  const issue = healthIssues.find((item) => item.id === route.params?.issueId);
  const query = route.params?.query?.toLowerCase() ?? '';
  const searchedIssue = healthIssues.find(
    (item) => item.name.toLowerCase() === query || item.name.toLowerCase().includes(query)
  );

  const results = doctors
    .filter((doctor) => {
      if (issue) return doctor.issueIds.includes(issue.id);
      if (!query) return true;
      return (
        doctor.name.toLowerCase().includes(query) ||
        doctor.specialty.toLowerCase().includes(query) ||
        Boolean(searchedIssue && doctor.issueIds.includes(searchedIssue.id))
      );
    })
    .sort((a, b) => b.rating - a.rating);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Header title="Find your doctor" onBack={() => navigation.goBack()} />
        <Text style={styles.heading}>
          {issue ? issue.name : query ? `Results for “${route.params?.query}”` : 'Top rated doctors'}
        </Text>
        <Text style={styles.sub}>{results.length} doctors available for a home visit</Text>

        {results.map((doctor) => (
          <View style={styles.card} key={doctor.id}>
            <View style={styles.row}>
              <View style={styles.avatar}>
                {doctor.avatar ? (
                  <Image source={{ uri: doctor.avatar }} style={styles.avatarImage} />
                ) : (
                  <Text style={styles.initials}>{doctor.initials}</Text>
                )}
              </View>
              <View style={styles.identity}>
                <Text style={styles.name}>{doctor.name}</Text>
                <Text style={styles.specialty}>{doctor.specialty}</Text>
                <View style={styles.hospitalRow}>
                  <Ionicons name="medical-outline" size={13} color={colors.green} />
                  <Text style={styles.hospitalText}>{doctor.hospital}</Text>
                </View>
                <View style={styles.location}>
                  <Ionicons name="location-outline" size={13} color={colors.muted} />
                  <Text style={styles.muted}>{doctor.location}</Text>
                </View>
                <View style={styles.rating}>
                  <Ionicons name="star" size={14} color="#E7A829" />
                  <Text style={styles.ratingText}>{doctor.rating}</Text>
                  <Text style={styles.dot}>·</Text>
                  <Text style={styles.muted}>{doctor.experience} yrs exp.</Text>
                </View>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.bottom}>
              <Text style={styles.fee}>
                ₹{doctor.fee}
                <Text style={styles.per}> / visit</Text>
              </Text>
              <Pressable
                style={styles.select}
                onPress={() => {
                  chooseDoctor(doctor);
                  navigation.navigate('Availability', { doctorId: doctor.id });
                }}
              >
                <Text style={styles.selectText}>Book consult</Text>
                <Ionicons name="arrow-forward" size={16} color={colors.white} />
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  container: { padding: 18, paddingBottom: 28 },
  heading: { fontSize: 24, fontWeight: '800', color: colors.ink, marginTop: 8 },
  sub: { color: colors.muted, marginTop: 4, marginBottom: 14 },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#FAFDFA',
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    backgroundColor: colors.soft,
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#CBE2C4',
  },
  avatarImage: { width: 60, height: 60, borderRadius: 30 },
  initials: { color: colors.darkGreen, fontWeight: '800', fontSize: 18 },
  identity: { marginLeft: 12, flex: 1 },
  name: { fontSize: 16, fontWeight: '800', color: colors.ink },
  specialty: { color: colors.muted, fontSize: 12, marginTop: 1 },
  hospitalRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  hospitalText: { color: colors.darkGreen, fontWeight: '700', fontSize: 12 },
  location: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  ratingText: { fontWeight: '800', color: colors.ink, fontSize: 12 },
  dot: { color: '#BBB' },
  muted: { color: colors.muted, fontSize: 11 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 10 },
  bottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fee: { fontWeight: '800', fontSize: 16, color: colors.ink },
  per: { color: colors.muted, fontSize: 11, fontWeight: '400' },
  select: {
    backgroundColor: colors.green,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  selectText: { color: colors.white, fontWeight: '700', fontSize: 12 },
});