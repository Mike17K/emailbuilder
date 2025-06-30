export interface Template {
  id: string;
  sections: { [key: string]: string };
  exampleData?: string;
  title: string;
}

export interface Settings {
  geminiApiKey: string;
  geminiModel: string; // New: To store the selected Gemini model
  systemPrompt: string;
  thoughtProcessPrompt?: string; // Optional
  exampleTemplate?: string; // Optional
  persistApiKey: boolean;
}

export interface AssistantResponse {
  updates: {
    [sectionId: string]: string;
  };
  // The assistant can also provide a chat response
  chatResponse?: string;
}
