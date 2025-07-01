import React, { useState, useEffect } from "react";
import PreviewPanel from "./components/PreviewPanel";
import ChatInterface from "./components/ChatInterface";
import SettingsPanel from "./components/SettingsPanel";
import TemplateSectionsEditor from "./components/TemplateSectionsEditor";
import ExampleDataEditor from "./components/ExampleDataEditor";
import { StorageService } from "./utils/storage";
import { renderTemplate } from "./utils/templateRenderer";
import { FaBars } from "react-icons/fa";
import type { Template, Settings } from "./types";

const App: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>(
    StorageService.loadTemplates()
  );
  const [currentTemplateId, setCurrentTemplateId] = useState(templates[0].id);
  const [settings, setSettings] = useState<Settings>(
    StorageService.loadSettings()
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    StorageService.saveTemplates(templates);
  }, [templates]);

  useEffect(() => {
    StorageService.saveSettings(settings);
  }, [settings]);

  const currentTemplate =
    templates.find((t) => t.id === currentTemplateId) || templates[0];

  const handleNewTemplate = () => {
    const defaultHtml = `<!DOCTYPE html>
<html>
<head>
  <title>Welcome Email</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
      -webkit-text-size-adjust: none;
      -ms-text-size-adjust: none;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #333333;
    }
    p {
      color: #666666;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      background-color: #007bff;
      color: #ffffff;
      padding: 10px 20px;
      border-radius: 5px;
      text-decoration: none;
      margin-top: 15px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome, {{name}}!</h1>
    <p>Thank you for signing up for our service. We are excited to have you on board.</p>
    <p>Here are some resources to get you started:</p>
    <ul>
      <li><a href="#">Getting Started Guide</a></li>
      <li><a href="#">Our Blog</a></li>
      <li><a href="#">Contact Support</a></li>
    </ul>
    <p>If you have any questions, feel free to reach out to us.</p>
    <a href="#" class="button">Visit Our Website</a>
    <p>Best regards,<br>The Team</p>
  </div>
</body>
</html>`;

    const defaultExampleData = JSON.stringify({ name: "John Doe" }, null, 2);

    const newTemplate: Template = {
      id: Date.now().toString(),
      title: "Welcome Email Template",
      sections: {
        html: defaultHtml,
        code: "", // Initialize code section as empty
      },
      exampleData: defaultExampleData,
    };
    setTemplates([...templates, newTemplate]);
    setCurrentTemplateId(newTemplate.id);
  };

  const handleUpdateTemplate = (updatedTemplate: Template) => {
    setTemplates((prevTemplates) =>
      prevTemplates.map((t) =>
        t.id === updatedTemplate.id ? updatedTemplate : t
      )
    );
  };

  const handleDeleteTemplate = () => {
    if (templates.length === 1) return;
    const newTemplates = templates.filter((t) => t.id !== currentTemplateId);
    setTemplates(newTemplates);
    setCurrentTemplateId(newTemplates[0].id);
  };

  const handleDownload = () => {
    const renderedHtml = renderTemplate(
      currentTemplate.sections["html"] || "", // Use 'html' for the main content
      JSON.parse(currentTemplate.exampleData || "{}")
    );
    const blob = new Blob([renderedHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentTemplate.title
      .replace(/\s+/g, "-")
      .toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleError = (message: string) => {
    setErrorMessage(message);
  };

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Error Modal */}
      {errorMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
            <h3 className="text-xl font-bold text-red-600 mb-4">Error!</h3>
            <p className="text-gray-700 mb-6">{errorMessage}</p>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none"
              onClick={() => setErrorMessage(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Sidebar for Settings */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform ${
          isSettingsOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-20`}
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Settings</h2>
          <SettingsPanel settings={settings} onUpdate={setSettings} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white shadow-md z-10">
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          >
            <FaBars className="h-6 w-6" />
          </button>
          <input
            type="text"
            className="text-xl font-bold text-gray-800 bg-transparent border-none focus:outline-none w-full"
            value={currentTemplate.title}
            onChange={(e) =>
              handleUpdateTemplate({
                ...currentTemplate,
                title: e.target.value,
              })
            }
            placeholder="Template Title"
          />
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 flex flex-col">
          {/* Template Management Buttons */}
          <div className="mb-4 flex space-x-2">
            <select
              className="p-2 border rounded"
              value={currentTemplateId}
              onChange={(e) => setCurrentTemplateId(e.target.value)}
            >
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  Template {t.title || t.id}
                </option>
              ))}
            </select>
            <button
              className="p-2 bg-green-500 text-white rounded"
              onClick={handleNewTemplate}
            >
              New Template
            </button>
            <button
              className="p-2 bg-red-500 text-white rounded"
              onClick={handleDeleteTemplate}
              disabled={templates.length === 1}
            >
              Delete Template
            </button>
            <button
              className="p-2 bg-blue-500 text-white rounded"
              onClick={handleDownload}
            >
              Download
            </button>
          </div>

          {/* Chat Interface */}
          <div className="mb-4 h-1/3">
            {" "}
            {/* Smaller height for chat */}
            <ChatInterface
              template={currentTemplate}
              settings={settings}
              onUpdateTemplate={(updatedTemplate) => {
                // If the AI updates the 'title' section, update the template's top-level title
                if (updatedTemplate.sections.title) {
                  updatedTemplate.title = updatedTemplate.sections.title;
                }
                handleUpdateTemplate(updatedTemplate);
              }}
              onError={handleError}
            />
          </div>

          {/* Main Content Editor and Preview */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold mb-2">
                Main Content (HTML)
              </h3>
              <TemplateSectionsEditor
                sections={{ html: currentTemplate.sections.html || "" }}
                onSectionChange={(id, value) =>
                  handleUpdateTemplate({
                    ...currentTemplate,
                    sections: { ...currentTemplate.sections, [id]: value },
                  })
                }
                templateTitle={currentTemplate.title}
              />
            </div>
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold mb-2">Preview</h3>
              <PreviewPanel template={currentTemplate} />
            </div>
          </div>

          {/* Example Data Editor */}
          <div className="mt-4">
            <ExampleDataEditor
              exampleData={currentTemplate.exampleData || ""}
              onExampleDataChange={(value) =>
                handleUpdateTemplate({
                  ...currentTemplate,
                  exampleData: value,
                })
              }
            />
          </div>

          {/* Code Section at the very bottom */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Code Section</h3>
            <TemplateSectionsEditor
              sections={{ code: currentTemplate.sections.code || "" }}
              onSectionChange={(id, value) =>
                handleUpdateTemplate({
                  ...currentTemplate,
                  sections: { ...currentTemplate.sections, [id]: value },
                })
              }
              templateTitle={currentTemplate.title}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
