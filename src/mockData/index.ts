import { Doctor, HealthIssue, TimeSlot } from '../types';
export const healthIssues: HealthIssue[] = [
  { id: 'fever', name: 'Fever', icon: 'thermometer-outline' }, { id: 'checkup', name: 'General Checkup', icon: 'medkit-outline' }, { id: 'pediatric', name: 'Pediatric Care', icon: 'happy-outline' }, { id: 'elderly', name: 'Elderly Care', icon: 'accessibility-outline' }, { id: 'diabetes', name: 'Diabetes', icon: 'water-outline' }, { id: 'skin', name: 'Skin Care', icon: 'sparkles-outline' },
];
const slots = (labels: string[]): TimeSlot[] => labels.map((label, index) => ({ id: `${index}-${label}`, label, available: true }));
export const getDateKey = (offset: number) => { const date = new Date(); date.setDate(date.getDate() + offset); return date.toISOString().split('T')[0]; };
export const doctors: Doctor[] = [
  { id: 'ananya', name: 'Dr. Ananya Sharma', specialty: 'General Physician', rating: 4.9, experience: 12, fee: 850, phone: '+919876543210', initials: 'AS', issueIds: ['fever', 'checkup', 'diabetes'], slots: {} },
  { id: 'rohan', name: 'Dr. Rohan Mehta', specialty: 'Family Medicine', rating: 4.8, experience: 9, fee: 700, phone: '+919876543211', initials: 'RM', issueIds: ['checkup', 'elderly', 'fever'], slots: {} },
  { id: 'priya', name: 'Dr. Priya Iyer', specialty: 'Pediatrician', rating: 4.7, experience: 8, fee: 900, phone: '+919876543212', initials: 'PI', issueIds: ['pediatric', 'fever'], slots: {} },
  { id: 'kabir', name: 'Dr. Kabir Singh', specialty: 'Internal Medicine', rating: 4.6, experience: 15, fee: 1000, phone: '+919876543213', initials: 'KS', issueIds: ['diabetes', 'elderly', 'checkup'], slots: {} },
];
doctors.forEach((doctor) => [0, 1, 2, 3].forEach((offset) => { doctor.slots[getDateKey(offset)] = slots(offset === 0 ? ['10:00 AM', '12:30 PM', '04:00 PM'] : ['09:30 AM', '11:00 AM', '02:30 PM', '05:30 PM']); }));