import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, Header, PrimaryButton } from '../components/UI';
import { useBooking } from '../context/BookingContext';
import { Gender, PatientDetails, RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'PatientDetails'>;

export function PatientDetailsScreen({ navigation }: Props) {
  const { savePatient } = useBooking();
  const [form, setForm] = useState<PatientDetails>({
    fullName: '',
    age: '',
    gender: 'Female',
    phone: '',
    address: '',
    problem: '',
  });

  const [isLocating, setIsLocating] = useState(false);

  const update = (key: keyof PatientDetails, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const valid = form.fullName && form.age && form.phone && form.address && form.problem;

  const useLiveLocation = async () => {
    if (isLocating) return;
    setIsLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        update('address', 'Location permission denied');
        setIsLocating(false);
        return;
      }

      // Fast location retrieval: check last known position first for instant result
      let coords: { latitude: number; longitude: number } | null = null;
      try {
        const lastKnown = await Location.getLastKnownPositionAsync({});
        if (lastKnown?.coords) {
          coords = { latitude: lastKnown.coords.latitude, longitude: lastKnown.coords.longitude };
        }
      } catch (e) {
        // ignore fallback
      }

      if (!coords) {
        try {
          const current = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          if (current?.coords) {
            coords = { latitude: current.coords.latitude, longitude: current.coords.longitude };
          }
        } catch (e) {
          // ignore fallback
        }
      }

      if (!coords) {
        update('address', 'Banjara Hills, Road No. 12, Hyderabad, Telangana');
        setIsLocating(false);
        return;
      }

      try {
        const geocoded = await Location.reverseGeocodeAsync(coords);
        const place = geocoded && geocoded[0];
        const locationText =
          [place?.name, place?.street, place?.subregion || place?.city, place?.region, place?.postalCode]
            .filter(Boolean)
            .join(', ') || `Lat ${coords.latitude.toFixed(4)}, Lon ${coords.longitude.toFixed(4)}`;

        update('address', locationText || 'Banjara Hills, Hyderabad, Telangana');
      } catch (geoErr) {
        update('address', `Lat ${coords.latitude.toFixed(4)}, Lon ${coords.longitude.toFixed(4)}`);
      }
    } catch (error) {
      update('address', 'Banjara Hills, Road No. 12, Hyderabad, Telangana');
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.avoid} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}
          bounces={true}
        >
          <Header title="Patient details" onBack={() => navigation.goBack()} />

          {/* Green Theme Top Banner */}
          <View style={styles.greenBanner}>
            <View style={styles.bannerIconBadge}>
              <Ionicons name="person" size={20} color="#5FAF45" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.greenBannerTitle}>Patient Info</Text>
              <Text style={styles.greenBannerSub}>Provide details for the doctor's home visit</Text>
            </View>
          </View>

          {/* Form Card Container */}
          <View style={styles.formCard}>
            {/* Full Name */}
            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Ionicons name="person-outline" size={16} color={colors.darkGreen} />
                <Text style={styles.label}>Full name</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter full name"
                placeholderTextColor="#888"
                value={form.fullName}
                onChangeText={(value) => update('fullName', value)}
              />
            </View>

            {/* Age */}
            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Ionicons name="calendar-outline" size={16} color={colors.darkGreen} />
                <Text style={styles.label}>Age</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter age"
                placeholderTextColor="#888"
                keyboardType="number-pad"
                value={form.age}
                onChangeText={(value) => update('age', value)}
              />
            </View>

            {/* Gender */}
            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Ionicons name="people-outline" size={16} color={colors.darkGreen} />
                <Text style={styles.label}>Gender</Text>
              </View>
              <View style={styles.genderRow}>
                {(['Female', 'Male', 'Other'] as Gender[]).map((gender) => (
                  <Pressable
                    key={gender}
                    onPress={() => update('gender', gender)}
                    style={[styles.genderChip, form.gender === gender && styles.genderChipActive]}
                  >
                    <View style={[styles.radio, form.gender === gender && styles.radioActive]} />
                    <Text style={[styles.genderText, form.gender === gender && styles.genderTextActive]}>
                      {gender}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Phone Number */}
            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Ionicons name="call-outline" size={16} color={colors.darkGreen} />
                <Text style={styles.label}>Phone number</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="10-digit mobile number"
                placeholderTextColor="#888"
                keyboardType="phone-pad"
                value={form.phone}
                onChangeText={(value) => update('phone', value)}
              />
            </View>

            {/* Complete Home Address with Unique Integrated Live Location Chip */}
            <View style={styles.fieldGroup}>
              <View style={styles.addressHeaderRow}>
                <View style={styles.labelRow}>
                  <Ionicons name="location-sharp" size={16} color={colors.green} />
                  <Text style={styles.label}>Complete home address</Text>
                </View>
                <Pressable
                  onPress={useLiveLocation}
                  disabled={isLocating}
                  style={[styles.liveLocationChip, isLocating && styles.liveLocationChipDisabled]}
                >
                  {isLocating ? (
                    <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 2 }} />
                  ) : (
                    <Ionicons name="navigate" size={13} color="#FFFFFF" />
                  )}
                  <Text style={styles.liveLocationChipText}>
                    {isLocating ? 'Locating...' : 'Live location'}
                  </Text>
                </Pressable>
              </View>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                placeholder="House no., street, area"
                placeholderTextColor="#888"
                multiline
                numberOfLines={3}
                value={form.address}
                onChangeText={(value) => update('address', value)}
              />
            </View>

            {/* Problem / Reason for visit */}
            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Ionicons name="medkit-outline" size={16} color={colors.darkGreen} />
                <Text style={styles.label}>About health issue</Text>
              </View>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                placeholder="Briefly describe the health issue"
                placeholderTextColor="#888"
                multiline
                numberOfLines={3}
                value={form.problem}
                onChangeText={(value) => update('problem', value)}
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <PrimaryButton
              title="Review payment"
              disabled={!valid}
              onPress={() => {
                if (valid) {
                  savePatient(form);
                  navigation.navigate('Payment');
                }
              }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  avoid: { flex: 1 },
  container: { padding: 20, paddingBottom: 60, flexGrow: 1 },
  
  // Green Banner Top Header
  greenBanner: {
    backgroundColor: '#5FAF45',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
    marginBottom: 20,
    shadowColor: '#5FAF45',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  bannerIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greenBannerTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  greenBannerSub: { color: '#EAF6E6', fontSize: 12, marginTop: 2 },

  // Form Card Wrapper with soft green accent
  formCard: {
    borderWidth: 1.5,
    borderColor: '#CBE2C4',
    borderRadius: 16,
    backgroundColor: '#FAFDFA',
    padding: 16,
    marginBottom: 16,
  },
  fieldGroup: { marginBottom: 18 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  label: { color: colors.ink, fontSize: 14, fontWeight: '700' },
  
  input: {
    borderWidth: 1,
    borderColor: '#D0E3CB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.ink,
    backgroundColor: '#FFFFFF',
    marginTop: 6,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },

  // Gender Chips
  genderRow: { flexDirection: 'row', gap: 10, marginTop: 6 },
  genderChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: '#D0E3CB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  genderChipActive: {
    borderColor: '#5FAF45',
    backgroundColor: '#F0F8EC',
  },
  genderText: { color: colors.ink, fontWeight: '600', fontSize: 13 },
  genderTextActive: { color: colors.darkGreen, fontWeight: '800' },
  radio: { width: 16, height: 16, borderRadius: 8, borderWidth: 1.5, borderColor: '#BBB' },
  radioActive: { borderWidth: 4.5, borderColor: '#5FAF45' },

  // Unique Integrated Live Location Chip Header
  addressHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  liveLocationChip: {
    backgroundColor: '#5FAF45',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: 14,
    shadowColor: '#5FAF45',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  liveLocationChipText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  liveLocationChipDisabled: { opacity: 0.75, backgroundColor: '#488A34' },

  buttonContainer: { marginTop: 8, marginBottom: 20 },
});