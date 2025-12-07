
import React, { useState, useEffect, useRef } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    FlatList, 
    StyleSheet, 
    ActivityIndicator, 
    KeyboardAvoidingView, 
    Platform 
} from 'react-native';
import { Send, Bot, Sparkles } from 'lucide-react-native';
import Markdown from 'react-native-markdown-display';
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
  const flatListRef = useRef<FlatList>(null);

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
    if (messages.length > 0) {
        flatListRef.current?.scrollToEnd({ animated: true });
    }
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

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View style={[
        styles.messageRow, 
        item.role === 'user' ? styles.userRow : styles.botRow
    ]}>
        <View style={[
            styles.bubble, 
            item.role === 'user' ? styles.userBubble : styles.botBubble
        ]}>
             {/* Note: React Native Markdown Display handles rendering text */}
            <Markdown style={markdownStyles}>
                {item.text}
            </Markdown>
        </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Bot size={24} color="#fff" />
        </View>
        <View>
          <Text style={styles.headerTitle}>Gemini Coach</Text>
          <Text style={styles.headerSubtitle}>AI-powered fitness analysis</Text>
        </View>
      </View>

      {/* Daily Insight Section */}
      <View style={styles.insightSection}>
        <View style={styles.insightHeader}>
            <Sparkles size={16} color="#4f46e5" />
            <Text style={styles.insightTitle}>Daily Briefing</Text>
        </View>
        {loading && !insight ? (
           <View style={styles.loadingRow}>
             <ActivityIndicator size="small" color="#6366f1" />
             <Text style={styles.loadingText}>Analyzing your metrics...</Text>
           </View>
        ) : (
          <View style={styles.markdownWrapper}>
             <Markdown style={markdownStyles}>{insight || ''}</Markdown>
          </View>
        )}
      </View>

      {/* Chat Area */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.chatList}
        ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Ask me about your workout, diet, or recovery.</Text>
            </View>
        }
      />

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input}
          placeholder="Ask your coach..."
          value={inputValue}
          onChangeText={setInputValue}
          placeholderTextColor="#9ca3af"
        />
        <TouchableOpacity 
          onPress={handleSendMessage}
          disabled={!inputValue.trim()}
          style={[styles.sendButton, !inputValue.trim() && styles.disabledButton]}
        >
          <Send size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const markdownStyles = StyleSheet.create({
    body: { color: '#374151', fontSize: 14 },
    strong: { fontWeight: 'bold', color: '#1f2937' },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2563eb', // Blue-600
  },
  iconContainer: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    marginRight: 12,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#dbeafe',
    fontSize: 12,
  },
  insightSection: {
    padding: 16,
    backgroundColor: '#eef2ff', // Indigo-50
    borderBottomWidth: 1,
    borderBottomColor: '#e0e7ff',
    maxHeight: 200,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3730a3',
  },
  markdownWrapper: {
    // Markdown styling container
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    color: '#6366f1',
    fontSize: 14,
  },
  chatList: {
    padding: 16,
    paddingBottom: 20,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  botRow: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: '#2563eb',
    borderBottomRightRadius: 2,
  },
  botBubble: {
    backgroundColor: '#f3f4f6',
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  emptyContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  inputContainer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1f2937',
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#2563eb',
    padding: 10,
    borderRadius: 20,
  },
  disabledButton: {
    opacity: 0.5,
  }
});

// Override specific markdown styles for user bubbles (white text)
// Note: library limitations might require custom rendering or checking props if you want dynamic text color
// For simplicity, we keep text dark in both bubbles or standard logic

export default AICoach;
