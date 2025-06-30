import React from "react";

interface ExampleDataEditorProps {
  exampleData: string;
  onExampleDataChange: (value: string) => void;
}

const ExampleDataEditor: React.FC<ExampleDataEditorProps> = ({
  exampleData,
  onExampleDataChange,
}) => {
  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Example Data (JSON)</h2>
      <textarea
        className="w-full p-2 border rounded"
        value={exampleData}
        onChange={(e) => onExampleDataChange(e.target.value)}
        rows={10}
      />
    </div>
  );
};

export default ExampleDataEditor;
