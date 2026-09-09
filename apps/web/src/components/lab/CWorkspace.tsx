"use client";

import { useState } from "react";

interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  hidden?: boolean;
  marks?: number;
}

interface CWorkspaceProps {
  initialCode?: string;
  testCases?: TestCase[];
  onSubmit?: (code: string) => void | Promise<void>;
}

export default function CWorkspace({
  initialCode = `#include <stdio.h>

int main(void)
{
    printf("Hello, eLabs!\\n");
    return 0;
}
`,
  testCases = [],
  onSubmit,
}: CWorkspaceProps) {
  const [code, setCode] = useState(initialCode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!onSubmit) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(code);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2>C Programming Workspace</h2>

      <textarea
        value={code}
        onChange={(event) => setCode(event.target.value)}
        rows={20}
        style={{
          width: "100%",
          fontFamily: "monospace",
        }}
      />

      {testCases.length > 0 && (
        <div>
          <h3>Test Cases</h3>

          {testCases
            .filter((testCase) => !testCase.hidden)
            .map((testCase) => (
              <div key={testCase.id}>
                <p>
                  <strong>Input:</strong> {testCase.input}
                </p>

                <p>
                  <strong>Expected Output:</strong>{" "}
                  {testCase.expectedOutput}
                </p>

                {testCase.marks !== undefined && (
                  <p>
                    <strong>Marks:</strong> {testCase.marks}
                  </p>
                )}
              </div>
            ))}
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
}