import React from "react";

interface Settings {
  apiKey: string;
  systemPrompt: string;
  thoughtProcessPrompt: string;
}

interface SettingsPanelProps {
  settings: Settings;
  onUpdate: (updatedSettings: Settings) => void;
}

import { FaKey, FaRobot, FaBrain } from "react-icons/fa";

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
          OpenAI API Key
        </label>
        <input
          type="password"
          id="apiKey"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
          value={settings.apiKey}
          onChange={(e) => onUpdate({ ...settings, apiKey: e.target.value })}
          placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        />
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
          placeholder="You are a helpful assistant..."
        />
      </div>
      <div className="mb-6">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="thoughtProcessPrompt"
        >
          <FaBrain className="inline-block mr-2 text-gray-600" />
          Thought Process Prompt
        </label>
        <textarea
          id="thoughtProcessPrompt"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
          value={settings.thoughtProcessPrompt}
          onChange={(e) =>
            onUpdate({ ...settings, thoughtProcessPrompt: e.target.value })
          }
          rows={4}
          placeholder="Please think step-by-step..."
        />
      </div>
    </div>
  );
};

export default SettingsPanel;
