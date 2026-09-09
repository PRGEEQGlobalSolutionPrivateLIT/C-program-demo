"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import "./create-question.css";

type Difficulty =
  | "BEGINNER"
  | "EASY"
  | "MEDIUM"
  | "HARD"
  | "EXPERT";

type QuestionPurpose =
  | "PRACTICE"
  | "ASSESSMENT"
  | "BOTH";

export default function CreateCodingQuestionPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("c");
  const [difficulty, setDifficulty] =
    useState<Difficulty>("EASY");

  const [purpose, setPurpose] =
    useState<QuestionPurpose>("BOTH");

  const [marks, setMarks] = useState(10);
  const [estimatedMinutes, setEstimatedMinutes] =
    useState(10);

  const [version, setVersion] = useState("1.0");

  const [internalCode, setInternalCode] =
    useState("");

  const [validationErrors, setValidationErrors] =
    useState<string[]>([]);

  function validateStep() {
    const errors: string[] = [];

    if (!title.trim()) {
      errors.push("Question title is required.");
    }

    if (title.trim().length < 5) {
      errors.push(
        "Question title must contain at least 5 characters.",
      );
    }

    if (marks <= 0) {
      errors.push(
        "Marks must be greater than zero.",
      );
    }

    if (estimatedMinutes <= 0) {
      errors.push(
        "Estimated solving time must be greater than zero.",
      );
    }

    setValidationErrors(errors);

    return errors.length === 0;
  }

  function saveDraft() {
    if (!validateStep()) {
      return;
    }

    const draft = {
      title,
      language,
      difficulty,
      purpose,
      marks,
      estimatedMinutes,
      version,
      internalCode,
      status: "DRAFT",
    };

    console.log(
      "Question Setup Draft:",
      draft,
    );

    alert(
      "Question setup saved as draft.",
    );
  }

  function continueToNextStep() {
    if (!validateStep()) {
      return;
    }

    const setup = {
      title,
      language,
      difficulty,
      purpose,
      marks,
      estimatedMinutes,
      version,
      internalCode,
    };

    sessionStorage.setItem(
      "codingQuestionSetup",
      JSON.stringify(setup),
    );

    /*
      This route will be created
      in the next development step.
    */

    router.push(
      "/question-bank/coding/create/problem",
    );
  }

  return (
    <main className="create-question-page">

      <div className="create-question-container">

        <header className="create-question-header">

          <div>
            <button
              type="button"
              className="back-button"
              onClick={() =>
                router.push(
                  "/question-bank",
                )
              }
            >
              ← Question Bank
            </button>

            <h1>
              Create Coding Question
            </h1>

            <p>
              Configure the basic identity,
              purpose and classification
              of the coding question.
            </p>
          </div>

          <div className="draft-status">
            Draft
          </div>

        </header>

        <div className="authoring-layout">

          <aside className="authoring-stepper">

            <Step
              number="1"
              label="Question Setup"
              active
            />

            <Step
              number="2"
              label="Problem"
            />

            <Step
              number="3"
              label="Code"
            />

            <Step
              number="4"
              label="Test Cases"
            />

            <Step
              number="5"
              label="Evaluation"
            />

            <Step
              number="6"
              label="Runtime"
            />

            <Step
              number="7"
              label="Skills"
            />

            <Step
              number="8"
              label="AI Policy"
            />

            <Step
              number="9"
              label="Quality Check"
            />

            <Step
              number="10"
              label="Review"
            />

          </aside>

          <section className="authoring-card">

            <div className="section-heading">

              <div>
                <span className="section-label">
                  STEP 1
                </span>

                <h2>
                  Question Setup
                </h2>

                <p>
                  Define how this question
                  will be identified and used.
                </p>
              </div>

            </div>

            {validationErrors.length > 0 && (
              <div className="validation-box">

                <strong>
                  Please correct the following:
                </strong>

                <ul>
                  {validationErrors.map(
                    (error) => (
                      <li key={error}>
                        {error}
                      </li>
                    ),
                  )}
                </ul>

              </div>
            )}

            <div className="form-section">

              <h3>
                Basic Information
              </h3>

              <div className="form-grid">

                <div className="field field-wide">

                  <label htmlFor="title">
                    Question Title
                    <span className="required">
                      *
                    </span>
                  </label>

                  <input
                    id="title"
                    type="text"
                    value={title}
                    maxLength={150}
                    placeholder="Example: Find the Largest Number in an Array"
                    onChange={(event) =>
                      setTitle(
                        event.target.value,
                      )
                    }
                  />

                  <div className="field-meta">

                    <span>
                      Use a clear,
                      learner-friendly title.
                    </span>

                    <span>
                      {title.length}/150
                    </span>

                  </div>

                </div>

                <div className="field">

                  <label htmlFor="language">
                    Technology
                  </label>

                  <select
                    id="language"
                    value={language}
                    onChange={(event) =>
                      setLanguage(
                        event.target.value,
                      )
                    }
                  >

                    <option value="c">
                      C
                    </option>

                  </select>

                </div>

                <div className="field">

                  <label htmlFor="difficulty">
                    Difficulty
                  </label>

                  <select
                    id="difficulty"
                    value={difficulty}
                    onChange={(event) =>
                      setDifficulty(
                        event.target
                          .value as Difficulty,
                      )
                    }
                  >

                    <option value="BEGINNER">
                      Beginner
                    </option>

                    <option value="EASY">
                      Easy
                    </option>

                    <option value="MEDIUM">
                      Medium
                    </option>

                    <option value="HARD">
                      Hard
                    </option>

                    <option value="EXPERT">
                      Expert
                    </option>

                  </select>

                </div>

              </div>

            </div>

            <div className="form-section">

              <h3>
                Usage
              </h3>

              <div className="purpose-options">

                <PurposeCard
                  title="Practice"
                  description="Available for self-paced coding practice."
                  selected={
                    purpose ===
                    "PRACTICE"
                  }
                  onClick={() =>
                    setPurpose(
                      "PRACTICE",
                    )
                  }
                />

                <PurposeCard
                  title="Assessment"
                  description="Available for controlled assessments."
                  selected={
                    purpose ===
                    "ASSESSMENT"
                  }
                  onClick={() =>
                    setPurpose(
                      "ASSESSMENT",
                    )
                  }
                />

                <PurposeCard
                  title="Practice & Assessment"
                  description="Reusable in both learning and assessment scenarios."
                  selected={
                    purpose ===
                    "BOTH"
                  }
                  onClick={() =>
                    setPurpose(
                      "BOTH",
                    )
                  }
                />

              </div>

            </div>

            <div className="form-section">

              <h3>
                Scoring & Planning
              </h3>

              <div className="form-grid">

                <div className="field">

                  <label htmlFor="marks">
                    Default Marks
                  </label>

                  <input
                    id="marks"
                    type="number"
                    min={1}
                    value={marks}
                    onChange={(event) =>
                      setMarks(
                        Number(
                          event.target
                            .value,
                        ),
                      )
                    }
                  />

                </div>

                <div className="field">

                  <label htmlFor="estimatedTime">
                    Estimated Solving Time
                  </label>

                  <div className="input-with-unit">

                    <input
                      id="estimatedTime"
                      type="number"
                      min={1}
                      value={
                        estimatedMinutes
                      }
                      onChange={(event) =>
                        setEstimatedMinutes(
                          Number(
                            event.target
                              .value,
                          ),
                        )
                      }
                    />

                    <span>
                      minutes
                    </span>

                  </div>

                </div>

              </div>

            </div>

            <div className="form-section">

              <h3>
                Question Management
              </h3>

              <div className="form-grid">

                <div className="field">

                  <label htmlFor="internalCode">
                    Internal Question Code
                  </label>

                  <input
                    id="internalCode"
                    type="text"
                    value={internalCode}
                    placeholder="Example: C-ARRAY-001"
                    onChange={(event) =>
                      setInternalCode(
                        event.target.value,
                      )
                    }
                  />

                  <small>
                    Optional internal reference
                    used by your organization.
                  </small>

                </div>

                <div className="field">

                  <label htmlFor="version">
                    Version
                  </label>

                  <input
                    id="version"
                    type="text"
                    value={version}
                    onChange={(event) =>
                      setVersion(
                        event.target.value,
                      )
                    }
                  />

                </div>

              </div>

            </div>

            <footer className="authoring-footer">

              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  router.push(
                    "/question-bank",
                  )
                }
              >
                Cancel
              </button>

              <div className="footer-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={saveDraft}
                >
                  Save Draft
                </button>

                <button
                  type="button"
                  className="primary-button"
                  onClick={
                    continueToNextStep
                  }
                >
                  Save & Continue →
                </button>

              </div>

            </footer>

          </section>

        </div>

      </div>

    </main>
  );
}

interface StepProps {
  number: string;
  label: string;
  active?: boolean;
}

function Step({
  number,
  label,
  active = false,
}: StepProps) {
  return (
    <div
      className={`step ${
        active
          ? "step-active"
          : ""
      }`}
    >
      <span className="step-number">
        {number}
      </span>

      <span>
        {label}
      </span>
    </div>
  );
}

interface PurposeCardProps {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

function PurposeCard({
  title,
  description,
  selected,
  onClick,
}: PurposeCardProps) {
  return (
    <button
      type="button"
      className={`purpose-card ${
        selected
          ? "purpose-card-selected"
          : ""
      }`}
      onClick={onClick}
    >
      <span className="purpose-title">
        {title}
      </span>

      <span className="purpose-description">
        {description}
      </span>
    </button>
  );
}