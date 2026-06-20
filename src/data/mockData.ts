export interface VitalReading {
  id: string;
  date: string;
  weight: number;
  height: number;
  bpSystolic: number;
  bpDiastolic: number;
  sugar: number;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  distance: string;
  phone: string;
  address: string;
  available: boolean;
}

export const SPECIALTIES = [
  "All",
  "General Physician",
  "Cardiologist",
  "Dermatologist",
  "Dentist",
  "Pediatrician",
  "Neurologist",
  "Orthopedist",
];

export const initialReadings: VitalReading[] = [
  { id: "1", date: "2026-06-11", weight: 72.0, height: 175, bpSystolic: 118, bpDiastolic: 76, sugar: 88 },
  { id: "2", date: "2026-06-12", weight: 71.8, height: 175, bpSystolic: 122, bpDiastolic: 78, sugar: 92 },
  { id: "3", date: "2026-06-13", weight: 72.2, height: 175, bpSystolic: 135, bpDiastolic: 85, sugar: 105 },
  { id: "4", date: "2026-06-14", weight: 71.5, height: 175, bpSystolic: 128, bpDiastolic: 82, sugar: 98 },
  { id: "5", date: "2026-06-15", weight: 71.9, height: 175, bpSystolic: 144, bpDiastolic: 92, sugar: 118 },
  { id: "6", date: "2026-06-16", weight: 71.2, height: 175, bpSystolic: 130, bpDiastolic: 84, sugar: 102 },
  { id: "7", date: "2026-06-17", weight: 70.8, height: 175, bpSystolic: 125, bpDiastolic: 80, sugar: 95 },
];

export const doctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sarah Mitchell",
    specialty: "General Physician",
    rating: 4.8,
    reviews: 312,
    distance: "0.5 mi",
    phone: "+1 (555) 234-5678",
    address: "123 Health Ave, Suite 201",
    available: true,
  },
  {
    id: "2",
    name: "Dr. James Okafor",
    specialty: "Cardiologist",
    rating: 4.9,
    reviews: 198,
    distance: "1.2 mi",
    phone: "+1 (555) 345-6789",
    address: "456 Heart Center Blvd",
    available: true,
  },
  {
    id: "3",
    name: "Dr. Elena Vasquez",
    specialty: "Dermatologist",
    rating: 4.7,
    reviews: 274,
    distance: "0.8 mi",
    phone: "+1 (555) 456-7890",
    address: "789 Skin Clinic Rd",
    available: false,
  },
  {
    id: "4",
    name: "Dr. Michael Chen",
    specialty: "Dentist",
    rating: 4.6,
    reviews: 441,
    distance: "1.5 mi",
    phone: "+1 (555) 567-8901",
    address: "321 Dental Plaza, Unit 5",
    available: true,
  },
  {
    id: "5",
    name: "Dr. Amara Patel",
    specialty: "Pediatrician",
    rating: 4.9,
    reviews: 523,
    distance: "2.0 mi",
    phone: "+1 (555) 678-9012",
    address: "654 Children's Way",
    available: true,
  },
  {
    id: "6",
    name: "Dr. Robert Thompson",
    specialty: "General Physician",
    rating: 4.5,
    reviews: 189,
    distance: "3.1 mi",
    phone: "+1 (555) 789-0123",
    address: "987 Medical Center Dr",
    available: false,
  },
  {
    id: "7",
    name: "Dr. Priya Krishnan",
    specialty: "Cardiologist",
    rating: 4.8,
    reviews: 267,
    distance: "2.4 mi",
    phone: "+1 (555) 890-1234",
    address: "147 Cardiac Care Ln",
    available: true,
  },
  {
    id: "8",
    name: "Dr. Lucas Ferreira",
    specialty: "Dermatologist",
    rating: 4.4,
    reviews: 156,
    distance: "1.9 mi",
    phone: "+1 (555) 901-2345",
    address: "258 Skin Health Blvd",
    available: true,
  },
  {
    id: "9",
    name: "Dr. Nadia Hoffmann",
    specialty: "Neurologist",
    rating: 4.9,
    reviews: 133,
    distance: "3.5 mi",
    phone: "+1 (555) 012-3456",
    address: "369 Brain & Spine Center",
    available: false,
  },
  {
    id: "10",
    name: "Dr. Kevin Park",
    specialty: "Orthopedist",
    rating: 4.7,
    reviews: 208,
    distance: "2.8 mi",
    phone: "+1 (555) 123-4567",
    address: "741 Joint & Bone Clinic",
    available: true,
  },
];

export const chatKeywords: Array<{ keywords: string[]; response: string }> = [
  {
    keywords: ["headache", "migraine", "head pain"],
    response:
      "Headaches can stem from tension, dehydration, poor posture, or eye strain. Try drinking a glass of water, resting in a quiet, dimly lit room, and applying a cool compress to your forehead. If headaches are frequent, severe, or accompanied by vision changes, please consult your doctor promptly.",
  },
  {
    keywords: ["fever", "temperature", "chills"],
    response:
      "A fever above 38°C (100.4°F) typically signals your immune system fighting an infection. Rest well, stay hydrated, and consider acetaminophen or ibuprofen to ease discomfort. Seek medical attention if fever exceeds 39.5°C, persists beyond 3 days, or is accompanied by rash or difficulty breathing.",
  },
  {
    keywords: ["blood pressure", "hypertension", "bp"],
    response:
      "Normal blood pressure is below 120/80 mmHg. To support healthy BP: reduce sodium intake, exercise regularly (aim for 30 min/day), manage stress, limit alcohol, and maintain a healthy weight. If readings are consistently high, please work with your doctor on a personalized management plan.",
  },
  {
    keywords: ["sugar", "glucose", "diabetes", "blood sugar"],
    response:
      "Fasting blood glucose below 100 mg/dL is generally normal; 100–125 is prediabetic range; 126+ may indicate diabetes. A low-glycemic diet (vegetables, legumes, whole grains), regular exercise, and adequate sleep all help regulate blood sugar. Discuss any concerns with your healthcare provider.",
  },
  {
    keywords: ["diet", "nutrition", "food", "eat"],
    response:
      "A balanced diet rich in colorful vegetables, whole grains, lean proteins (fish, legumes, poultry), and healthy fats (avocado, nuts, olive oil) supports overall health. Minimize ultra-processed foods, refined sugars, and excess sodium. Aim for regular, portion-controlled meals rather than skipping.",
  },
  {
    keywords: ["exercise", "workout", "fitness", "physical activity"],
    response:
      "Adults benefit from at least 150 minutes of moderate aerobic activity (brisk walking, cycling, swimming) per week, plus 2 days of strength training. Even a 20–30 minute daily walk significantly improves cardiovascular health, mood, and metabolic function. Start gradually and build consistency.",
  },
  {
    keywords: ["sleep", "insomnia", "tired", "fatigue"],
    response:
      "Most adults need 7–9 hours of sleep per night. Poor sleep is linked to elevated blood pressure, impaired immunity, and mood disorders. Establish a consistent sleep schedule, keep your bedroom cool and dark, limit screen time before bed, and avoid caffeine after 2 PM for better rest.",
  },
  {
    keywords: ["stress", "anxiety", "mental health", "worried"],
    response:
      "Chronic stress raises cortisol, which can elevate blood pressure and suppress immunity. Effective strategies include: diaphragmatic breathing, regular physical activity, mindfulness meditation, journaling, and maintaining strong social connections. If stress feels overwhelming, a mental health professional can provide personalized support.",
  },
  {
    keywords: ["weight", "bmi", "obese", "overweight"],
    response:
      "A healthy BMI for most adults is 18.5–24.9 kg/m². Even a 5–10% reduction in body weight can significantly lower blood pressure, blood sugar, and cholesterol. Focus on sustainable changes: caloric awareness without extreme restriction, regular movement, and quality sleep rather than crash diets.",
  },
  {
    keywords: ["heart", "chest", "cardiac", "palpitation"],
    response:
      "Heart-related symptoms like chest pain, palpitations, or shortness of breath should always be evaluated by a doctor — don't delay. For general heart health: quit smoking, limit alcohol, maintain healthy BP and cholesterol, exercise regularly, and manage stress. Regular cardiology check-ups are recommended after age 40.",
  },
  {
    keywords: ["skin", "rash", "acne", "eczema"],
    response:
      "Skin conditions vary widely — from harmless dry patches to conditions needing treatment. General tips: use gentle, fragrance-free cleansers, moisturize daily, apply SPF 30+ sunscreen, and avoid picking at lesions. For persistent, spreading, or painful skin issues, a dermatologist can provide an accurate diagnosis and treatment plan.",
  },
];

export const defaultResponse =
  "Thank you for your question. I can share general health information, but please remember I'm an AI assistant — not a doctor. For specific concerns about your health, symptoms, or medications, please consult a qualified healthcare professional who can review your full medical history.";
