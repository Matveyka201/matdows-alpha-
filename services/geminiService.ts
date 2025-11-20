import { GoogleGenAI, Chat } from "@google/genai";

let chatSession: Chat | null = null;

const getAI = () => {
  // apiKey is guaranteed to be present by the runtime environment
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const initializeChat = () => {
  const ai = getAI();
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: "You are MatAI, a helpful AI assistant integrated into the Matdows Operating System. You are helpful, concise, and tech-savvy. If the user speaks Russian, reply in Russian.",
    },
  });
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chatSession) {
    initializeChat();
  }
  
  try {
    if (!chatSession) throw new Error("Chat session failed to initialize");
    
    const response = await chatSession.sendMessage({
      message: message
    });

    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error connecting to the Matdows Cloud.";
  }
};

export const generateImage = async (prompt: string): Promise<string | null> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '1:1',
      },
    });
    
    if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes = response.generatedImages[0].image?.imageBytes;
        if (base64ImageBytes) {
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        }
    }
    return null;
  } catch (error) {
    console.error("Gemini Image Gen Error:", error);
    return null;
  }
};