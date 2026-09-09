"use client";

import Editor from "@monaco-editor/react";

interface MonacoEditorProps {
  language: string;

  value: string;

  onChange: (value: string) => void;

  readOnly?: boolean;
}

export default function MonacoEditor({
  language,
  value,
  onChange,
  readOnly = false,
}: MonacoEditorProps) {
  return (
    <div className="h-full overflow-hidden rounded-xl border">
      <Editor
        height="100%"
        language={language}
        value={value}
        theme="vs-dark"
        onChange={(newValue) =>
          onChange(newValue ?? "")
        }
        options={{
          fontSize: 15,

          minimap: {
            enabled: false,
          },

          automaticLayout: true,

          readOnly,

          scrollBeyondLastLine: false,

          tabSize: 4,

          insertSpaces: true,

          wordWrap: "off",

          lineNumbers: "on",

          folding: true,

          bracketPairColorization: {
            enabled: true,
          },

          suggestOnTriggerCharacters: true,

          quickSuggestions: true,
        }}
      />
    </div>
  );
}