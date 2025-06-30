import React from "react";
import ExampleDataEditor from "./ExampleDataEditor";
import TemplateSectionsEditor from "./TemplateSectionsEditor";
import type { Template } from "../types";

interface TemplateEditorProps {
  template: {
    id: string;
    sections: { [key: string]: string };
    exampleData?: string;
    title: string;
  };
  onUpdate: (updatedTemplate: Template) => void;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({
  template,
  onUpdate,
}) => {
  const handleExampleDataChange = (value: string) => {
    onUpdate({ ...template, exampleData: value });
  };

  const handleSectionChange = (sectionId: string, value: string) => {
    onUpdate({
      ...template,
      sections: {
        ...template.sections,
        [sectionId]: value,
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <TemplateSectionsEditor
        sections={template.sections}
        onSectionChange={handleSectionChange}
        templateTitle={template.title}
      />
      <ExampleDataEditor
        exampleData={template.exampleData || ""}
        onExampleDataChange={handleExampleDataChange}
      />
    </div>
  );
};

export default TemplateEditor;
