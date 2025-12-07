import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getFitnessInsights, chatWithCoach } from '../services/geminiService';
import { ClientProfile, DailyStats, ActivitySession, ChatMessage } from '../types';

interface AICoachProps {
  client: ClientProfile;
  stats: DailyStats[];
  activities: ActivitySession[];
}

const AICoach: React.FC<AICoachProps> = ({ client, stats, activities }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial insight on load
    const fetchInsight = async () => {
      setLoading(true);
      const data = await getFitnessInsights(client, stats, activities);
      setInsight(data);
      setLoading(false);
    };
    fetchInsight();
  }, [client, stats, activities]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: inputValue, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    
    // Construct context
    const context = `
      User: ${client.name}. Stats: Steps ${stats[stats.length-1].steps}, 
      Heart Points ${stats[stats.length-1].heartPoints}.
      Recent Activity: ${activities[0]?.type || 'None'}.
    `;

    const responseText = await chatWithCoach(inputValue, context);
    const botMsg: ChatMessage = { role: 'model', text: responseText, timestamp: Date.now() };
    setMessages(prev => [...prev, botMsg]);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-full">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-white font-bold text-lg">Gemini Coach</h2>
          <p className="text-blue-100 text-xs">AI-powered fitness analysis</p>
        </div>
      </div>

      {/* Daily Insight Section */}
      <div className="p-4 bg-indigo-50 border-b border-indigo-100">
        <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-semibold text-indigo-800">Daily Briefing</h3>
        </div>
        {loading && !insight ? (
           <div className="flex items-center gap-2 text-indigo-500 text-sm">
             <Loader2 className="w-4 h-4 animate-spin" />
             Analyzing your metrics...
           </div>
        ) : (
          <div className="text-sm text-gray-700 prose prose-sm max-w-none">
             <ReactMarkdown>{insight || ''}</ReactMarkdown>
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-10 text-sm">
            <p>Ask me about your workout, diet, or recovery.</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
              }`}
            >
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t flex gap-2">
        <input 
          type="text"
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder="Ask your coach..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button 
          onClick={handleSendMessage}
          disabled={!inputValue.trim()}
          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AICoach;