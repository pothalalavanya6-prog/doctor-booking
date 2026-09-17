import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookingStepper, colors, Header, PrimaryButton } from '../components/UI';
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

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const update = (key: keyof PatientDetails, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleBlur = (key: keyof PatientDetails) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  // Helper to detect random repeated characters or keyboard mashing (e.g. "asdfghjk", "qwertyuiop", "aaaaaa")
  const isRandomGibberish = (text: string): boolean => {
    const clean = text.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!clean) return true;
    // 5 or more repeated identical characters like "aaaaa" or "11111"
    if (/(.)\1{4,}/.test(clean)) return true;
    // Common keyboard mash row patterns
    const mashPatterns = ['qwerty', 'asdfgh', 'zxcvbn', '123456', 'abcdef', '987654', '00000', '11111', '99999'];
    if (mashPatterns.some((pattern) => clean.includes(pattern))) return true;
    return false;
  };

  // Strict Field validation rules
  const getErrors = () => {
    const errors: Partial<Record<keyof PatientDetails, string>> = {};

    const name = form.fullName.trim();
    const nameRegex = /^[a-zA-Z\s'.]{3,50}$/;
    if (!name) {
      errors.fullName = 'Full name is required';
    } else if (!nameRegex.test(name) || isRandomGibberish(name)) {
      errors.fullName = 'Enter a valid full name with correct spelling (letters only)';
    }

    const ageNum = parseInt(form.age.trim(), 10);
    if (!form.age.trim()) {
      errors.age = 'Age is required';
    } else if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      errors.age = 'Enter a valid age (1 - 120)';
    }

    const cleanPhone = form.phone.replace(/[^0-9]/g, '');
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!form.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(cleanPhone) || /(.)\1{9}/.test(cleanPhone) || cleanPhone === '1234567890') {
      errors.phone = 'Enter a valid 10-digit mobile number starting with 6-9';
    }

    const address = form.address.trim();
    if (!address) {
      errors.address = 'Complete home address is required';
    } else if (address.length < 8 || isRandomGibberish(address)) {
      errors.address = 'Please enter a valid, complete home address';
    }

    const problem = form.problem.trim();
    if (!problem) {
      errors.problem = 'Please describe the health issue';
    } else if (problem.length < 5 || isRandomGibberish(problem)) {
      errors.problem = 'Please provide a clear description of the health issue';
    }

    return errors;
  };

  const errors = getErrors();
  const isValid = Object.keys(errors).length === 0;

  const shouldShowError = (field: keyof PatientDetails) => {
    return Boolean((touched[field] || attemptedSubmit) && errors[field]);
  };

  const handleProceed = () => {
    setAttemptedSubmit(true);
    setTouched({
      fullName: true,
      age: true,
      phone: true,
      address: true,
      problem: true,
    });

    if (isValid) {
      savePatient(form);
      navigation.navigate('Payment');
    }
  };

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
          <BookingStepper currentStep={2} />

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

          {attemptedSubmit && !isValid && (
            <View style={styles.topErrorNotice}>
              <Ionicons name="alert-circle" size={18} color="#D32F2F" />
              <Text style={styles.topErrorText}>
                Please fill all patient details correctly before proceeding.
              </Text>
            </View>
          )}

          {/* Form Card Container */}
          <View style={styles.formCard}>
            {/* Full Name */}
            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Ionicons name="person-outline" size={16} color={colors.darkGreen} />
                <Text style={styles.label}>Full name *</Text>
              </View>
              <TextInput
                style={[styles.input, shouldShowError('fullName') && styles.inputError]}
                placeholder="Enter full name"
                placeholderTextColor="#888"
                value={form.fullName}
                onChangeText={(value) => update('fullName', value.replace(/[^a-zA-Z\s'.]/g, ''))}
                onBlur={() => handleBlur('fullName')}
              />
              {shouldShowError('fullName') && (
                <View style={styles.errorRow}>
                  <Ionicons name="alert-circle-outline" size={14} color="#D32F2F" />
                  <Text style={styles.errorText}>{errors.fullName}</Text>
                </View>
              )}
            </View>

            {/* Age */}
            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Ionicons name="calendar-outline" size={16} color={colors.darkGreen} />
                <Text style={styles.label}>Age *</Text>
              </View>
              <TextInput
                style={[styles.input, shouldShowError('age') && styles.inputError]}
                placeholder="Enter age"
                placeholderTextColor="#888"
                keyboardType="number-pad"
                maxLength={3}
                value={form.age}
                onChangeText={(value) => update('age', value.replace(/[^0-9]/g, ''))}
                onBlur={() => handleBlur('age')}
              />
              {shouldShowError('age') && (
                <View style={styles.errorRow}>
                  <Ionicons name="alert-circle-outline" size={14} color="#D32F2F" />
                  <Text style={styles.errorText}>{errors.age}</Text>
                </View>
              )}
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
                <Text style={styles.label}>Phone number *</Text>
              </View>
              <TextInput
                style={[styles.input, shouldShowError('phone') && styles.inputError]}
                placeholder="10-digit mobile number"
                placeholderTextColor="#888"
                keyboardType="phone-pad"
                maxLength={10}
                value={form.phone}
                onChangeText={(value) => update('phone', value.replace(/[^0-9]/g, ''))}
                onBlur={() => handleBlur('phone')}
              />
              {shouldShowError('phone') && (
                <View style={styles.errorRow}>
                  <Ionicons name="alert-circle-outline" size={14} color="#D32F2F" />
                  <Text style={styles.errorText}>{errors.phone}</Text>
                </View>
              )}
            </View>

            {/* Complete Home Address with Unique Integrated Live Location Chip */}
            <View style={styles.fieldGroup}>
              <View style={styles.addressHeaderRow}>
                <View style={styles.labelRow}>
                  <Ionicons name="location-sharp" size={16} color={colors.green} />
                  <Text style={styles.label}>Complete home address *</Text>
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
                style={[styles.input, styles.multilineInput, shouldShowError('address') && styles.inputError]}
                placeholder="House no., street, area"
                placeholderTextColor="#888"
                multiline
                numberOfLines={3}
                value={form.address}
                onChangeText={(value) => update('address', value)}
                onBlur={() => handleBlur('address')}
              />
              {shouldShowError('address') && (
                <View style={styles.errorRow}>
                  <Ionicons name="alert-circle-outline" size={14} color="#D32F2F" />
                  <Text style={styles.errorText}>{errors.address}</Text>
                </View>
              )}
            </View>

            {/* Problem / Reason for visit */}
            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Ionicons name="medkit-outline" size={16} color={colors.darkGreen} />
                <Text style={styles.label}>About health issue *</Text>
              </View>
              <TextInput
                style={[styles.input, styles.multilineInput, shouldShowError('problem') && styles.inputError]}
                placeholder="Briefly describe the health issue"
                placeholderTextColor="#888"
                multiline
                numberOfLines={3}
                value={form.problem}
                onChangeText={(value) => update('problem', value)}
                onBlur={() => handleBlur('problem')}
              />
              {shouldShowError('problem') && (
                <View style={styles.errorRow}>
                  <Ionicons name="alert-circle-outline" size={14} color="#D32F2F" />
                  <Text style={styles.errorText}>{errors.problem}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <PrimaryButton
              title="Review payment"
              onPress={handleProceed}
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

  // Error Banner & Input Error Styles
  topErrorNotice: {
    backgroundColor: '#FDE8E8',
    borderWidth: 1,
    borderColor: '#F8B4B4',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  topErrorText: {
    color: '#D32F2F',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  inputError: {
    borderColor: '#E53935',
    backgroundColor: '#FFF8F8',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 12,
    fontWeight: '600',
  },

  buttonContainer: { marginTop: 8, marginBottom: 20 },
});