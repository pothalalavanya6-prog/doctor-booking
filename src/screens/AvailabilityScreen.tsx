import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookingStepper, colors, Header, PrimaryButton } from '../components/UI';
import { useBooking } from '../context/BookingContext';
import { doctors, getDateKey } from '../mockData';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Availability'>;

export function AvailabilityScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { selectedDoctor, chooseSlot } = useBooking();
  const doctor = selectedDoctor ?? doctors.find((item) => item.id === route.params.doctorId)!;
  const [date, setDate] = useState(getDateKey(0));
  const [slotId, setSlotId] = useState<string>();

  const days = [0, 1, 2, 3].map((offset) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return {
      key: getDateKey(offset),
      day: d.toLocaleDateString('en-IN', { weekday: 'short' }),
      date: d.getDate(),
    };
  });

  const selected = doctor.slots[date]?.find((slot) => slot.id === slotId);

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={() => navigation.goBack()} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <View style={{ paddingHorizontal: 16, paddingTop: 2 }}>
          <Header title="Choose a time" onBack={() => navigation.goBack()} />
        </View>
        <BookingStepper currentStep={1} />

        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          <View style={styles.doctor}>
            <View style={styles.avatar}>
              {doctor.avatar ? (
                <Image source={{ uri: doctor.avatar }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.initials}>{doctor.initials}</Text>
              )}
            </View>
            <View>
              <Text style={styles.name}>{doctor.name}</Text>
              <Text style={styles.specialty}>
                {doctor.specialty} · ₹{doctor.fee}
              </Text>
            </View>
          </View>

          <Text style={styles.title}>Select date</Text>
          <View style={styles.days}>
            {days.map((item) => (
              <Pressable
                key={item.key}
                onPress={() => {
                  setDate(item.key);
                  setSlotId(undefined);
                }}
                style={[styles.day, date === item.key && styles.dayActive]}
              >
                <Text style={[styles.dayName, date === item.key && styles.activeText]}>{item.day}</Text>
                <Text style={[styles.dayNumber, date === item.key && styles.activeText]}>{item.date}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.title}>Available slots</Text>
          <View style={styles.slots}>
            {doctor.slots[date]?.map((slot) => (
              <Pressable
                key={slot.id}
                onPress={() => setSlotId(slot.id)}
                style={[styles.slot, slotId === slot.id && styles.slotActive]}
              >
                <Text style={[styles.slotText, slotId === slot.id && styles.activeText]}>{slot.label}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {/* Fixed Sticky Footer for Button */}
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <PrimaryButton
            title="Continue to patient details"
            disabled={!selected}
            onPress={() => {
              if (selected) {
                chooseSlot(date, selected);
                navigation.navigate('PatientDetails');
              }
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0, 0, 0, 0.45)' },
  sheet: {
    maxHeight: '85%',
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#DDD',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  container: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 16 },
  doctor: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.soft, padding: 12, borderRadius: 14, marginTop: 4 },
  avatar: { width: 47, height: 47, borderRadius: 24, backgroundColor: colors.white, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  avatarImage: { width: 47, height: 47, borderRadius: 24 },
  initials: { color: colors.darkGreen, fontWeight: '800' },
  name: { fontWeight: '800', color: colors.ink, fontSize: 16, marginLeft: 12 },
  specialty: { color: colors.muted, marginLeft: 12, marginTop: 4 },
  title: { fontSize: 16, fontWeight: '800', marginTop: 16, marginBottom: 10, color: colors.ink },
  days: { flexDirection: 'row', gap: 9 },
  day: { borderWidth: 1, borderColor: colors.border, borderRadius: 11, paddingVertical: 10, alignItems: 'center', width: 70 },
  dayActive: { backgroundColor: colors.green, borderColor: colors.green },
  dayName: { color: colors.muted, fontSize: 12 },
  dayNumber: { color: colors.ink, fontSize: 18, fontWeight: '800', marginTop: 3 },
  activeText: { color: colors.white },
  slots: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  slot: { borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingVertical: 11, paddingHorizontal: 15 },
  slotActive: { backgroundColor: colors.green, borderColor: colors.green },
  slotText: { color: colors.ink, fontWeight: '700' },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
});