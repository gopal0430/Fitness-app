export enum ActivityType {
  Walk = 'Walk',
  Run = 'Run',
  Cycle = 'Cycle',
  Yoga = 'Yoga',
  Weights = 'Weights',
  Swim = 'Swim'
}

export interface ActivitySession {
  id: string;
  type: ActivityType;
  durationMinutes: number;
  caloriesBurned: number;
  date: string; // ISO date
  distanceKm?: number;
}

export interface DailyStats {
  date: string;
  steps: number;
  heartPoints: number;
  moveMinutes: number;
  calories: number;
  sleepHours: number;
  heartRateAvg: number;
  weight: number;
}

export interface ClientProfile {
  id: string;
  name: string;
  age: number;
  heightCm: number;
  weightKg: number;
  goals: string[];
}

export type TimeRange = 'Day' | 'Week' | 'Month';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}