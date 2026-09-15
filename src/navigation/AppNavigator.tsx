import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { HomeScreen } from '../screens/HomeScreen';
import { DoctorsScreen } from '../screens/DoctorsScreen';
import { AvailabilityScreen } from '../screens/AvailabilityScreen';
import { PatientDetailsScreen } from '../screens/PatientDetailsScreen';
import { PaymentScreen } from '../screens/PaymentScreen';
import { ConfirmationScreen } from '../screens/ConfirmationScreen';
const Stack = createNativeStackNavigator<RootStackParamList>();
export function AppNavigator() { return <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FFFFFF' } }}><Stack.Screen name="Home" component={HomeScreen} /><Stack.Screen name="Doctors" component={DoctorsScreen} /><Stack.Screen name="Availability" component={AvailabilityScreen} /><Stack.Screen name="PatientDetails" component={PatientDetailsScreen} /><Stack.Screen name="Payment" component={PaymentScreen} /><Stack.Screen name="Confirmation" component={ConfirmationScreen} /></Stack.Navigator>; }