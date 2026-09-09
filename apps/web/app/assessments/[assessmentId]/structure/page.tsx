"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import "./structure.css";

type StructureMode =
  | "NO_SECTIONS"
  | "WITH_SECTIONS";

interface AssessmentDraft {
  id?: string;

  title: string;
  code: string;

  plannedQuestions: number;
  totalMarks: number;
  durationMinutes: number;

  technology?: string;
  difficulty?: string;
}

interface AssessmentSection {
  id: string;

  name: string;
  description: string;

  plannedQuestions: number;
  marks: number;

  timeLimitMinutes: number | null;

  mandatory: boolean;
  randomizeQuestions: boolean;
}

const createEmptySection =
  (
    index: number,
  ): AssessmentSection => ({
    id: crypto.randomUUID(),

    name: `Section ${String.fromCharCode(
      65 + index,
    )}`,

    description: "",

    plannedQuestions: 1,
    marks: 10,

    timeLimitMinutes: null,

    mandatory: true,
    randomizeQuestions: false,
  });

export default function AssessmentStructurePage() {
  const router = useRouter();

  const params = useParams();

  const assessmentId =
    params.assessmentId as string;

  const [assessment, setAssessment] =
    useState<AssessmentDraft | null>(
      null,
    );

  const [mode, setMode] =
    useState<StructureMode>(
      "NO_SECTIONS",
    );

  const [sections, setSections] =
    useState<AssessmentSection[]>(
      [],
    );

  const [errors, setErrors] =
    useState<string[]>([]);

  const [saved, setSaved] =
    useState(false);

  /*
   * Load the temporary assessment
   * created in Step 2.
   */
  useEffect(() => {
    const storedAssessment =
      sessionStorage.getItem(
        "assessmentDraft",
      );

    if (!storedAssessment) {
      return;
    }

    try {
      const parsed =
        JSON.parse(
          storedAssessment,
        ) as AssessmentDraft;

      setAssessment(parsed);
    } catch {
      console.error(
        "Unable to read assessment draft.",
      );
    }

    /*
     * Load any previously saved
     * structure.
     */
    const storedStructure =
      sessionStorage.getItem(
        `assessmentStructure:${assessmentId}`,
      );

    if (!storedStructure) {
      return;
    }

    try {
      const parsedStructure =
        JSON.parse(
          storedStructure,
        );

      if (
        parsedStructure.mode ===
          "NO_SECTIONS" ||
        parsedStructure.mode ===
          "WITH_SECTIONS"
      ) {
        setMode(
          parsedStructure.mode,
        );
      }

      if (
        Array.isArray(
          parsedStructure.sections,
        )
      ) {
        setSections(
          parsedStructure.sections,
        );
      }
    } catch {
      console.error(
        "Unable to read assessment structure.",
      );
    }
  }, [assessmentId]);

  const sectionQuestionTotal =
    useMemo(() => {
      return sections.reduce(
        (
          total,
          section,
        ) =>
          total +
          Number(
            section.plannedQuestions,
          ),
        0,
      );
    }, [sections]);

  const sectionMarksTotal =
    useMemo(() => {
      return sections.reduce(
        (
          total,
          section,
        ) =>
          total +
          Number(section.marks),
        0,
      );
    }, [sections]);

  const sectionTimeTotal =
    useMemo(() => {
      return sections.reduce(
        (
          total,
          section,
        ) =>
          total +
          Number(
            section.timeLimitMinutes ??
              0,
          ),
        0,
      );
    }, [sections]);

  function selectMode(
    selectedMode: StructureMode,
  ) {
    setMode(selectedMode);

    setSaved(false);

    setErrors([]);

    if (
      selectedMode ===
        "WITH_SECTIONS" &&
      sections.length === 0
    ) {
      setSections([
        createEmptySection(0),
      ]);
    }
  }

  function addSection() {
    setSections(
      (current) => [
        ...current,
        createEmptySection(
          current.length,
        ),
      ],
    );

    setSaved(false);
  }

  function updateSection<
    K extends keyof AssessmentSection,
  >(
    sectionId: string,
    field: K,
    value: AssessmentSection[K],
  ) {
    setSections(
      (current) =>
        current.map(
          (section) =>
            section.id ===
            sectionId
              ? {
                  ...section,
                  [field]: value,
                }
              : section,
        ),
    );

    setSaved(false);
  }

  function removeSection(
    sectionId: string,
  ) {
    setSections(
      (current) =>
        current.filter(
          (section) =>
            section.id !==
            sectionId,
        ),
    );

    setSaved(false);
  }

  function moveSection(
    index: number,
    direction:
      | "UP"
      | "DOWN",
  ) {
    const targetIndex =
      direction === "UP"
        ? index - 1
        : index + 1;

    if (
      targetIndex < 0 ||
      targetIndex >=
        sections.length
    ) {
      return;
    }

    const updated = [
      ...sections,
    ];

    const temporary =
      updated[index];

    updated[index] =
      updated[targetIndex];

    updated[targetIndex] =
      temporary;

    setSections(updated);

    setSaved(false);
  }

  function validateStructure() {
    const validationErrors:
      string[] = [];

    if (!assessment) {
      validationErrors.push(
        "Assessment information could not be loaded.",
      );

      setErrors(
        validationErrors,
      );

      return false;
    }

    /*
     * No-section assessments use
     * assessment-level planned totals.
     */
    if (
      mode === "NO_SECTIONS"
    ) {
      setErrors([]);

      return true;
    }

    if (
      sections.length === 0
    ) {
      validationErrors.push(
        "Add at least one section.",
      );
    }

    sections.forEach(
      (
        section,
        index,
      ) => {
        if (
          !section.name.trim()
        ) {
          validationErrors.push(
            `Section ${
              index + 1
            } must have a name.`,
          );
        }

        if (
          section
            .plannedQuestions <=
          0
        ) {
          validationErrors.push(
            `${
              section.name ||
              `Section ${
                index + 1
              }`
            } must contain at least one planned question.`,
          );
        }

        if (
          section.marks <= 0
        ) {
          validationErrors.push(
            `${
              section.name ||
              `Section ${
                index + 1
              }`
            } must contain marks greater than zero.`,
          );
        }

        if (
          section.timeLimitMinutes !==
            null &&
          section.timeLimitMinutes <
            0
        ) {
          validationErrors.push(
            `${
              section.name ||
              `Section ${
                index + 1
              }`
            } has an invalid time limit.`,
          );
        }
      },
    );

    if (
      sectionQuestionTotal !==
      assessment.plannedQuestions
    ) {
      validationErrors.push(
        `Section question total is ${sectionQuestionTotal}, but the assessment plan requires ${assessment.plannedQuestions}.`,
      );
    }

    if (
      sectionMarksTotal !==
      assessment.totalMarks
    ) {
      validationErrors.push(
        `Section marks total is ${sectionMarksTotal}, but the assessment plan requires ${assessment.totalMarks}.`,
      );
    }

    /*
     * Only validate section time
     * when section-specific time
     * limits have actually been used.
     */
    const sectionsWithTime =
      sections.filter(
        (section) =>
          section.timeLimitMinutes !==
            null &&
          section.timeLimitMinutes >
            0,
      );

    if (
      sectionsWithTime.length >
        0 &&
      sectionTimeTotal >
        assessment.durationMinutes
    ) {
      validationErrors.push(
        `Section time limits total ${sectionTimeTotal} minutes, which exceeds the assessment duration of ${assessment.durationMinutes} minutes.`,
      );
    }

    setErrors(
      validationErrors,
    );

    return (
      validationErrors.length ===
      0
    );
  }

  function saveStructure() {
    if (!validateStructure()) {
      return false;
    }

    const structure = {
      assessmentId,

      mode,

      sections:
        mode ===
        "WITH_SECTIONS"
          ? sections
          : [],

      updatedAt:
        new Date().toISOString(),
    };

    sessionStorage.setItem(
      `assessmentStructure:${assessmentId}`,
      JSON.stringify(
        structure,
      ),
    );

    setSaved(true);

    console.log(
      "Assessment Structure:",
      structure,
    );

    return true;
  }

  function saveAndContinue() {
    const success =
      saveStructure();

    if (!success) {
      return;
    }

    router.push(
      `/assessments/${assessmentId}/questions`,
    );
  }

  if (!assessment) {
    return (
      <main className="structure-page">

        <div className="structure-container">

          <div className="missing-assessment-card">

            <h2>
              Assessment not found
            </h2>

            <p>
              The temporary
              assessment information
              could not be loaded.
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={() =>
                router.push(
                  "/assessments/create",
                )
              }
            >
              Return to Create
              Assessment
            </button>

          </div>

        </div>

      </main>
    );
  }

  return (
    <main className="structure-page">

      <div className="structure-container">

        {/* PAGE HEADER */}

        <header className="structure-header">

          <div>

            <button
              type="button"
              className="back-link"
              onClick={() =>
                router.push(
                  "/assessments/create",
                )
              }
            >
              ← Assessment Setup
            </button>

            <h1>
              Assessment Structure
            </h1>

            <p>
              Define how questions
              and marks are organized
              within the assessment.
            </p>

          </div>

          <div className="assessment-reference">

            <span>
              {assessment.code}
            </span>

            <strong>
              {assessment.title}
            </strong>

          </div>

        </header>

        <div className="structure-layout">

          {/* LEFT STEPPER */}

          <aside className="assessment-stepper">

            <Step
              number={1}
              title="Assessment Setup"
              completed
            />

            <Step
              number={2}
              title="Structure"
              active
            />

            <Step
              number={3}
              title="Questions"
            />

            <Step
              number={4}
              title="Scoring"
            />

            <Step
              number={5}
              title="Rules"
            />

            <Step
              number={6}
              title="Security & AI"
            />

            <Step
              number={7}
              title="Schedule"
            />

            <Step
              number={8}
              title="Assignment"
            />

            <Step
              number={9}
              title="Preview"
            />

            <Step
              number={10}
              title="Review & Publish"
            />

          </aside>

          {/* MAIN CONTENT */}

          <section className="structure-card">

            <div className="section-header">

              <div>

                <span className="step-label">
                  STEP 2 OF 10
                </span>

                <h2>
                  Assessment Structure
                </h2>

                <p>
                  Decide whether the
                  assessment uses a
                  single question list
                  or multiple sections.
                </p>

              </div>

              {saved && (
                <span className="saved-badge">
                  Saved
                </span>
              )}

            </div>

            {/* ASSESSMENT PLAN */}

            <section className="plan-summary">

              <PlanSummaryItem
                label="Planned Questions"
                value={
                  assessment.plannedQuestions
                }
              />

              <PlanSummaryItem
                label="Total Marks"
                value={
                  assessment.totalMarks
                }
              />

              <PlanSummaryItem
                label="Duration"
                value={`${assessment.durationMinutes} min`}
              />

            </section>

            {/* MODE */}

            <section className="form-section">

              <h3>
                Structure Type
              </h3>

              <p className="section-description">
                Choose how questions
                should be organized.
              </p>

              <div className="mode-grid">

                <ModeCard
                  title="No Sections"
                  description="Use one continuous list of questions for the entire assessment."
                  selected={
                    mode ===
                    "NO_SECTIONS"
                  }
                  onClick={() =>
                    selectMode(
                      "NO_SECTIONS",
                    )
                  }
                />

                <ModeCard
                  title="Use Sections"
                  description="Organize questions into sections such as Fundamentals, Coding and Debugging."
                  selected={
                    mode ===
                    "WITH_SECTIONS"
                  }
                  onClick={() =>
                    selectMode(
                      "WITH_SECTIONS",
                    )
                  }
                />

              </div>

            </section>

            {/* NO SECTIONS */}

            {mode ===
              "NO_SECTIONS" && (
              <section className="no-sections-card">

                <div>

                  <h3>
                    Single Question
                    List
                  </h3>

                  <p>
                    All questions will
                    be managed together
                    without section
                    boundaries.
                  </p>

                </div>

                <div className="no-section-values">

                  <span>
                    <strong>
                      {
                        assessment
                          .plannedQuestions
                      }
                    </strong>
                    Questions
                  </span>

                  <span>
                    <strong>
                      {
                        assessment
                          .totalMarks
                      }
                    </strong>
                    Marks
                  </span>

                </div>

              </section>
            )}

            {/* SECTIONS */}

            {mode ===
              "WITH_SECTIONS" && (
              <section className="form-section">

                <div className="section-title-row">

                  <div>

                    <h3>
                      Assessment Sections
                    </h3>

                    <p className="section-description">
                      Define the planned
                      questions and marks
                      for each section.
                    </p>

                  </div>

                  <button
                    type="button"
                    className="add-section-button"
                    onClick={addSection}
                  >
                    + Add Section
                  </button>

                </div>

                <div className="sections-list">

                  {sections.map(
                    (
                      section,
                      index,
                    ) => (
                      <SectionEditor
                        key={
                          section.id
                        }
                        section={
                          section
                        }
                        index={index}
                        sectionCount={
                          sections.length
                        }
                        onUpdate={
                          updateSection
                        }
                        onRemove={
                          removeSection
                        }
                        onMove={
                          moveSection
                        }
                      />
                    ),
                  )}

                </div>

                {/* TOTAL VALIDATION */}

                <div className="totals-card">

                  <div className="totals-header">

                    <h3>
                      Structure Totals
                    </h3>

                    <span>
                      Compared with
                      Assessment Plan
                    </span>

                  </div>

                  <div className="totals-grid">

                    <TotalComparison
                      label="Questions"
                      actual={
                        sectionQuestionTotal
                      }
                      expected={
                        assessment.plannedQuestions
                      }
                    />

                    <TotalComparison
                      label="Marks"
                      actual={
                        sectionMarksTotal
                      }
                      expected={
                        assessment.totalMarks
                      }
                    />

                    <TotalComparison
                      label="Section Time"
                      actual={
                        sectionTimeTotal
                      }
                      expected={
                        assessment.durationMinutes
                      }
                      optional
                      suffix="min"
                    />

                  </div>

                </div>

              </section>
            )}

            {/* ERRORS */}

            {errors.length >
              0 && (
              <div className="validation-box">

                <strong>
                  Structure requires
                  attention
                </strong>

                <ul>

                  {errors.map(
                    (error) => (
                      <li key={error}>
                        {error}
                      </li>
                    ),
                  )}

                </ul>

              </div>
            )}

            {/* FOOTER */}

            <footer className="structure-footer">

              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  router.push(
                    "/assessments/create",
                  )
                }
              >
                ← Previous
              </button>

              <div className="footer-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={
                    saveStructure
                  }
                >
                  Save Draft
                </button>

                <button
                  type="button"
                  className="primary-button"
                  onClick={
                    saveAndContinue
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

/* -------------------------------------------------- */
/* STEPPER */
/* -------------------------------------------------- */

interface StepProps {
  number: number;
  title: string;
  active?: boolean;
  completed?: boolean;
}

function Step({
  number,
  title,
  active = false,
  completed = false,
}: StepProps) {
  return (
    <div
      className={[
        "step-item",

        active
          ? "step-item-active"
          : "",

        completed
          ? "step-item-completed"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >

      <span className="step-number">

        {completed
          ? "✓"
          : number}

      </span>

      <span>
        {title}
      </span>

    </div>
  );
}

/* -------------------------------------------------- */
/* PLAN SUMMARY */
/* -------------------------------------------------- */

interface PlanSummaryItemProps {
  label: string;
  value:
    | string
    | number;
}

function PlanSummaryItem({
  label,
  value,
}: PlanSummaryItemProps) {
  return (
    <div className="plan-summary-item">

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

    </div>
  );
}

/* -------------------------------------------------- */
/* MODE CARD */
/* -------------------------------------------------- */

interface ModeCardProps {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

function ModeCard({
  title,
  description,
  selected,
  onClick,
}: ModeCardProps) {
  return (
    <button
      type="button"
      className={`mode-card ${
        selected
          ? "mode-card-selected"
          : ""
      }`}
      onClick={onClick}
    >

      <span className="mode-selector">

        {selected
          ? "●"
          : "○"}

      </span>

      <div>

        <strong>
          {title}
        </strong>

        <p>
          {description}
        </p>

      </div>

    </button>
  );
}

/* -------------------------------------------------- */
/* SECTION EDITOR */
/* -------------------------------------------------- */

interface SectionEditorProps {
  section:
    AssessmentSection;

  index: number;

  sectionCount: number;

  onUpdate: <
    K extends
      keyof AssessmentSection,
  >(
    sectionId: string,
    field: K,
    value:
      AssessmentSection[K],
  ) => void;

  onRemove: (
    sectionId: string,
  ) => void;

  onMove: (
    index: number,
    direction:
      | "UP"
      | "DOWN",
  ) => void;
}

function SectionEditor({
  section,
  index,
  sectionCount,
  onUpdate,
  onRemove,
  onMove,
}: SectionEditorProps) {
  return (
    <article className="section-editor">

      <header className="section-editor-header">

        <div>

          <span className="section-index">
            SECTION {index + 1}
          </span>

          <strong>
            {section.name ||
              "Untitled Section"}
          </strong>

        </div>

        <div className="section-actions">

          <button
            type="button"
            disabled={index === 0}
            onClick={() =>
              onMove(
                index,
                "UP",
              )
            }
          >
            ↑
          </button>

          <button
            type="button"
            disabled={
              index ===
              sectionCount - 1
            }
            onClick={() =>
              onMove(
                index,
                "DOWN",
              )
            }
          >
            ↓
          </button>

          <button
            type="button"
            className="remove-section"
            onClick={() =>
              onRemove(
                section.id,
              )
            }
          >
            Remove
          </button>

        </div>

      </header>

      <div className="section-form-grid">

        <div className="field">

          <label>
            Section Name
          </label>

          <input
            type="text"
            placeholder="Example: Fundamentals"
            value={
              section.name
            }
            onChange={(event) =>
              onUpdate(
                section.id,
                "name",
                event.target.value,
              )
            }
          />

        </div>

        <div className="field">

          <label>
            Planned Questions
          </label>

          <input
            type="number"
            min={1}
            value={
              section.plannedQuestions
            }
            onChange={(event) =>
              onUpdate(
                section.id,
                "plannedQuestions",
                Number(
                  event.target.value,
                ),
              )
            }
          />

        </div>

        <div className="field">

          <label>
            Section Marks
          </label>

          <input
            type="number"
            min={1}
            value={
              section.marks
            }
            onChange={(event) =>
              onUpdate(
                section.id,
                "marks",
                Number(
                  event.target.value,
                ),
              )
            }
          />

        </div>

        <div className="field">

          <label>
            Section Time Limit
          </label>

          <div className="input-with-unit">

            <input
              type="number"
              min={0}
              placeholder="Optional"
              value={
                section
                  .timeLimitMinutes ??
                ""
              }
              onChange={(event) =>
                onUpdate(
                  section.id,
                  "timeLimitMinutes",
                  event.target.value
                    ? Number(
                        event.target
                          .value,
                      )
                    : null,
                )
              }
            />

            <span>
              min
            </span>

          </div>

        </div>

        <div className="field full-width">

          <label>
            Section Description /
            Instructions
          </label>

          <textarea
            rows={3}
            placeholder="Optional instructions specific to this section..."
            value={
              section.description
            }
            onChange={(event) =>
              onUpdate(
                section.id,
                "description",
                event.target.value,
              )
            }
          />

        </div>

      </div>

      <div className="section-options">

        <label className="check-option">

          <input
            type="checkbox"
            checked={
              section.mandatory
            }
            onChange={(event) =>
              onUpdate(
                section.id,
                "mandatory",
                event.target.checked,
              )
            }
          />

          Mandatory Section

        </label>

        <label className="check-option">

          <input
            type="checkbox"
            checked={
              section.randomizeQuestions
            }
            onChange={(event) =>
              onUpdate(
                section.id,
                "randomizeQuestions",
                event.target.checked,
              )
            }
          />

          Randomize Questions

        </label>

      </div>

    </article>
  );
}

/* -------------------------------------------------- */
/* TOTAL COMPARISON */
/* -------------------------------------------------- */

interface TotalComparisonProps {
  label: string;

  actual: number;

  expected: number;

  optional?: boolean;

  suffix?: string;
}

function TotalComparison({
  label,
  actual,
  expected,
  optional = false,
  suffix = "",
}: TotalComparisonProps) {
  const matches =
    optional ||
    actual === expected;

  return (
    <div
      className={`total-comparison ${
        matches
          ? "total-match"
          : "total-mismatch"
      }`}
    >

      <span>
        {label}
      </span>

      <strong>
        {actual}
        {suffix
          ? ` ${suffix}`
          : ""}
      </strong>

      <small>

        {optional
          ? `Assessment maximum: ${expected} ${suffix}`
          : `Required: ${expected}${
              suffix
                ? ` ${suffix}`
                : ""
            }`}

      </small>

    </div>
  );
}