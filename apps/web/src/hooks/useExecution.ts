"use client";

import { useState } from "react";

import {
  ExecutionResult,
  RunCodeRequest,
  ValidateCodeRequest,
  ValidationResult,
} from "@/types/execution";

import {
  runCode,
  validateCode,
} from "@/services/execution.service";

export function useExecution() {
  const [running, setRunning] = useState(false);

  const [validating, setValidating] =
    useState(false);

  const [result, setResult] =
    useState<ExecutionResult | null>(null);

  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  async function execute(request: RunCodeRequest) {
    try {
      setRunning(true);
      setError(null);

      const response = await runCode(request);

      setResult(response);

      return response;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Execution failed.";

      setError(message);

      throw err;
    } finally {
      setRunning(false);
    }
  }

  async function validate(
    request: ValidateCodeRequest,
  ) {
    try {
      setValidating(true);
      setError(null);

      const response =
        await validateCode(request);

      setValidationResult(response);

      return response;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Validation failed.";

      setError(message);

      throw err;
    } finally {
      setValidating(false);
    }
  }

  function clearResult() {
    setResult(null);
    setValidationResult(null);
    setError(null);
  }

  return {
    running,
    validating,
    result,
    validationResult,
    error,
    execute,
    validate,
    clearResult,
  };
}