
import { GoogleGenAI } from "@google/genai";
import { DailyStats, ClientProfile, ActivitySession } from '../types';

let genAI: GoogleGenAI | null = null;

const getGenAI = () => {
  if (!genAI) {
    const apiKey = process.env.API_KEY || '';
    if (!apiKey) {
      console.warn("API Key not found in environment variables");
      return null;
    }
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
};

export const getFitnessInsights = async (
  client: ClientProfile,
  stats: DailyStats[],
  activities: ActivitySession[]
): Promise<string> => {
  const ai = getGenAI();
  if (!ai) return "Please configure your API Key to receive AI insights.";

  const recentStats = stats.slice(-3); // Last 3 days
  const today = recentStats[recentStats.length - 1];

  const prompt = `
    Act as an elite personal trainer and health data analyst. 
    Analyze the following client data for ${client.name} (Age: ${client.age}, Goals: ${client.goals.join(', ')}).

    Recent Daily Stats (Last 3 days):
    ${JSON.stringify(recentStats)}

    Recent Activities:
    ${JSON.stringify(activities.slice(0, 3))}

    Current Context: Today is ${today.date}.
    
    Provide a concise, motivating summary of their progress. 
    Review their SLEEP patterns specifically from the stats (sleepHours).
    Identify one key area for improvement and one specific "Win" from the data.
    Keep the tone encouraging but professional like a Google Fit coach.
    Format the response in Markdown with bold points.
    Do not use JSON in the output.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No insights available right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to generate insights at the moment. Please try again later.";
  }
};

export const chatWithCoach = async (message: string, context: string): Promise<string> => {
    const ai = getGenAI();
    if (!ai) return "API Key missing.";

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Context: ${context}\n\nUser: ${message}\n\nCoach:`,
        });
        return response.text || "I didn't catch that.";
    } catch (error) {
        return "Sorry, I'm having trouble connecting to the server.";
    }
}
