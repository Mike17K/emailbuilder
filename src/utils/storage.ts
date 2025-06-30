import type { Template, Settings } from "../types";

const defaultTemplate: Template = {
  id: Date.now().toString(),
  title: "Default Template Title",
  sections: {
    title: "Default Title",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
        .header { background-color: #007bff; color: #ffffff; padding: 10px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; line-height: 1.6; color: #333333; }
        .footer { text-align: center; padding: 10px 20px; font-size: 12px; color: #777777; border-top: 1px solid #eeeeee; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome, {{customer.name}}!</h1>
        </div>
        <div class="content">
            <p>Thank you for your recent purchase of <strong>{{order.product}}</strong>. Your order number is <strong>{{order.number}}</strong>.</p>
            <p>We appreciate your business and hope you enjoy your new product.</p>
            <p>If you have any questions, please don't hesitate to contact our support team.</p>
        </div>
        <div class="footer">
            <p>&copy; {{year}} Your Company. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`,
    "main-content": "This section is now for general text content.",
    code: "// Default code snippet",
  },
  exampleData: JSON.stringify(
    {
      customer: { name: "John Doe" },
      order: { number: 12345, product: "Widget" },
      year: new Date().getFullYear(),
    },
    null,
    2
  ),
};

const defaultSettings: Settings = {
  geminiApiKey: "",
  geminiModel: "gemini-pro", // Default Gemini model
  systemPrompt: "You are an AI assistant that helps create email templates. When asked to update content, respond with a JSON object containing 'updates' where keys are section IDs (e.g., 'title', 'main-content', 'code') and values are the new content. You can also include a 'chatResponse' for a conversational reply. Example: { \"updates\": { \"title\": \"New Title\", \"main-content\": \"Updated content\" }, \"chatResponse\": \"I've updated the template for you.\" }",
  thoughtProcessPrompt: "",
  exampleTemplate: "",
  persistApiKey: false,
};

export const StorageService = {
  saveTemplates: (templates: Template[]): void => localStorage.setItem("templates", JSON.stringify(templates)),
  loadTemplates: (): Template[] => {
    const storedTemplates = localStorage.getItem("templates");
    return storedTemplates ? JSON.parse(storedTemplates) : [defaultTemplate];
  },
  saveSettings: (settings: Settings): void => {
    const settingsToSave = { ...settings };
    if (!settings.persistApiKey) {
      settingsToSave.geminiApiKey = ""; // Do not persist API key if checkbox is unchecked
    }
    localStorage.setItem("settings", JSON.stringify(settingsToSave));
  },
  loadSettings: (): Settings => {
    const storedSettings = localStorage.getItem("settings");
    const loadedSettings: Settings = storedSettings ? JSON.parse(storedSettings) : defaultSettings;
    // Ensure API key is not loaded if it was not persisted
    if (!loadedSettings.persistApiKey) {
      loadedSettings.geminiApiKey = "";
    }
    return loadedSettings;
  }
};
