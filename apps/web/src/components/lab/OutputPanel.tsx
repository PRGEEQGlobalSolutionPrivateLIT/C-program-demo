interface OutputPanelProps {
  output?: string;

  error?: string;

  status?: string;

  executionTimeMs?: number;
}

export default function OutputPanel({
  output,
  error,
  status,
  executionTimeMs,
}: OutputPanelProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <span className="font-semibold">
          Console
        </span>

        <div className="flex gap-4 text-xs">
          {status && <span>{status}</span>}

          {executionTimeMs !== undefined && (
            <span>
              {executionTimeMs} ms
            </span>
          )}
        </div>
      </div>

      <pre className="min-h-[140px] flex-1 overflow-auto p-4 font-mono text-sm">
        {error
          ? error
          : output || "Output will appear here."}
      </pre>
    </div>
  );
}