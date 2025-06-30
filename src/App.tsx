import React, { useState, useEffect } from "react";
import PreviewPanel from "./components/PreviewPanel";
import ChatInterface from "./components/ChatInterface";
import SettingsPanel from "./components/SettingsPanel";
import TemplateSectionsEditor from "./components/TemplateSectionsEditor";
import ExampleDataEditor from "./components/ExampleDataEditor";
import { StorageService } from "./utils/storage";
import { renderTemplate } from "./utils/templateRenderer";
import { FaBars } from "react-icons/fa";
import type { Template } from "./types";

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

const App: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>(StorageService.load());
  const [currentTemplateId, setCurrentTemplateId] = useState(templates[0].id);
  const [settings, setSettings] = useState({
    apiKey: "",
    systemPrompt:
      "You are a helpful assistant that modifies email templates based on user instructions.",
    thoughtProcessPrompt:
      "Please think step-by-step and provide the updated template sections as a JSON object wrapped in ```json``` markers.",
  });

  useEffect(() => {
    StorageService.save(templates);
  }, [templates]);

  const currentTemplate =
    templates.find((t) => t.id === currentTemplateId) || templates[0];

  const handleNewTemplate = () => {
    const newTemplate = { ...defaultTemplate, id: Date.now().toString() };
    setTemplates([...templates, newTemplate]);
    setCurrentTemplateId(newTemplate.id);
  };

  const handleUpdateTemplate = (updatedTemplate: Template) => {
    setTemplates(
      templates.map((t) => (t.id === currentTemplateId ? updatedTemplate : t))
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
      currentTemplate.sections["main-content"],
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

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
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
                  Template {t.id}
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
              apiKey={settings.apiKey}
              systemPrompt={settings.systemPrompt}
              thoughtProcessPrompt={settings.thoughtProcessPrompt}
              onUpdate={handleUpdateTemplate}
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
