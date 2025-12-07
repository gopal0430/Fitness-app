
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Moon, Clock, Zap } from 'lucide-react-native';
import { DailyStats } from '../types';

interface SleepCardProps {
  todayStats: DailyStats;
  weeklyStats: DailyStats[];
}

const SleepCard: React.FC<SleepCardProps> = ({ todayStats, weeklyStats }) => {
  const screenWidth = Dimensions.get('window').width;

  // Format hours (float) to "Xh Ym"
  const formatTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  // Mock sleep stages calculation based on total hours
  const deepSleep = todayStats.sleepHours * 0.25;
  const lightSleep = todayStats.sleepHours * 0.55;
  const remSleep = todayStats.sleepHours * 0.20;

  const labels = weeklyStats.map(d => new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }));
  const data = weeklyStats.map(d => d.sleepHours);

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`, // Indigo
    strokeWidth: 2, 
    barPercentage: 0.6,
    decimalPlaces: 1,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <View style={styles.titleRow}>
             <Moon size={20} color="#6366f1" fill="#6366f1" />
             <Text style={styles.title}>Sleep</Text>
          </View>
          <Text style={styles.subtitle}>Last Night</Text>
        </View>
        <View style={styles.rightHeader}>
          <Text style={styles.mainValue}>{formatTime(todayStats.sleepHours)}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {todayStats.sleepHours >= 7 ? 'Restful' : 'Needs Focus'}
            </Text>
          </View>
        </View>
      </View>

      {/* Sleep Stages */}
      <View style={styles.stagesContainer}>
        <View style={[styles.stageBox, { backgroundColor: '#e0e7ff' }]}>
            <Text style={styles.stageLabel}>Deep</Text>
            <Text style={[styles.stageValue, { color: '#4338ca' }]}>{formatTime(deepSleep)}</Text>
            <View style={[styles.progressBar, { backgroundColor: '#c7d2fe' }]}>
                <View style={[styles.progressFill, { width: '25%', backgroundColor: '#4f46e5' }]} />
            </View>
        </View>
        <View style={[styles.stageBox, { backgroundColor: '#f3e8ff' }]}>
            <Text style={styles.stageLabel}>Light</Text>
            <Text style={[styles.stageValue, { color: '#7e22ce' }]}>{formatTime(lightSleep)}</Text>
             <View style={[styles.progressBar, { backgroundColor: '#e9d5ff' }]}>
                <View style={[styles.progressFill, { width: '55%', backgroundColor: '#a855f7' }]} />
            </View>
        </View>
        <View style={[styles.stageBox, { backgroundColor: '#fce7f3' }]}>
            <Text style={styles.stageLabel}>REM</Text>
            <Text style={[styles.stageValue, { color: '#be185d' }]}>{formatTime(remSleep)}</Text>
             <View style={[styles.progressBar, { backgroundColor: '#fbcfe8' }]}>
                <View style={[styles.progressFill, { width: '20%', backgroundColor: '#ec4899' }]} />
            </View>
        </View>
      </View>

      {/* Weekly Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartLabel}>Past 7 Days</Text>
        <BarChart
            data={{
                labels: labels,
                datasets: [{ data: data }]
            }}
            width={screenWidth - 80}
            height={140}
            yAxisLabel=""
            yAxisSuffix="h"
            chartConfig={chartConfig}
            style={styles.chart}
            showValuesOnTopOfBars={false}
            fromZero
        />
      </View>

      <View style={styles.footer}>
        <View style={styles.footerItem}>
            <Clock size={14} color="#6b7280" />
            <Text style={styles.footerText}>Bedtime: 11:30 PM</Text>
        </View>
        <View style={styles.footerItem}>
            <Zap size={14} color="#eab308" />
            <Text style={styles.footerText}>Wake up: 7:15 AM</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  rightHeader: {
    alignItems: 'flex-end',
  },
  mainValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  badge: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6366f1',
  },
  stagesContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  stageBox: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  stageLabel: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: 4,
  },
  stageValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressBar: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  chartContainer: {
    height: 160,
  },
  chartLabel: {
    fontSize: 10,
    color: '#9ca3af',
    fontWeight: '500',
    marginBottom: 8,
  },
  chart: {
    paddingRight: 0,
    marginLeft: -10, // adjust native chart kit padding
  },
  footer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
  }
});

export default SleepCard;
