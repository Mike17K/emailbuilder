import React from "react";

interface TemplateSectionsEditorProps {
  sections: { [key: string]: string };
  onSectionChange: (sectionId: string, value: string) => void;
  templateTitle: string;
}

const TemplateSectionsEditor: React.FC<TemplateSectionsEditorProps> = ({
  sections,
  onSectionChange,
}) => {
  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Template Sections</h2>
      {Object.entries(sections).map(([id, content]) => (
        <div key={id} className="mb-4">
          <label className="block font-semibold capitalize">{id}</label>
          {id === "html" ? (
            <textarea
              className="w-full p-2 border rounded min-h-[200px]" // Added min-h for HTML editor
              value={content}
              onChange={(e) => onSectionChange(id, e.target.value)}
              rows={15}
            />
          ) : (
            <textarea
              className="w-full p-2 border rounded"
              value={content}
              onChange={(e) => onSectionChange(id, e.target.value)}
              rows={5}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default TemplateSectionsEditor;
