import { ValidationResult } from "@/types/execution";

interface Props {
  result: ValidationResult | null;
}

export default function TestResults({
  result,
}: Props) {
  if (!result) {
    return null;
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex gap-6">
        <strong>
          Passed: {result.passedCount}
        </strong>

        <strong>
          Failed: {result.failedCount}
        </strong>

        <strong>
          Total: {result.totalCount}
        </strong>
      </div>

      <div className="space-y-2">
        {result.testCases.map(
          (testCase, index) => (
            <div
              key={testCase.id}
              className="rounded-lg border p-3"
            >
              <div className="font-semibold">
                Test {index + 1}:{" "}
                {testCase.passed
                  ? "Passed"
                  : "Failed"}
              </div>

              {!testCase.passed && (
                <div className="mt-2 space-y-1 font-mono text-sm">
                  <div>
                    Expected:{" "}
                    {testCase.expectedOutput}
                  </div>

                  <div>
                    Actual:{" "}
                    {testCase.actualOutput}
                  </div>
                </div>
              )}
            </div>
          ),
        )}
      </div>
    </div>
  );
}