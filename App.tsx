
import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  SafeAreaView, 
  StatusBar,
  Dimensions
} from 'react-native';
import { 
  Activity, 
  Home, 
  User, 
  MessageSquare, 
  Flame, 
  Footprints, 
  Heart,
  Calendar,
  ChevronRight,
  TrendingUp,
  Menu
} from 'lucide-react-native';
import RadialProgress from './components/RadialProgress';
import ActivityChart from './components/ActivityChart';
import SleepCard from './components/SleepCard';
import AICoach from './components/AICoach';
import { WEEKLY_STATS, RECENT_ACTIVITIES, CURRENT_CLIENT, GOALS } from './constants';
import { DailyStats } from './types';

// Tab Definitions
enum Tab {
  Dashboard = 'Dashboard',
  Journal = 'Journal',
  Profile = 'Profile',
  Coach = 'Coach'
}

const { width } = Dimensions.get('window');

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Dashboard);
  
  // Derived Values
  const todayStats = WEEKLY_STATS[WEEKLY_STATS.length - 1];
  const stepsProgress = todayStats.steps;
  const heartPointsProgress = todayStats.heartPoints;

  const renderDashboard = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      {/* Top Rings Section */}
      <View style={styles.card}>
        <View style={styles.cardHeaderGradient} />
        
        <Text style={styles.sectionTitle}>TODAY'S GOALS</Text>
        
        <View style={styles.ringsContainer}>
          <RadialProgress 
            value={heartPointsProgress} 
            max={GOALS.heartPoints} 
            size={100} 
            strokeWidth={10} 
            color="#3b82f6" // Blue
            icon={<Heart size={20} color="#3b82f6" fill="#3b82f6" />}
            label="Heart Pts"
          />
          <View style={{ width: 20 }} />
          <RadialProgress 
            value={stepsProgress} 
            max={GOALS.steps} 
            size={130} 
            strokeWidth={12} 
            color="#22c55e" // Green
            icon={<Footprints size={24} color="#22c55e" fill="#22c55e" />}
            label="Steps"
          />
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{todayStats.moveMinutes}</Text>
            <Text style={styles.statLabel}>MOVE MIN</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{todayStats.calories}</Text>
            <Text style={styles.statLabel}>CAL</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{todayStats.distanceKm || '4.2'}</Text>
            <Text style={styles.statLabel}>KM</Text>
          </View>
        </View>
      </View>

      {/* Sleep Tracker Card */}
      <SleepCard todayStats={todayStats} weeklyStats={WEEKLY_STATS} />

      {/* Weekly Charts */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
            <View style={styles.row}>
                <TrendingUp size={20} color="#3b82f6" />
                <Text style={styles.cardTitle}>This Week</Text>
            </View>
            <View style={styles.badge}>
                <Text style={styles.badgeText}>Steps</Text>
            </View>
        </div>
        <ActivityChart data={WEEKLY_STATS} dataKey="steps" color="#22c55e" />
      </View>

       {/* Recent Activity Mini List */}
       <View style={styles.sectionContainer}>
        <Text style={styles.sectionHeader}>Recent Activity</Text>
        {RECENT_ACTIVITIES.slice(0, 2).map(activity => (
            <View key={activity.id} style={styles.miniActivityCard}>
                <View style={styles.row}>
                    <View style={styles.iconContainerOrange}>
                        {activity.type === 'Run' ? <Flame size={24} color="#ea580c" /> : <Activity size={24} color="#ea580c" />}
                    </View>
                    <View>
                        <Text style={styles.activityTitle}>{activity.type}</Text>
                        <Text style={styles.activitySub}>
                            {new Date(activity.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {activity.caloriesBurned} cal
                        </Text>
                    </View>
                </View>
                <View>
                     <Text style={styles.activityValue}>{activity.distanceKm ? `${activity.distanceKm} km` : `${activity.durationMinutes} min`}</Text>
                </View>
            </View>
        ))}
       </View>
    </ScrollView>
  );

  const renderJournal = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.pageTitle}>Activity Journal</Text>
      {RECENT_ACTIVITIES.map((activity) => (
        <View key={activity.id} style={styles.journalCard}>
          <View style={styles.journalHeader}>
             <View style={styles.row}>
                 <Calendar size={14} color="#9ca3af" />
                 <Text style={styles.journalDate}>
                     {new Date(activity.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric'})}
                 </Text>
             </View>
             <ChevronRight size={16} color="#d1d5db" />
          </View>
          <View style={[styles.row, { marginTop: 10 }]}>
             <View style={styles.iconContainerBlue}>
                <Activity size={24} color="#2563eb" />
             </View>
             <View>
                 <Text style={styles.journalTitle}>{activity.type}</Text>
                 <View style={styles.row}>
                     <Text style={styles.journalMeta}>{activity.durationMinutes} min</Text>
                     <Text style={styles.journalMeta}> • </Text>
                     <Text style={styles.journalMeta}>{activity.caloriesBurned} kcal</Text>
                     {activity.distanceKm && (
                         <>
                            <Text style={styles.journalMeta}> • </Text>
                            <Text style={styles.journalMeta}>{activity.distanceKm} km</Text>
                         </>
                     )}
                 </View>
             </View>
          </View>
        </View>
      ))}
      <View style={styles.endOfHistory}>
          <Text style={styles.endText}>End of history</Text>
      </View>
    </ScrollView>
  );

  const renderProfile = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <View style={[styles.card, styles.row, { padding: 20 }]}>
        <View style={styles.avatarContainer}>
            <Image source={{ uri: "https://picsum.photos/200" }} style={styles.avatar} />
        </View>
        <View>
            <Text style={styles.profileName}>{CURRENT_CLIENT.name}</Text>
            <Text style={styles.profileAge}>{CURRENT_CLIENT.age} years old</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Body Measurements</Text>
        <View style={styles.grid2}>
            <View style={styles.measurementBox}>
                <Text style={styles.measurementLabel}>HEIGHT</Text>
                <Text style={styles.measurementValue}>{CURRENT_CLIENT.heightCm} cm</Text>
            </View>
            <View style={styles.measurementBox}>
                <Text style={styles.measurementLabel}>WEIGHT</Text>
                <Text style={styles.measurementValue}>{CURRENT_CLIENT.weightKg} kg</Text>
            </View>
        </View>
      </View>

      <View style={styles.card}>
          <Text style={styles.cardTitle}>Goals</Text>
          <View style={{ marginTop: 10 }}>
              {CURRENT_CLIENT.goals.map((goal, idx) => (
                  <View key={idx} style={[styles.row, { marginBottom: 12 }]}>
                      <View style={styles.bullet} />
                      <Text style={styles.goalText}>{goal}</Text>
                  </View>
              ))}
          </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
            <Text style={styles.headerDate}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric'})}
            </Text>
            <Text style={styles.headerTitle}>
                {activeTab === Tab.Dashboard ? 'Summary' : activeTab}
            </Text>
        </View>
        <View style={styles.headerAvatar}>
            <Image source={{ uri: "https://picsum.photos/100" }} style={styles.headerAvatarImg} />
        </View>
      </View>

      {/* Main Content Area */}
      <View style={styles.content}>
        {activeTab === Tab.Dashboard && renderDashboard()}
        {activeTab === Tab.Journal && renderJournal()}
        {activeTab === Tab.Profile && renderProfile()}
        {activeTab === Tab.Coach && (
            <AICoach 
            client={CURRENT_CLIENT} 
            stats={WEEKLY_STATS} 
            activities={RECENT_ACTIVITIES} 
            />
        )}
      </View>

      {/* Floating Action Button (FAB) */}
      {activeTab === Tab.Dashboard && (
        <TouchableOpacity 
          style={styles.fab}
          onPress={() => setActiveTab(Tab.Coach)}
        >
            <MessageSquare size={24} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {[
            { id: Tab.Dashboard, icon: Home, label: 'Home' },
            { id: Tab.Journal, icon: Activity, label: 'Journal' },
            { id: Tab.Coach, icon: MessageSquare, label: 'Coach' },
            { id: Tab.Profile, icon: User, label: 'Profile' },
        ].map((item) => (
            <TouchableOpacity 
                key={item.id}
                onPress={() => setActiveTab(item.id)}
                style={styles.navItem}
            >
                <item.icon 
                    size={24} 
                    color={activeTab === item.id ? '#2563eb' : '#9ca3af'} 
                    fill={activeTab === item.id && item.id !== Tab.Coach ? '#2563eb' : 'none'}
                />
                <Text style={[
                    styles.navLabel, 
                    { color: activeTab === item.id ? '#2563eb' : '#9ca3af' }
                ]}>
                    {item.label}
                </Text>
            </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerDate: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 2,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#e5e7eb',
  },
  headerAvatarImg: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  cardHeaderGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#3b82f6', // Simplified gradient
  },
  sectionTitle: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 24,
  },
  ringsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '600',
    marginTop: 4,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 8,
  },
  badge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    color: '#4b5563',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionContainer: {
    marginTop: 8,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    marginLeft: 8,
  },
  miniActivityCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainerOrange: {
    backgroundColor: '#ffedd5',
    padding: 10,
    borderRadius: 20,
    marginRight: 16,
  },
  iconContainerBlue: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  activitySub: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  activityValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  journalCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 24,
    marginLeft: 8,
  },
  journalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  journalDate: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    marginLeft: 8,
  },
  journalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  journalMeta: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 4,
  },
  endOfHistory: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    alignItems: 'center',
  },
  endText: {
    color: '#6b7280',
    fontSize: 14,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e5e7eb',
    overflow: 'hidden',
    marginRight: 16,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  profileAge: {
    color: '#6b7280',
    fontSize: 14,
  },
  grid2: {
    flexDirection: 'row',
    gap: 16,
  },
  measurementBox: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 16,
  },
  measurementLabel: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: 4,
  },
  measurementValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
    marginRight: 12,
  },
  goalText: {
    fontSize: 14,
    color: '#374151',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    paddingBottom: 20, // Safe area padding
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  navItem: {
    alignItems: 'center',
    width: 64,
  },
  navLabel: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default App;
