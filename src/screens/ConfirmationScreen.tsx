import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, PrimaryButton } from '../components/UI';
import { useBooking } from '../context/BookingContext';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Confirmation'>;

export function ConfirmationScreen({ navigation }: Props) {
  const { booking, reset } = useBooking();
  if (!booking) return null;

  const isPaid = booking.paymentMode === 'UPI' || booking.paymentMode === 'Card';
  const paymentStatus = isPaid ? 'Paid' : 'Unpaid';

  const date = new Date(`${booking.date}T12:00:00`).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const sendWhatsApp = () => {
    const message = `Home Visit Booking ${booking.id}%0A${booking.doctor.name}%0A${date}, ${booking.slot.label}%0APatient: ${booking.patient.fullName}%0AAddress: ${booking.patient.address}%0APayment: ₹${booking.total} (${paymentStatus})%0ADoctor contact: ${booking.doctor.phone}`;
    Linking.openURL(`whatsapp://send?phone=${booking.patient.phone}&text=${message}`);
  };

  const isNurse = booking.doctor.name.startsWith('Nurse') || booking.doctor.issueIds?.includes('nursing');
  const professionalTitle = isNurse ? 'nurse' : 'doctor';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.success}>
          <View style={styles.check}>
            <Ionicons name="checkmark" size={35} color={colors.white} />
          </View>
          <Text style={styles.heading}>Booking confirmed</Text>
          <Text style={styles.sub}>Your {professionalTitle} is on the way for your home visit.</Text>
        </View>

        <View style={styles.receipt}>
          <View style={styles.receiptTop}>
            <Text style={styles.receiptLabel}>BOOKING ID</Text>
            <Text style={styles.bookingId}>{booking.id}</Text>
          </View>

          <View style={styles.doctorRow}>
            <View style={styles.avatar}>
              {booking.doctor.avatar ? (
                <Image source={{ uri: booking.doctor.avatar }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.initials}>{booking.doctor.initials}</Text>
              )}
            </View>
            <View>
              <Text style={styles.doctor}>{booking.doctor.name}</Text>
              <Text style={styles.muted}>{booking.doctor.specialty}</Text>
            </View>
          </View>

          <View style={styles.detail}>
            <Ionicons name="calendar-outline" size={19} color={colors.green} />
            <View>
              <Text style={styles.detailLabel}>DATE & TIME</Text>
              <Text style={styles.detailValue}>
                {date}, {booking.slot.label}
              </Text>
            </View>
          </View>

          <View style={styles.detail}>
            <Ionicons name="location-outline" size={19} color={colors.green} />
            <View>
              <Text style={styles.detailLabel}>VISIT ADDRESS</Text>
              <Text style={styles.detailValue}>{booking.patient.address}</Text>
            </View>
          </View>

          <View style={styles.detail}>
            <Ionicons name="cash-outline" size={19} color={colors.green} />
            <View style={{ flex: 1 }}>
              <Text style={styles.detailLabel}>AMOUNT</Text>
              <View style={styles.statusRow}>
                <Text style={styles.detailValue}>
                  ₹{booking.total} · <Text style={{ color: isPaid ? '#16A34A' : '#EA580C', fontWeight: '800' }}>{paymentStatus}</Text>
                </Text>
              </View>
            </View>
          </View>
        </View>

        <PrimaryButton title="Send confirmation on WhatsApp" onPress={sendWhatsApp} />
        <View style={styles.gap} />
        <PrimaryButton
          title="Return to home"
          onPress={() => {
            reset();
            navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  container: { padding: 22, paddingTop: 45 },
  success: { alignItems: 'center', marginBottom: 29 },
  check: { backgroundColor: colors.green, width: 69, height: 69, borderRadius: 35, alignItems: 'center', justifyContent: 'center' },
  heading: { color: colors.ink, fontSize: 25, fontWeight: '800', marginTop: 17 },
  sub: { color: colors.muted, marginTop: 7 },
  receipt: { borderWidth: 1, borderColor: colors.border, borderRadius: 15, padding: 17, marginBottom: 22 },
  receiptTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 19 },
  receiptLabel: { fontSize: 10, color: colors.muted, letterSpacing: 1, fontWeight: '800' },
  bookingId: { color: colors.green, fontWeight: '800' },
  doctorRow: { flexDirection: 'row', alignItems: 'center', paddingBottom: 17, borderBottomWidth: 1, borderBottomColor: colors.border },
  avatar: { backgroundColor: colors.soft, width: 46, height: 46, borderRadius: 23, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  avatarImage: { width: 46, height: 46, borderRadius: 23 },
  initials: { color: colors.darkGreen, fontWeight: '800' },
  doctor: { color: colors.ink, fontWeight: '800', marginLeft: 12 },
  muted: { color: colors.muted, marginLeft: 12, marginTop: 4 },
  detail: { flexDirection: 'row', gap: 12, marginTop: 18 },
  detailLabel: { color: colors.muted, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  detailValue: { color: colors.ink, fontSize: 13, fontWeight: '600', marginTop: 4, maxWidth: 270 },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  gap: { height: 11 },
});