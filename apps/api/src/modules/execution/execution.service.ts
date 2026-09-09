import {
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";

import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import * as os from "os";
import * as path from "path";
import { spawn } from "child_process";

import { RunCodeDto } from "./dto/run-code.dto.js";
import { ValidateCodeDto } from "./dto/validate-code.dto.js";

interface ProcessResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timedOut: boolean;
  executionTimeMs: number;
}

@Injectable()
export class ExecutionService {
  private readonly imageName =
    "elabs-c-runtime:latest";

  private readonly timeoutMs =
    5000;

  async run(
    dto: RunCodeDto,
  ) {
    const executionId =
      randomUUID();

    const workspaceRoot =
      path.join(
        os.tmpdir(),
        "elabs-executions",
      );

    const workspacePath =
      path.join(
        workspaceRoot,
        executionId,
      );

    await fs.mkdir(
      workspacePath,
      {
        recursive: true,
      },
    );

    const sourcePath =
      path.join(
        workspacePath,
        "main.c",
      );

    try {
      await fs.writeFile(
        sourcePath,
        dto.code,
        "utf8",
      );

      const result =
        await this.executeContainer(
          workspacePath,
          dto.input ?? "",
        );

      let status:
        | "SUCCESS"
        | "COMPILE_ERROR"
        | "RUNTIME_ERROR"
        | "TIMEOUT";

      if (result.timedOut) {
        status = "TIMEOUT";
      } else if (
        result.exitCode === 0
      ) {
        status = "SUCCESS";
      } else if (
        this.looksLikeCompileError(
          result.stderr,
        )
      ) {
        status =
          "COMPILE_ERROR";
      } else {
        status =
          "RUNTIME_ERROR";
      }

      return {
        executionId,
        language:
          dto.language,
        status,
        stdout:
          result.stdout,
        stderr:
          result.stderr,
        exitCode:
          result.exitCode,
        executionTimeMs:
          result.executionTimeMs,
      };
    } catch (error) {
      console.error(
        "Execution failed:",
        error,
      );

      throw new InternalServerErrorException(
        "Code execution failed.",
      );
    } finally {
      await fs.rm(
        workspacePath,
        {
          recursive: true,
          force: true,
        },
      );
    }
  }

  async validate(
    dto: ValidateCodeDto,
  ) {
    const results = [];

    let passedCount = 0;
    let failedCount = 0;
    let score = 0;

    for (
      const testCase
      of dto.testCases
    ) {
      const execution =
        await this.run({
          language:
            dto.language,
          code:
            dto.code,
          input:
            testCase.input,
        });

      const actualOutput =
        this.normalizeOutput(
          execution.stdout,
        );

      const expectedOutput =
        this.normalizeOutput(
          testCase.expectedOutput,
        );

      const passed =
        execution.status ===
          "SUCCESS" &&
        actualOutput ===
          expectedOutput;

      if (passed) {
        passedCount++;

        score +=
          testCase.marks ??
          0;
      } else {
        failedCount++;
      }

      results.push({
        id:
          testCase.id,

        passed,

        input:
          testCase.hidden
            ? undefined
            : testCase.input,

        expectedOutput:
          testCase.hidden
            ? undefined
            : testCase
                .expectedOutput,

        actualOutput:
          testCase.hidden
            ? undefined
            : actualOutput,

        executionTimeMs:
          execution
            .executionTimeMs,

        marksAwarded:
          passed
            ? testCase.marks ??
              0
            : 0,
      });
    }

    return {
      passed:
        failedCount === 0,

      passedCount,

      failedCount,

      totalCount:
        dto.testCases
          .length,

      score,

      testCases:
        results,
    };
  }

  private executeContainer(
    workspacePath: string,
    input: string,
  ): Promise<ProcessResult> {
    return new Promise(
      (
        resolve,
        reject,
      ) => {
        const startTime =
          Date.now();

        const dockerArgs = [
          "run",

          "--rm",

          // IMPORTANT:
          // Keeps Docker STDIN open.
          // Required for scanf(),
          // fgets(), getchar(), etc.
          "-i",

          "--network=none",

          "--cpus=0.5",

          "--memory=256m",

          "--memory-swap=256m",

          "--pids-limit=64",

          "--cap-drop=ALL",

          "--security-opt",
          "no-new-privileges",

          "-v",

          `${workspacePath}:/workspace`,

          this.imageName,

          "run-c",
        ];

        const child =
          spawn(
            "docker",
            dockerArgs,
            {
              shell:
                false,

              windowsHide:
                true,
            },
          );

        let stdout =
          "";

        let stderr =
          "";

        let timedOut =
          false;

        const timeout =
          setTimeout(
            () => {
              timedOut =
                true;

              child.kill();
            },
            this.timeoutMs,
          );

        child.stdout.on(
          "data",
          (data) => {
            stdout +=
              data.toString();
          },
        );

        child.stderr.on(
          "data",
          (data) => {
            stderr +=
              data.toString();
          },
        );

        child.on(
          "error",
          (error) => {
            clearTimeout(
              timeout,
            );

            reject(
              error,
            );
          },
        );

        child.on(
          "close",
          (
            exitCode,
          ) => {
            clearTimeout(
              timeout,
            );

            resolve({
              stdout,

              stderr,

              exitCode,

              timedOut,

              executionTimeMs:
                Date.now() -
                startTime,
            });
          },
        );

        if (input) {
          child.stdin.write(
            input,
          );

          // Add a newline so scanf/fgets
          // behave like normal terminal input.
          if (
            !input.endsWith(
              "\n",
            )
          ) {
            child.stdin.write(
              "\n",
            );
          }
        }

        child.stdin.end();
      },
    );
  }

  private looksLikeCompileError(
    stderr: string,
  ): boolean {
    const text =
      stderr.toLowerCase();

    return (
      text.includes(
        "error:",
      ) ||
      text.includes(
        "undefined reference",
      ) ||
      text.includes(
        "compilation terminated",
      )
    );
  }

  private normalizeOutput(
    value: string,
  ): string {
    return value
      .replace(
        /\r\n/g,
        "\n",
      )
      .trim();
  }
}