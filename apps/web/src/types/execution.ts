export type ProgrammingLanguage =
  | "c"
  | "cpp"
  | "python"
  | "java"
  | "javascript"
  | "typescript"
  | "csharp"
  | "go";

export type ExecutionStatus =
  | "IDLE"
  | "QUEUED"
  | "COMPILING"
  | "RUNNING"
  | "SUCCESS"
  | "COMPILE_ERROR"
  | "RUNTIME_ERROR"
  | "TIMEOUT"
  | "SYSTEM_ERROR";

export interface RunCodeRequest {
  language: ProgrammingLanguage;
  code: string;
  input?: string;
}

export interface ExecutionResult {
  executionId?: string;

  language: ProgrammingLanguage;

  status: ExecutionStatus;

  stdout: string;
  stderr: string;

  compileOutput?: string;

  exitCode: number | null;

  executionTimeMs?: number;

  memoryUsedKB?: number;
}

export interface CodeTestCase {
  id: string;
  input: string;
  expectedOutput: string;
  hidden?: boolean;
  marks?: number;
}

export interface TestCaseResult {
  id: string;

  passed: boolean;

  input?: string;

  expectedOutput?: string;

  actualOutput?: string;

  executionTimeMs?: number;

  marksAwarded?: number;
}

export interface ValidateCodeRequest {
  language: ProgrammingLanguage;

  code: string;

  testCases: CodeTestCase[];
}

export interface ValidationResult {
  passed: boolean;

  passedCount: number;

  failedCount: number;

  totalCount: number;

  score?: number;

  testCases: TestCaseResult[];
}