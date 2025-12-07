import { ActivityType, ActivitySession, DailyStats, ClientProfile } from './types';

export const CURRENT_CLIENT: ClientProfile = {
  id: 'c1',
  name: 'Sarah Jenkins',
  age: 28,
  heightCm: 165,
  weightKg: 62,
  goals: ['Improve cardiovascular health', 'Run 5k in under 25 mins', 'Sleep 8 hours']
};

export const RECENT_ACTIVITIES: ActivitySession[] = [
  { id: 'a1', type: ActivityType.Run, durationMinutes: 32, caloriesBurned: 320, date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), distanceKm: 4.5 },
  { id: 'a2', type: ActivityType.Yoga, durationMinutes: 45, caloriesBurned: 180, date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { id: 'a3', type: ActivityType.Cycle, durationMinutes: 60, caloriesBurned: 500, date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), distanceKm: 20 },
  { id: 'a4', type: ActivityType.Walk, durationMinutes: 20, caloriesBurned: 85, date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), distanceKm: 1.5 },
];

// Generate last 7 days of stats
const generateStats = (): DailyStats[] => {
  const stats: DailyStats[] = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    
    stats.push({
      date: d.toISOString().split('T')[0],
      steps: Math.floor(6000 + Math.random() * 6000), // 6k - 12k
      heartPoints: Math.floor(20 + Math.random() * 40),
      moveMinutes: Math.floor(45 + Math.random() * 60),
      calories: Math.floor(1800 + Math.random() * 500),
      sleepHours: 6 + Math.random() * 3,
      heartRateAvg: Math.floor(65 + Math.random() * 10),
      weight: 62 + (Math.random() * 0.5 - 0.25)
    });
  }
  return stats;
};

export const WEEKLY_STATS = generateStats();

export const GOALS = {
  steps: 10000,
  heartPoints: 40,
  moveMinutes: 60
};