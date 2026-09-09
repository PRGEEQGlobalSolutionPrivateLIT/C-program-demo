interface CodeToolbarProps {
  language: string;

  running: boolean;

  validating?: boolean;

  onRun: () => void;

  onTest?: () => void;

  onReset: () => void;

  onSubmit?: () => void;
}

export default function CodeToolbar({
  language,
  running,
  validating = false,
  onRun,
  onTest,
  onReset,
  onSubmit,
}: CodeToolbarProps) {
  return (
    <div className="flex items-center justify-between border-b px-4 py-3">
      <div>
        <strong>{language}</strong>

        <span className="ml-2 text-sm opacity-60">
          main.c
        </span>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border px-4 py-2"
        >
          Reset
        </button>

        {onTest && (
          <button
            type="button"
            onClick={onTest}
            disabled={validating}
            className="rounded-lg border px-4 py-2"
          >
            {validating
              ? "Testing..."
              : "Run Tests"}
          </button>
        )}

        <button
          type="button"
          onClick={onRun}
          disabled={running}
          className="rounded-lg border px-4 py-2"
        >
          {running
            ? "Running..."
            : "Run Code"}
        </button>

        {onSubmit && (
          <button
            type="button"
            onClick={onSubmit}
            className="rounded-lg border px-4 py-2"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
}