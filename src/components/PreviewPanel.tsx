import React, { useState, useEffect } from "react";
import { renderTemplate } from "../utils/templateRenderer";
import parse from "html-react-parser";

interface Template {
  id: string;
  sections: { [key: string]: string };
  exampleData?: string;
  title: string;
}

interface PreviewPanelProps {
  template: Template;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ template }) => {
  const [preview, setPreview] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!template.exampleData) {
      setError("No example data provided.");
      setPreview("");
      return;
    }
    try {
      const data = JSON.parse(template.exampleData);
      const rendered = renderTemplate(template.sections["html"], data);
      setPreview(rendered);
      setError(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError("Invalid JSON in example data: " + error.message);
      } else {
        setError("Invalid JSON in example data.");
      }
      setPreview("");
    }
  }, [template]);

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow mt-4">
      <h2 className="text-xl font-bold mb-4">Preview</h2>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="p-2 border rounded bg-white min-h-[200px] overflow-auto">
          {parse(preview)}
        </div>
      )}
    </div>
  );
};

export default PreviewPanel;
