import { GoogleGenAI } from "@google/genai";
import { Agent } from '../lib/types';

let ai: GoogleGenAI | null = null;

const getAI = () => {
    if (!ai) {
        // Ideally this comes from a server-side route to hide the key, 
        // but for this port we'll keep it as is or use a public env var if configured.
        // Note: In a real app, never expose API keys on the client.
        ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.API_KEY });
    }
    return ai;
};

export const chatWithAgent = async (agent: Agent, userMessage: string): Promise<string> => {
    try {
        const client = getAI();

        // Using a faster model for interactive chat
        const modelId = 'gemini-2.5-flash';

        const systemPrompt = `
      You are roleplaying as ${agent.name}, a level ${agent.level} ${agent.class} in a pixel-art fantasy RPG.
      Your traits are: ${agent.traits.join(', ')}.
      Your backstory: ${agent.backstory}.
      Current Status: Resting at the inn.
      
      Respond to the traveler (user) in character. 
      Keep your response short (under 40 words) to fit in a text box.
      Be flavorful, use archaic but readable fantasy speech if it fits your class.
      Do not break character.
    `;

        const response = await client.models.generateContent({
            model: modelId,
            contents: userMessage,
            config: {
                systemInstruction: systemPrompt,
                maxOutputTokens: 100, // Short responses
            },
        });

        return response.text || "...";
    } catch (error) {
        console.error("Agent failed to respond:", error);
        return "*grunts unintelligibly* (The spirits are silent...)";
    }
};

export const generateAgentThought = async (agent: Agent, context?: { location?: string; activity?: string; nearbyAgents?: string[] }): Promise<string> => {
    try {
        const client = getAI();
        const contextStr = context ? `Context: Location: ${context.location}, Activity: ${context.activity}, Nearby: ${context.nearbyAgents?.join(', ')}` : '';

        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate a short, 1-sentence idle thought (max 10 words) for this RPG character. ${contextStr}`,
            config: {
                systemInstruction: `Character: ${agent.name}, Class: ${agent.class}, Traits: ${agent.traits.join(', ')}.`,
                temperature: 1.2, // High variety
            }
        });
        return response.text || "Hmm...";
    } catch (e) {
        return "Hmm...";
    }
}
