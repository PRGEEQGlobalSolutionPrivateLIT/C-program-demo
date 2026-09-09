"use client";

interface InputPanelProps {
  value: string;

  onChange: (value: string) => void;
}

export default function InputPanel({
  value,
  onChange,
}: InputPanelProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b px-4 py-2 font-semibold">
        Standard Input
      </div>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder="Enter stdin values here..."
        className="min-h-[120px] flex-1 resize-none bg-transparent p-4 font-mono outline-none"
      />
    </div>
  );
}