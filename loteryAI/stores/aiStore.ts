import { create } from 'zustand';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Combination {
  date: string;
  numbers: number[];
  explanation: string;
}

interface AIState {
  combinations: Combination[];
  generateCombination: () => Promise<void>;
}

// Mock data for when API is not available
const mockCombination = {
  date: new Date().toISOString().split('T')[0],
  numbers: [7, 13, 23, 27, 35, 42],
  explanation: "This combination is based on statistical analysis of previous winning numbers."
};

// Initialize Gemini AI with environment variable
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export const useAIStore = create<AIState>((set) => ({
  combinations: [],
  generateCombination: async () => {
    try {
      // If no API key is configured, use mock data
      if (!genAI) {
        set((state) => ({
          combinations: [mockCombination, ...state.combinations],
        }));
        return;
      }

      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

      const prompt = `Generate a lottery number combination with 6 unique numbers between 1 and 40, sorted in ascending order. Provide a brief explanation based on statistical patterns. Format the response as a JSON object with exactly this structure:
{
  "numbers": [n1, n2, n3, n4, n5, n6],
  "explanation": "explanation text"
}`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      let response;
      try {
        response = JSON.parse(responseText);
        
        // Validate the response structure
        if (!Array.isArray(response.numbers) || 
            response.numbers.length !== 6 || 
            !response.explanation ||
            !response.numbers.every(n => typeof n === 'number' && n >= 1 && n <= 40)) {
          throw new Error('Invalid response format');
        }

        // Sort numbers in ascending order
        response.numbers.sort((a, b) => a - b);
      } catch (parseError) {
        console.error('Failed to parse AI response:', responseText);
        // Fallback to mock data on error
        response = {
          numbers: mockCombination.numbers,
          explanation: mockCombination.explanation
        };
      }

      const newCombination: Combination = {
        date: new Date().toISOString().split('T')[0],
        numbers: response.numbers,
        explanation: response.explanation,
      };

      set((state) => ({
        combinations: [newCombination, ...state.combinations],
      }));
    } catch (error) {
      console.error('Failed to generate AI combination:', error);
      // Fallback to mock data on error
      set((state) => ({
        combinations: [mockCombination, ...state.combinations],
      }));
    }
  },
}));