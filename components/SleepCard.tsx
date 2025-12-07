
import React from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { Moon, Clock, Zap } from 'lucide-react';
import { DailyStats } from '../types';

interface SleepCardProps {
  todayStats: DailyStats;
  weeklyStats: DailyStats[];
}

const SleepCard: React.FC<SleepCardProps> = ({ todayStats, weeklyStats }) => {
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

  const chartData = weeklyStats.map((stat, index) => ({
    day: new Date(stat.date).toLocaleDateString('en-US', { weekday: 'short' }),
    hours: stat.sleepHours,
    isToday: index === weeklyStats.length - 1
  }));

  return (
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <Moon className="w-5 h-5 text-indigo-500 fill-current" />
            Sleep
          </h3>
          <p className="text-xs text-gray-500 mt-1">Last Night</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-gray-800">{formatTime(todayStats.sleepHours)}</p>
          <p className="text-xs font-semibold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-full inline-block mt-1">
            {todayStats.sleepHours >= 7 ? 'Restful' : 'Needs Focus'}
          </p>
        </div>
      </div>

      {/* Sleep Stages */}
      <div className="flex gap-2 mb-6 mt-2">
        <div className="flex-1 bg-indigo-50 rounded-xl p-3 flex flex-col items-center justify-center">
            <span className="text-xs text-gray-500 font-medium mb-1">Deep</span>
            <span className="text-sm font-bold text-indigo-700">{formatTime(deepSleep)}</span>
            <div className="w-full h-1 bg-indigo-200 rounded-full mt-2">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: '25%' }}></div>
            </div>
        </div>
        <div className="flex-1 bg-purple-50 rounded-xl p-3 flex flex-col items-center justify-center">
            <span className="text-xs text-gray-500 font-medium mb-1">Light</span>
            <span className="text-sm font-bold text-purple-700">{formatTime(lightSleep)}</span>
             <div className="w-full h-1 bg-purple-200 rounded-full mt-2">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '55%' }}></div>
            </div>
        </div>
        <div className="flex-1 bg-pink-50 rounded-xl p-3 flex flex-col items-center justify-center">
            <span className="text-xs text-gray-500 font-medium mb-1">REM</span>
            <span className="text-sm font-bold text-pink-700">{formatTime(remSleep)}</span>
             <div className="w-full h-1 bg-pink-200 rounded-full mt-2">
                <div className="h-full bg-pink-500 rounded-full" style={{ width: '20%' }}></div>
            </div>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="h-32 w-full">
        <p className="text-xs text-gray-400 font-medium mb-2">Past 7 Days</p>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                dy={5}
            />
             <Tooltip 
                cursor={{ fill: 'rgba(243, 244, 246, 0.5)' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                formatter={(value: number) => [`${value.toFixed(1)} hrs`, 'Sleep']}
             />
            <Bar dataKey="hours" radius={[4, 4, 4, 4]}>
              {chartData.map((entry, index) => (
                <Cell 
                    key={`cell-${index}`} 
                    fill={entry.isToday ? '#6366f1' : '#e0e7ff'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Bedtime: 11:30 PM</span>
        </div>
        <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-yellow-500" />
            <span>Wake up: 7:15 AM</span>
        </div>
      </div>
    </div>
  );
};

export default SleepCard;
