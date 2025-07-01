import React from "react";
import type { Settings } from "../types";

interface SettingsPanelProps {
  settings: Settings;
  onUpdate: (updatedSettings: Settings) => void;
}

import { FaKey, FaRobot, FaBrain, FaFileCode } from "react-icons/fa";

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onUpdate,
}) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Settings</h2>
      <div className="mb-6">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="apiKey"
        >
          <FaKey className="inline-block mr-2 text-gray-600" />
          Gemini API Key
        </label>
        <input
          type="password"
          id="geminiApiKey"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
          value={settings.geminiApiKey}
          onChange={(e) => onUpdate({ ...settings, geminiApiKey: e.target.value })}
          placeholder="AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        />
        <div className="mt-2 flex items-center">
          <input
            type="checkbox"
            id="persistApiKey"
            className="mr-2 leading-tight"
            checked={settings.persistApiKey}
            onChange={(e) => onUpdate({ ...settings, persistApiKey: e.target.checked })}
          />
          <label htmlFor="persistApiKey" className="text-sm text-gray-700">
            Persist API Key (stores in local storage)
          </label>
        </div>
      </div>
      <div className="mb-6">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="geminiModel"
        >
          <FaRobot className="inline-block mr-2 text-gray-600" />
          Gemini Model
        </label>
        <select
          id="geminiModel"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
          value={settings.geminiModel}
          onChange={(e) => onUpdate({ ...settings, geminiModel: e.target.value })}
        >
          <option value="gemini-1.5-pro-latest">gemini-1.5-pro-latest</option>
          <option value="gemini-1.5-flash-latest">gemini-1.5-flash-latest</option>
        </select>
      </div>
      <div className="mb-6">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="systemPrompt"
        >
          <FaRobot className="inline-block mr-2 text-gray-600" />
          System Prompt
        </label>
        <textarea
          id="systemPrompt"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
          value={settings.systemPrompt}
          onChange={(e) =>
            onUpdate({ ...settings, systemPrompt: e.target.value })
          }
          rows={4}
          placeholder="You are an AI assistant that helps users create and modify email templates."
        />
      </div>
      <div className="mb-6">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="thoughtProcessPrompt"
        >
          <FaBrain className="inline-block mr-2 text-gray-600" />
          Thought Process Prompt (Optional)
        </label>
        <textarea
          id="thoughtProcessPrompt"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
          value={settings.thoughtProcessPrompt || ""}
          onChange={(e) =>
            onUpdate({ ...settings, thoughtProcessPrompt: e.target.value })
          }
          rows={4}
          placeholder="Please think step-by-step..."
        />
      </div>
      <div className="mb-6">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="exampleTemplate"
        >
          <FaFileCode className="inline-block mr-2 text-gray-600" />
          Example Template for Assistant (Optional)
        </label>
        <textarea
          id="exampleTemplate"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
          value={settings.exampleTemplate || ""}
          onChange={(e) =>
            onUpdate({ ...settings, exampleTemplate: e.target.value })
          }
          rows={6}
          placeholder="Provide an example of a good email template for the AI to learn from..."
        />
      </div>
    </div>
  );
};

export default SettingsPanel;
