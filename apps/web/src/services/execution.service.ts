import {
  ExecutionResult,
  RunCodeRequest,
  ValidateCodeRequest,
  ValidationResult,
} from "@/types/execution";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function runCode(
  request: RunCodeRequest,
): Promise<ExecutionResult> {
  const response = await fetch(`${API_URL}/execution/run`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    credentials: "include",

    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const message = await response.text();

    throw new Error(
      message || "Unable to execute code.",
    );
  }

  return response.json();
}

export async function validateCode(
  request: ValidateCodeRequest,
): Promise<ValidationResult> {
  const response = await fetch(
    `${API_URL}/execution/validate`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      credentials: "include",

      body: JSON.stringify(request),
    },
  );

  if (!response.ok) {
    const message = await response.text();

    throw new Error(
      message || "Unable to validate code.",
    );
  }

  return response.json();
}