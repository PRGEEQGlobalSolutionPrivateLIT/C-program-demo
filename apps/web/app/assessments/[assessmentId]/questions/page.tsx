"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import "./questions.css";

type StructureMode =
  | "NO_SECTIONS"
  | "WITH_SECTIONS";

type QuestionType =
  | "CODING"
  | "MCQ"
  | "DEBUGGING"
  | "OUTPUT_PREDICTION"
  | "CODE_REVIEW";

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

interface AssessmentStructure {
  assessmentId: string;
  mode: StructureMode;
  sections: AssessmentSection[];
}

interface AssessmentQuestion {
  id: string;
  questionId: string;
  sectionId: string | null;

  title: string;

  type: QuestionType;

  technology: string;

  difficulty: string;

  marks: number;

  source:
    | "NEW"
    | "QUESTION_BANK"
    | "IMPORT"
    | "AI";

  sequence: number;
}

export default function AssessmentQuestionsPage() {
  const router =
    useRouter();

  const params =
    useParams();

  const assessmentId =
    params.assessmentId as string;

  const [
    assessment,
    setAssessment,
  ] =
    useState<AssessmentDraft | null>(
      null,
    );

  const [
    structure,
    setStructure,
  ] =
    useState<AssessmentStructure | null>(
      null,
    );

  const [
    questions,
    setQuestions,
  ] =
    useState<AssessmentQuestion[]>(
      [],
    );

  const [
    selectedSectionId,
    setSelectedSectionId,
  ] =
    useState<string | null>(
      null,
    );

  const [
    showAddQuestion,
    setShowAddQuestion,
  ] =
    useState(false);

  const [
    errors,
    setErrors,
  ] =
    useState<string[]>(
      [],
    );

  const [
    saved,
    setSaved,
  ] =
    useState(false);

  /*
  ============================================================
  LOAD DATA
  ============================================================
  */

  useEffect(() => {
    const assessmentData =
      sessionStorage.getItem(
        "assessmentDraft",
      );

    if (
      assessmentData
    ) {
      try {
        setAssessment(
          JSON.parse(
            assessmentData,
          ),
        );
      } catch {
        console.error(
          "Unable to load assessment.",
        );
      }
    }

    const structureData =
      sessionStorage.getItem(
        `assessmentStructure:${assessmentId}`,
      );

    if (
      structureData
    ) {
      try {
        const parsedStructure =
          JSON.parse(
            structureData,
          ) as AssessmentStructure;

        setStructure(
          parsedStructure,
        );

        if (
          parsedStructure.mode ===
            "WITH_SECTIONS" &&
          parsedStructure.sections
            .length > 0
        ) {
          setSelectedSectionId(
            parsedStructure
              .sections[0].id,
          );
        }
      } catch {
        console.error(
          "Unable to load assessment structure.",
        );
      }
    }

    const questionData =
      sessionStorage.getItem(
        `assessmentQuestions:${assessmentId}`,
      );

    if (
      questionData
    ) {
      try {
        setQuestions(
          JSON.parse(
            questionData,
          ),
        );
      } catch {
        console.error(
          "Unable to load assessment questions.",
        );
      }
    }
  }, [
    assessmentId,
  ]);

  /*
  ============================================================
  SUMMARY CALCULATIONS
  ============================================================
  */

  const totalAddedQuestions =
    questions.length;

  const totalConfiguredMarks =
    useMemo(
      () =>
        questions.reduce(
          (
            total,
            question,
          ) =>
            total +
            Number(
              question.marks ||
                0,
            ),
          0,
        ),
      [
        questions,
      ],
    );

  const selectedSection =
    structure?.sections.find(
      (section) =>
        section.id ===
        selectedSectionId,
    );

  const visibleQuestions =
    useMemo(
      () => {
        if (
          structure?.mode ===
          "NO_SECTIONS"
        ) {
          return [
            ...questions,
          ]
            .filter(
              (question) =>
                question.sectionId ===
                null,
            )
            .sort(
              (
                a,
                b,
              ) =>
                a.sequence -
                b.sequence,
            );
        }

        return questions
          .filter(
            (question) =>
              question.sectionId ===
              selectedSectionId,
          )
          .sort(
            (
              a,
              b,
            ) =>
              a.sequence -
              b.sequence,
          );
      },
      [
        questions,
        structure,
        selectedSectionId,
      ],
    );

  const selectedPlannedQuestions =
    structure?.mode ===
    "WITH_SECTIONS"
      ? selectedSection
          ?.plannedQuestions ??
        0
      : assessment
          ?.plannedQuestions ??
        0;

  const selectedPlannedMarks =
    structure?.mode ===
    "WITH_SECTIONS"
      ? selectedSection?.marks ??
        0
      : assessment?.totalMarks ??
        0;

  const selectedConfiguredMarks =
    visibleQuestions.reduce(
      (
        total,
        question,
      ) =>
        total +
        Number(
          question.marks ||
            0,
        ),
      0,
    );

  /*
  ============================================================
  SAVE
  ============================================================
  */

  function saveQuestions() {
    sessionStorage.setItem(
      `assessmentQuestions:${assessmentId}`,
      JSON.stringify(
        questions,
      ),
    );

    setSaved(
      true,
    );
  }

  /*
  ============================================================
  VALIDATION
  ============================================================
  */

  function validateQuestions() {
    const validationErrors:
      string[] = [];

    if (
      !assessment
    ) {
      validationErrors.push(
        "Assessment details are missing.",
      );
    }

    if (
      totalAddedQuestions !==
      assessment?.plannedQuestions
    ) {
      validationErrors.push(
        `Assessment requires ${
          assessment
            ?.plannedQuestions ??
          0
        } questions. Currently ${totalAddedQuestions} are configured.`,
      );
    }

    if (
      totalConfiguredMarks !==
      assessment?.totalMarks
    ) {
      validationErrors.push(
        `Assessment requires ${
          assessment
            ?.totalMarks ??
          0
        } marks. Currently ${totalConfiguredMarks} marks are configured.`,
      );
    }

    if (
      structure?.mode ===
      "WITH_SECTIONS"
    ) {
      structure.sections.forEach(
        (section) => {
          const sectionQuestions =
            questions.filter(
              (question) =>
                question.sectionId ===
                section.id,
            );

          const sectionMarks =
            sectionQuestions.reduce(
              (
                total,
                question,
              ) =>
                total +
                Number(
                  question.marks ||
                    0,
                ),
              0,
            );

          if (
            sectionQuestions.length !==
            section.plannedQuestions
          ) {
            validationErrors.push(
              `${section.name}: ${sectionQuestions.length}/${section.plannedQuestions} questions configured.`,
            );
          }

          if (
            sectionMarks !==
            section.marks
          ) {
            validationErrors.push(
              `${section.name}: ${sectionMarks}/${section.marks} marks configured.`,
            );
          }
        },
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

  /*
  ============================================================
  SAVE + CONTINUE
  QUESTIONS -> SCORING & RULES
  ============================================================
  */

  function saveAndContinue() {
    saveQuestions();

    if (
      !validateQuestions()
    ) {
      return;
    }

    router.push(
      `/assessments/${assessmentId}/scoring`,
    );
  }

  /*
  ============================================================
  ADD QUESTION
  ============================================================
  */

  function openAddQuestion() {
    setShowAddQuestion(
      true,
    );

    setErrors(
      [],
    );
  }

  function closeAddQuestion() {
    setShowAddQuestion(
      false,
    );
  }

  /*
  ============================================================
  DIRECT QUESTION TYPE ROUTING
  ============================================================
  */

  function createNewQuestion(
    type: QuestionType,
  ) {
    saveQuestions();

    setShowAddQuestion(
      false,
    );

    const query =
      new URLSearchParams();

    if (
      structure?.mode ===
        "WITH_SECTIONS" &&
      selectedSectionId
    ) {
      query.set(
        "sectionId",
        selectedSectionId,
      );
    }

    switch (
      type
    ) {
      case "CODING":
        router.push(
          `/assessments/${assessmentId}/questions/create/coding${
            query.toString()
              ? `?${query.toString()}`
              : ""
          }`,
        );
        return;

      case "MCQ":
        router.push(
          `/assessments/${assessmentId}/questions/create/mcq${
            query.toString()
              ? `?${query.toString()}`
              : ""
          }`,
        );
        return;

      case "DEBUGGING":
        router.push(
          `/assessments/${assessmentId}/questions/create/debugging${
            query.toString()
              ? `?${query.toString()}`
              : ""
          }`,
        );
        return;

      case "OUTPUT_PREDICTION":
        router.push(
          `/assessments/${assessmentId}/questions/create/output-prediction${
            query.toString()
              ? `?${query.toString()}`
              : ""
          }`,
        );
        return;

      case "CODE_REVIEW":
        router.push(
          `/assessments/${assessmentId}/questions/create/code-review${
            query.toString()
              ? `?${query.toString()}`
              : ""
          }`,
        );
        return;
    }
  }

  /*
  ============================================================
  OTHER QUESTION SOURCES
  ============================================================
  */

  function openQuestionBank() {
    saveQuestions();

    setShowAddQuestion(
      false,
    );

    const query =
      buildSectionQuery();

    router.push(
      `/assessments/${assessmentId}/questions/question-bank${query}`,
    );
  }

  function openImport() {
    saveQuestions();

    setShowAddQuestion(
      false,
    );

    const query =
      buildSectionQuery();

    router.push(
      `/assessments/${assessmentId}/questions/import${query}`,
    );
  }

  function openAiGenerate() {
    saveQuestions();

    setShowAddQuestion(
      false,
    );

    const query =
      buildSectionQuery();

    router.push(
      `/assessments/${assessmentId}/questions/ai-generate${query}`,
    );
  }

  function buildSectionQuery() {
    if (
      structure?.mode ===
        "WITH_SECTIONS" &&
      selectedSectionId
    ) {
      return `?sectionId=${encodeURIComponent(
        selectedSectionId,
      )}`;
    }

    return "";
  }

  /*
  ============================================================
  EDIT
  ============================================================
  */

  function editQuestion(
    question:
      AssessmentQuestion,
  ) {
    saveQuestions();

    const query =
      new URLSearchParams();

    query.set(
      "questionId",
      question.questionId,
    );

    query.set(
      "mode",
      "edit",
    );

    if (
      question.sectionId
    ) {
      query.set(
        "sectionId",
        question.sectionId,
      );
    }

    const suffix =
      `?${query.toString()}`;

    switch (
      question.type
    ) {
      case "CODING":
        router.push(
          `/assessments/${assessmentId}/questions/create/coding${suffix}`,
        );
        return;

      case "MCQ":
        router.push(
          `/assessments/${assessmentId}/questions/create/mcq${suffix}`,
        );
        return;

      case "DEBUGGING":
        router.push(
          `/assessments/${assessmentId}/questions/create/debugging${suffix}`,
        );
        return;

      case "OUTPUT_PREDICTION":
        router.push(
          `/assessments/${assessmentId}/questions/create/output-prediction${suffix}`,
        );
        return;

      case "CODE_REVIEW":
        router.push(
          `/assessments/${assessmentId}/questions/create/code-review${suffix}`,
        );
        return;
    }
  }

  /*
  ============================================================
  MARKS
  ============================================================
  */

  function updateMarks(
    id: string,
    value: number,
  ) {
    const safeValue =
      Number.isFinite(
        value,
      )
        ? Math.max(
            0,
            value,
          )
        : 0;

    setQuestions(
      (current) =>
        current.map(
          (question) =>
            question.id ===
            id
              ? {
                  ...question,
                  marks:
                    safeValue,
                }
              : question,
        ),
    );

    setSaved(
      false,
    );

    setErrors(
      [],
    );
  }

  /*
  ============================================================
  REMOVE
  ============================================================
  */

  function removeQuestion(
    id: string,
  ) {
    setQuestions(
      (current) => {
        const removedQuestion =
          current.find(
            (question) =>
              question.id ===
              id,
          );

        if (
          !removedQuestion
        ) {
          return current;
        }

        const remaining =
          current.filter(
            (question) =>
              question.id !==
              id,
          );

        const affectedGroup =
          remaining
            .filter(
              (question) =>
                question.sectionId ===
                removedQuestion.sectionId,
            )
            .sort(
              (
                a,
                b,
              ) =>
                a.sequence -
                b.sequence,
            );

        const sequenceMap =
          new Map<
            string,
            number
          >();

        affectedGroup.forEach(
          (
            question,
            index,
          ) => {
            sequenceMap.set(
              question.id,
              index + 1,
            );
          },
        );

        return remaining.map(
          (question) => {
            const sequence =
              sequenceMap.get(
                question.id,
              );

            if (
              sequence ===
              undefined
            ) {
              return question;
            }

            return {
              ...question,
              sequence,
            };
          },
        );
      },
    );

    setSaved(
      false,
    );

    setErrors(
      [],
    );
  }

  /*
  ============================================================
  DUPLICATE
  ============================================================
  */

  function duplicateQuestion(
    id: string,
  ) {
    const original =
      questions.find(
        (question) =>
          question.id ===
          id,
      );

    if (
      !original
    ) {
      return;
    }

    const countInGroup =
      questions.filter(
        (question) =>
          question.sectionId ===
          original.sectionId,
      ).length;

    const duplicate:
      AssessmentQuestion = {
      ...original,

      id:
        crypto.randomUUID(),

      questionId:
        `${original.questionId}-COPY-${Date.now()}`,

      title:
        `${original.title} Copy`,

      sequence:
        countInGroup +
        1,
    };

    setQuestions(
      (current) => [
        ...current,
        duplicate,
      ],
    );

    setSaved(
      false,
    );

    setErrors(
      [],
    );
  }

  /*
  ============================================================
  MOVE
  ============================================================
  */

  function moveQuestion(
    id: string,
    direction:
      | "UP"
      | "DOWN",
  ) {
    const selected =
      questions.find(
        (question) =>
          question.id ===
          id,
      );

    if (
      !selected
    ) {
      return;
    }

    const group =
      questions
        .filter(
          (question) =>
            question.sectionId ===
            selected.sectionId,
        )
        .sort(
          (
            a,
            b,
          ) =>
            a.sequence -
            b.sequence,
        );

    const currentIndex =
      group.findIndex(
        (question) =>
          question.id ===
          id,
      );

    const targetIndex =
      direction ===
      "UP"
        ? currentIndex -
          1
        : currentIndex +
          1;

    if (
      targetIndex <
        0 ||
      targetIndex >=
        group.length
    ) {
      return;
    }

    const target =
      group[
        targetIndex
      ];

    setQuestions(
      (current) =>
        current.map(
          (question) => {
            if (
              question.id ===
              selected.id
            ) {
              return {
                ...question,
                sequence:
                  target.sequence,
              };
            }

            if (
              question.id ===
              target.id
            ) {
              return {
                ...question,
                sequence:
                  selected.sequence,
              };
            }

            return question;
          },
        ),
    );

    setSaved(
      false,
    );
  }

  /*
  ============================================================
  MISSING DATA
  ============================================================
  */

  if (
    !assessment ||
    !structure
  ) {
    return (
      <main className="questions-page">

        <div className="questions-container">

          <div className="missing-card">

            <h2>
              Assessment data not found
            </h2>

            <p>
              Complete the assessment
              setup before adding
              questions.
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={() =>
                router.push(
                  "/assessments",
                )
              }
            >
              Return to Assessments
            </button>

          </div>

        </div>

      </main>
    );
  }

  /*
  ============================================================
  UI
  ============================================================
  */

  return (
    <main className="questions-page">

      <div className="questions-container">

        {/* HEADER */}

        <header className="page-header">

          <div>

            <button
              type="button"
              className="back-link"
              onClick={() =>
                router.push(
                  `/assessments/${assessmentId}/create`,
                )
              }
            >
              ← Setup
            </button>

            <span className="step-caption">
              STEP 2 OF 6
            </span>

            <h1>
              Questions
            </h1>

            <p>
              Build the assessment
              question set and configure
              marks.
            </p>

          </div>

          <div className="assessment-chip">

            <span>
              {
                assessment.code
              }
            </span>

            <strong>
              {
                assessment.title
              }
            </strong>

          </div>

        </header>

        {/* SIMPLE STEP NAVIGATION */}

        <section className="assessment-stepper">

          <StepperItem
            number="1"
            label="Setup"
            complete
          />

          <StepperItem
            number="2"
            label="Questions"
            active
          />

          <StepperItem
            number="3"
            label="Scoring & Rules"
          />

          <StepperItem
            number="4"
            label="Delivery"
          />

          <StepperItem
            number="5"
            label="Review"
          />

          <StepperItem
            number="6"
            label="Publish"
          />

        </section>

        {/* SUMMARY */}

        <section className="progress-panel">

          <ProgressMetric
            label="Questions"
            value={`${totalAddedQuestions} / ${assessment.plannedQuestions}`}
            complete={
              totalAddedQuestions ===
              assessment.plannedQuestions
            }
          />

          <ProgressMetric
            label="Marks"
            value={`${totalConfiguredMarks} / ${assessment.totalMarks}`}
            complete={
              totalConfiguredMarks ===
              assessment.totalMarks
            }
          />

          <ProgressMetric
            label="Duration"
            value={`${assessment.durationMinutes} min`}
          />

        </section>

        {/* CONTENT */}

        <div className="builder-layout">

          {/* SECTION NAVIGATION */}

          {structure.mode ===
            "WITH_SECTIONS" && (

            <aside className="builder-sidebar">

              <div className="sidebar-title">

                <span>
                  SECTIONS
                </span>

              </div>

              {structure.sections.map(
                (
                  section,
                ) => {

                  const sectionQuestions =
                    questions.filter(
                      (question) =>
                        question.sectionId ===
                        section.id,
                    );

                  const sectionMarks =
                    sectionQuestions.reduce(
                      (
                        total,
                        question,
                      ) =>
                        total +
                        question.marks,
                      0,
                    );

                  return (
                    <button
                      key={
                        section.id
                      }
                      type="button"
                      className={`section-nav ${
                        selectedSectionId ===
                        section.id
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedSectionId(
                          section.id,
                        )
                      }
                    >

                      <div>

                        <strong>
                          {
                            section.name
                          }
                        </strong>

                        <span>
                          {
                            sectionQuestions.length
                          }
                          {" / "}
                          {
                            section.plannedQuestions
                          }
                          {" questions"}
                        </span>

                      </div>

                      <small>
                        {
                          sectionMarks
                        }
                        {" / "}
                        {
                          section.marks
                        }
                        {" marks"}
                      </small>

                    </button>
                  );
                },
              )}

            </aside>

          )}

          {/* WORKSPACE */}

          <section
            className={`workspace-card ${
              structure.mode ===
              "NO_SECTIONS"
                ? "workspace-full"
                : ""
            }`}
          >

            <div className="workspace-header">

              <div>

                <span className="workspace-label">
                  {
                    structure.mode ===
                    "WITH_SECTIONS"
                      ? "CURRENT SECTION"
                      : "QUESTION SET"
                  }
                </span>

                <h2>
                  {
                    structure.mode ===
                    "WITH_SECTIONS"
                      ? selectedSection
                          ?.name ??
                        "Section"
                      : "Assessment Questions"
                  }
                </h2>

                <p>
                  {
                    selectedPlannedQuestions
                  }
                  {" questions • "}
                  {
                    selectedPlannedMarks
                  }
                  {" marks"}
                </p>

              </div>

              <button
                type="button"
                className="add-question-primary"
                onClick={
                  openAddQuestion
                }
              >
                + Add Question
              </button>

            </div>

            {/* LOCAL SUMMARY */}

            <div className="workspace-progress">

              <div>
                <span>
                  Questions
                </span>

                <strong>
                  {
                    visibleQuestions.length
                  }
                  {" / "}
                  {
                    selectedPlannedQuestions
                  }
                </strong>
              </div>

              <div>
                <span>
                  Marks
                </span>

                <strong>
                  {
                    selectedConfiguredMarks
                  }
                  {" / "}
                  {
                    selectedPlannedMarks
                  }
                </strong>
              </div>

            </div>

            {/* EMPTY STATE */}

            {visibleQuestions.length ===
            0 ? (

              <div className="empty-state">

                <h3>
                  No questions yet
                </h3>

                <p>
                  Add the first question
                  to this assessment.
                </p>

                <button
                  type="button"
                  className="primary-button"
                  onClick={
                    openAddQuestion
                  }
                >
                  + Add Question
                </button>

              </div>

            ) : (

              <div className="question-table">

                <div className="question-table-header">

                  <span>
                    #
                  </span>

                  <span>
                    Question
                  </span>

                  <span>
                    Type
                  </span>

                  <span>
                    Marks
                  </span>

                  <span>
                    Actions
                  </span>

                </div>

                {visibleQuestions.map(
                  (
                    question,
                    index,
                  ) => (

                    <div
                      key={
                        question.id
                      }
                      className="question-row"
                    >

                      <div className="question-number">
                        {
                          index +
                          1
                        }
                      </div>

                      <div className="question-info">

                        <strong>
                          {
                            question.title
                          }
                        </strong>

                        <div className="question-meta">

                          <span>
                            {
                              question.technology
                            }
                          </span>

                          <span>
                            {
                              question.difficulty
                            }
                          </span>

                        </div>

                      </div>

                      <div>

                        <span className="type-badge">
                          {
                            formatType(
                              question.type,
                            )
                          }
                        </span>

                      </div>

                      <div className="marks-control">

                        <input
                          type="number"
                          min={0}
                          value={
                            question.marks
                          }
                          onChange={(event) =>
                            updateMarks(
                              question.id,
                              Number(
                                event
                                  .target
                                  .value,
                              ),
                            )
                          }
                        />

                      </div>

                      <div className="row-actions">

                        <button
                          type="button"
                          onClick={() =>
                            editQuestion(
                              question,
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={
                            index ===
                            0
                          }
                          onClick={() =>
                            moveQuestion(
                              question.id,
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
                            visibleQuestions.length -
                              1
                          }
                          onClick={() =>
                            moveQuestion(
                              question.id,
                              "DOWN",
                            )
                          }
                        >
                          ↓
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            duplicateQuestion(
                              question.id,
                            )
                          }
                        >
                          Duplicate
                        </button>

                        <button
                          type="button"
                          className="danger-action"
                          onClick={() =>
                            removeQuestion(
                              question.id,
                            )
                          }
                        >
                          Remove
                        </button>

                      </div>

                    </div>

                  ),
                )}

              </div>

            )}

          </section>

        </div>

        {/* VALIDATION */}

        {errors.length >
          0 && (

          <div className="validation-panel">

            <strong>
              Complete the question
              configuration before
              continuing.
            </strong>

            <ul>

              {errors.map(
                (
                  error,
                  index,
                ) => (
                  <li
                    key={
                      `${error}-${index}`
                    }
                  >
                    {
                      error
                    }
                  </li>
                ),
              )}

            </ul>

          </div>

        )}

        {/* FOOTER */}

        <footer className="sticky-footer">

          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              router.push(
                `/assessments/${assessmentId}/structure`,
              )
            }
          >
            ← Back
          </button>

          <div className="footer-right">

            {saved && (
              <span className="saved-text">
                Draft saved
              </span>
            )}

            <button
              type="button"
              className="secondary-button"
              onClick={
                saveQuestions
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
              Continue →
            </button>

          </div>

        </footer>

      </div>

      {/* ====================================================
          COMPACT ADD QUESTION MODAL
      ==================================================== */}

      {showAddQuestion && (

        <div
          className="modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeAddQuestion();
            }
          }}
        >

          <div className="add-modal">

            <div className="modal-header">

              <div>

                <span>
                  ADD QUESTION
                </span>

                <h2>
                  Choose question type
                </h2>

                <p>
                  Select a type to start
                  authoring immediately.
                </p>

              </div>

              <button
                type="button"
                className="close-button"
                onClick={
                  closeAddQuestion
                }
              >
                ×
              </button>

            </div>

            {/* PRIMARY TYPES */}

            <div className="modal-section">

              <span className="modal-section-label">
                CREATE NEW
              </span>

              <div className="type-grid compact">

                <QuestionTypeCard
                  title="Coding"
                  description="Programming problem with test cases."
                  onClick={() =>
                    createNewQuestion(
                      "CODING",
                    )
                  }
                />

                <QuestionTypeCard
                  title="MCQ"
                  description="Single-best-answer question."
                  onClick={() =>
                    createNewQuestion(
                      "MCQ",
                    )
                  }
                />

                <QuestionTypeCard
                  title="Debugging"
                  description="Identify and correct code defects."
                  onClick={() =>
                    createNewQuestion(
                      "DEBUGGING",
                    )
                  }
                />

                <QuestionTypeCard
                  title="Output Prediction"
                  description="Predict program output."
                  onClick={() =>
                    createNewQuestion(
                      "OUTPUT_PREDICTION",
                    )
                  }
                />

                <QuestionTypeCard
                  title="Code Review"
                  description="Review code quality or correctness."
                  onClick={() =>
                    createNewQuestion(
                      "CODE_REVIEW",
                    )
                  }
                />

              </div>

            </div>

            {/* OTHER SOURCES */}

            <div className="modal-section">

              <span className="modal-section-label">
                OTHER OPTIONS
              </span>

              <div className="source-actions">

                <button
                  type="button"
                  onClick={
                    openQuestionBank
                  }
                >
                  Question Bank
                </button>

                <button
                  type="button"
                  onClick={
                    openImport
                  }
                >
                  Import
                </button>

                <button
                  type="button"
                  onClick={
                    openAiGenerate
                  }
                >
                  Generate with AI
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}

/*
============================================================
STEPPER ITEM
============================================================
*/

interface StepperItemProps {
  number: string;
  label: string;
  active?: boolean;
  complete?: boolean;
}

function StepperItem({
  number,
  label,
  active = false,
  complete = false,
}: StepperItemProps) {
  return (
    <div
      className={`stepper-item ${
        active
          ? "active"
          : ""
      } ${
        complete
          ? "complete"
          : ""
      }`}
    >

      <span className="step-number">
        {
          complete
            ? "✓"
            : number
        }
      </span>

      <span>
        {
          label
        }
      </span>

    </div>
  );
}

/*
============================================================
PROGRESS METRIC
============================================================
*/

interface ProgressMetricProps {
  label: string;
  value: string;
  complete?: boolean;
}

function ProgressMetric({
  label,
  value,
  complete = false,
}: ProgressMetricProps) {
  return (
    <div
      className={`progress-metric ${
        complete
          ? "progress-complete"
          : ""
      }`}
    >

      <span>
        {
          label
        }
      </span>

      <strong>
        {
          value
        }
      </strong>

    </div>
  );
}

/*
============================================================
QUESTION TYPE CARD
============================================================
*/

interface QuestionTypeCardProps {
  title: string;
  description: string;
  onClick: () => void;
}

function QuestionTypeCard({
  title,
  description,
  onClick,
}: QuestionTypeCardProps) {
  return (
    <button
      type="button"
      className="question-type-card"
      onClick={
        onClick
      }
    >

      <strong>
        {
          title
        }
      </strong>

      <p>
        {
          description
        }
      </p>

    </button>
  );
}

/*
============================================================
FORMATTERS
============================================================
*/

function formatType(
  type:
    QuestionType,
) {
  return type
    .replaceAll(
      "_",
      " ",
    )
    .toLowerCase()
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    );
}