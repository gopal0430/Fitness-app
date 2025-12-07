
import React, { useState } from 'react';
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
  Moon
} from 'lucide-react';
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

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Dashboard);
  const [selectedDay, setSelectedDay] = useState<DailyStats>(WEEKLY_STATS[WEEKLY_STATS.length - 1]);

  // Derived Values
  const todayStats = selectedDay;
  const stepsProgress = todayStats.steps;
  const heartPointsProgress = todayStats.heartPoints;

  const renderDashboard = () => (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Top Rings Section */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-blue-500 to-green-400" />
        
        <h2 className="text-gray-500 font-medium mb-6 text-sm uppercase tracking-wide">Today's Goals</h2>
        
        <div className="flex gap-4 items-end justify-center">
          <RadialProgress 
            value={heartPointsProgress} 
            max={GOALS.heartPoints} 
            size={120} 
            strokeWidth={10} 
            color="#3b82f6" // Blue
            icon={<Heart className="w-6 h-6 text-blue-500 fill-current" />}
            label="Heart Pts"
          />
          <RadialProgress 
            value={stepsProgress} 
            max={GOALS.steps} 
            size={160} 
            strokeWidth={12} 
            color="#22c55e" // Green
            icon={<Footprints className="w-8 h-8 text-green-500 fill-current" />}
            label="Steps"
          />
        </div>

        <div className="grid grid-cols-3 gap-8 mt-8 w-full text-center">
          <div>
            <p className="text-2xl font-bold text-gray-800">{todayStats.moveMinutes}</p>
            <p className="text-xs text-gray-500 uppercase font-semibold mt-1">Move Min</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{todayStats.calories}</p>
            <p className="text-xs text-gray-500 uppercase font-semibold mt-1">Cal</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{todayStats.distanceKm || '4.2'}</p>
            <p className="text-xs text-gray-500 uppercase font-semibold mt-1">Km</p>
          </div>
        </div>
      </div>

      {/* Sleep Tracker Card - New Feature */}
      <SleepCard todayStats={todayStats} weeklyStats={WEEKLY_STATS} />

      {/* Weekly Charts */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                This Week
            </h3>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Steps</span>
        </div>
        <ActivityChart data={WEEKLY_STATS} dataKey="steps" color="#22c55e" />
      </div>

       {/* Recent Activity Mini List */}
       <div className="space-y-3">
        <h3 className="font-bold text-gray-800 px-2">Recent Activity</h3>
        {RECENT_ACTIVITIES.slice(0, 2).map(activity => (
            <div key={activity.id} className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                        {activity.type === 'Run' ? <Flame className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800">{activity.type}</p>
                        <p className="text-xs text-gray-500">{new Date(activity.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {activity.caloriesBurned} cal</p>
                    </div>
                </div>
                <div className="text-right">
                     <p className="font-bold text-gray-800">{activity.distanceKm ? `${activity.distanceKm} km` : `${activity.durationMinutes} min`}</p>
                </div>
            </div>
        ))}
       </div>
    </div>
  );

  const renderJournal = () => (
    <div className="space-y-4 pb-24">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 px-2">Activity Journal</h2>
      {RECENT_ACTIVITIES.map((activity) => (
        <div key={activity.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
             <div className="flex items-center gap-2">
                 <Calendar className="w-4 h-4 text-gray-400" />
                 <span className="text-xs text-gray-500 font-medium">
                     {new Date(activity.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric'})}
                 </span>
             </div>
             <ChevronRight className="w-4 h-4 text-gray-300" />
          </div>
          <div className="flex items-center gap-4 mt-2">
             <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <Activity className="w-6 h-6" />
             </div>
             <div>
                 <h3 className="font-bold text-gray-800 text-lg">{activity.type}</h3>
                 <div className="flex gap-3 text-sm text-gray-600 mt-1">
                     <span>{activity.durationMinutes} min</span>
                     <span>•</span>
                     <span>{activity.caloriesBurned} kcal</span>
                     {activity.distanceKm && (
                         <>
                            <span>•</span>
                            <span>{activity.distanceKm} km</span>
                         </>
                     )}
                 </div>
             </div>
          </div>
        </div>
      ))}
      <div className="mt-8 p-4 bg-gray-50 rounded-xl text-center">
          <p className="text-gray-500 text-sm">End of history</p>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6 pb-24">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
            <img src="https://picsum.photos/200" alt="Profile" className="w-full h-full object-cover" />
        </div>
        <div>
            <h2 className="text-2xl font-bold text-gray-800">{CURRENT_CLIENT.name}</h2>
            <p className="text-gray-500">{CURRENT_CLIENT.age} years old</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4">Body Measurements</h3>
        <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-xs text-gray-500 uppercase">Height</p>
                <p className="text-xl font-bold text-gray-800 mt-1">{CURRENT_CLIENT.heightCm} cm</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-xs text-gray-500 uppercase">Weight</p>
                <p className="text-xl font-bold text-gray-800 mt-1">{CURRENT_CLIENT.weightKg} kg</p>
            </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Goals</h3>
          <ul className="space-y-3">
              {CURRENT_CLIENT.goals.map((goal, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-gray-700">{goal}</span>
                  </li>
              ))}
          </ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
        {/* Mobile-first Container */}
        <div className="w-full max-w-md bg-gray-50 min-h-screen flex flex-col relative shadow-2xl">
            
            {/* Header */}
            <header className="px-6 pt-12 pb-4 bg-white sticky top-0 z-10 shadow-sm/50">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric'})}
                        </p>
                        <h1 className="text-2xl font-bold text-gray-900 mt-0.5">
                            {activeTab === Tab.Dashboard ? 'Summary' : activeTab}
                        </h1>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden">
                        <img src="https://picsum.photos/100" className="w-full h-full object-cover" alt="User" />
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 px-4 py-6 overflow-y-auto no-scrollbar scroll-smooth">
                {activeTab === Tab.Dashboard && renderDashboard()}
                {activeTab === Tab.Journal && renderJournal()}
                {activeTab === Tab.Profile && renderProfile()}
                {activeTab === Tab.Coach && (
                  <div className="h-[calc(100vh-180px)]">
                      <AICoach 
                        client={CURRENT_CLIENT} 
                        stats={WEEKLY_STATS} 
                        activities={RECENT_ACTIVITIES} 
                      />
                  </div>
                )}
            </main>

            {/* Floating Action Button (FAB) - Only on Dashboard */}
            {activeTab === Tab.Dashboard && (
              <button 
                onClick={() => setActiveTab(Tab.Coach)}
                className="absolute bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg shadow-blue-500/40 flex items-center justify-center text-white hover:scale-105 transition-transform z-20"
              >
                  <MessageSquare className="w-6 h-6" />
              </button>
            )}

            {/* Bottom Navigation */}
            <nav className="bg-white border-t border-gray-200 h-20 flex justify-around items-start pt-4 fixed bottom-0 w-full max-w-md z-30">
                <button 
                  onClick={() => setActiveTab(Tab.Dashboard)}
                  className={`flex flex-col items-center gap-1 w-16 ${activeTab === Tab.Dashboard ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <Home className={`w-6 h-6 ${activeTab === Tab.Dashboard ? 'fill-current' : ''}`} />
                    <span className="text-[10px] font-medium">Home</span>
                </button>

                <button 
                  onClick={() => setActiveTab(Tab.Journal)}
                  className={`flex flex-col items-center gap-1 w-16 ${activeTab === Tab.Journal ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <Activity className={`w-6 h-6 ${activeTab === Tab.Journal ? 'fill-current' : ''}`} />
                    <span className="text-[10px] font-medium">Journal</span>
                </button>

                <button 
                  onClick={() => setActiveTab(Tab.Coach)}
                  className={`flex flex-col items-center gap-1 w-16 ${activeTab === Tab.Coach ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <MessageSquare className={`w-6 h-6 ${activeTab === Tab.Coach ? 'fill-current' : ''}`} />
                    <span className="text-[10px] font-medium">Coach</span>
                </button>

                <button 
                  onClick={() => setActiveTab(Tab.Profile)}
                  className={`flex flex-col items-center gap-1 w-16 ${activeTab === Tab.Profile ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <User className={`w-6 h-6 ${activeTab === Tab.Profile ? 'fill-current' : ''}`} />
                    <span className="text-[10px] font-medium">Profile</span>
                </button>
            </nav>
        </div>
    </div>
  );
};

export default App;
