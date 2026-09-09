"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import "./assessments.css";

type AssessmentStatus =
  | "DRAFT"
  | "IN_REVIEW"
  | "APPROVED"
  | "PUBLISHED"
  | "ARCHIVED";

interface Assessment {
  id: string;
  code: string;
  title: string;

  type: string;
  technology: string;
  difficulty: string;

  questions: number;
  marks: number;
  duration: number;

  status: AssessmentStatus;

  updatedAt: string;
}

const SAMPLE_ASSESSMENTS: Assessment[] = [
  {
    id: "assessment-001",
    code: "C-FUND-L1-001",

    title:
      "C Programming Fundamentals - Level 1",

    type: "Coding Assessment",

    technology: "C",

    difficulty: "Beginner",

    questions: 10,

    marks: 100,

    duration: 60,

    status: "DRAFT",

    updatedAt: "02 Sep 2026",
  },

  {
    id: "assessment-002",
    code: "C-ARRAY-001",

    title:
      "C Arrays and Functions Assessment",

    type: "Coding Assessment",

    technology: "C",

    difficulty: "Intermediate",

    questions: 15,

    marks: 100,

    duration: 75,

    status: "IN_REVIEW",

    updatedAt: "01 Sep 2026",
  },

  {
    id: "assessment-003",
    code: "C-SCREEN-001",

    title:
      "C Developer Screening Assessment",

    type: "Screening",

    technology: "C",

    difficulty: "Intermediate",

    questions: 20,

    marks: 100,

    duration: 90,

    status: "PUBLISHED",

    updatedAt: "31 Aug 2026",
  },

  {
    id: "assessment-004",
    code: "C-ADV-001",

    title:
      "Advanced C Programming Assessment",

    type: "Skill Assessment",

    technology: "C",

    difficulty: "Advanced",

    questions: 12,

    marks: 120,

    duration: 90,

    status: "APPROVED",

    updatedAt: "30 Aug 2026",
  },
];

export default function AssessmentsPage() {
  const router = useRouter();

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("ALL");

  const [type, setType] =
    useState("ALL");

  const [technology, setTechnology] =
    useState("ALL");

  const [difficulty, setDifficulty] =
    useState("ALL");

  const filteredAssessments =
    useMemo(() => {
      return SAMPLE_ASSESSMENTS.filter(
        (assessment) => {
          const searchValue =
            search.toLowerCase();

          const matchesSearch =
            assessment.title
              .toLowerCase()
              .includes(searchValue) ||
            assessment.code
              .toLowerCase()
              .includes(searchValue);

          const matchesStatus =
            status === "ALL" ||
            assessment.status === status;

          const matchesType =
            type === "ALL" ||
            assessment.type === type;

          const matchesTechnology =
            technology === "ALL" ||
            assessment.technology ===
              technology;

          const matchesDifficulty =
            difficulty === "ALL" ||
            assessment.difficulty ===
              difficulty;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesType &&
            matchesTechnology &&
            matchesDifficulty
          );
        },
      );
    }, [
      search,
      status,
      type,
      technology,
      difficulty,
    ]);

  const totalAssessments =
    SAMPLE_ASSESSMENTS.length;

  const draftCount =
    SAMPLE_ASSESSMENTS.filter(
      (assessment) =>
        assessment.status === "DRAFT",
    ).length;

  const reviewCount =
    SAMPLE_ASSESSMENTS.filter(
      (assessment) =>
        assessment.status ===
        "IN_REVIEW",
    ).length;

  const publishedCount =
    SAMPLE_ASSESSMENTS.filter(
      (assessment) =>
        assessment.status ===
        "PUBLISHED",
    ).length;

  function createAssessment() {
    router.push(
      "/assessments/create",
    );
  }

  function getStatusClass(
    assessmentStatus:
      AssessmentStatus,
  ) {
    switch (
      assessmentStatus
    ) {
      case "DRAFT":
        return "status-draft";

      case "IN_REVIEW":
        return "status-review";

      case "APPROVED":
        return "status-approved";

      case "PUBLISHED":
        return "status-published";

      case "ARCHIVED":
        return "status-archived";

      default:
        return "";
    }
  }

  function formatStatus(
    assessmentStatus:
      AssessmentStatus,
  ) {
    return assessmentStatus
      .replaceAll("_", " ");
  }

  return (
    <main className="assessment-page">

      <div className="assessment-container">

        {/* HEADER */}

        <header className="assessment-header">

          <div>

            <h1>
              Assessments
            </h1>

            <p>
              Create, manage,
              review and publish
              assessments for learners.
            </p>

          </div>

          <button
            type="button"
            className=
              "create-assessment-button"
            onClick={
              createAssessment
            }
          >
            + Create Assessment
          </button>

        </header>

        {/* SUMMARY */}

        <section className="summary-grid">

          <SummaryCard
            label="Total Assessments"
            value={totalAssessments}
          />

          <SummaryCard
            label="Draft"
            value={draftCount}
          />

          <SummaryCard
            label="In Review"
            value={reviewCount}
          />

          <SummaryCard
            label="Published"
            value={publishedCount}
          />

        </section>

        {/* FILTERS */}

        <section
          className=
            "assessment-filter-card"
        >

          <div
            className=
              "assessment-filter-grid"
          >

            <input
              className=
                "assessment-input"
              type="text"
              placeholder=
                "Search assessment name or code..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
            />

            <select
              className=
                "assessment-select"
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value,
                )
              }
            >

              <option value="ALL">
                All Status
              </option>

              <option value="DRAFT">
                Draft
              </option>

              <option value="IN_REVIEW">
                In Review
              </option>

              <option value="APPROVED">
                Approved
              </option>

              <option value="PUBLISHED">
                Published
              </option>

              <option value="ARCHIVED">
                Archived
              </option>

            </select>

            <select
              className=
                "assessment-select"
              value={type}
              onChange={(event) =>
                setType(
                  event.target.value,
                )
              }
            >

              <option value="ALL">
                All Types
              </option>

              <option
                value="Coding Assessment"
              >
                Coding Assessment
              </option>

              <option
                value="Skill Assessment"
              >
                Skill Assessment
              </option>

              <option value="Screening">
                Screening
              </option>

            </select>

            <select
              className=
                "assessment-select"
              value={technology}
              onChange={(event) =>
                setTechnology(
                  event.target.value,
                )
              }
            >

              <option value="ALL">
                All Technologies
              </option>

              <option value="C">
                C
              </option>

            </select>

            <select
              className=
                "assessment-select"
              value={difficulty}
              onChange={(event) =>
                setDifficulty(
                  event.target.value,
                )
              }
            >

              <option value="ALL">
                All Difficulty
              </option>

              <option
                value="Beginner"
              >
                Beginner
              </option>

              <option
                value="Intermediate"
              >
                Intermediate
              </option>

              <option
                value="Advanced"
              >
                Advanced
              </option>

            </select>

          </div>

        </section>

        {/* TABLE */}

        <section
          className=
            "assessment-table-card"
        >

          <table
            className=
              "assessment-table"
          >

            <thead>

              <tr>
                <th>
                  Assessment
                </th>

                <th>
                  Type
                </th>

                <th>
                  Technology
                </th>

                <th>
                  Difficulty
                </th>

                <th>
                  Questions
                </th>

                <th>
                  Marks
                </th>

                <th>
                  Duration
                </th>

                <th>
                  Status
                </th>

                <th>
                  Updated
                </th>

                <th>
                  Action
                </th>
              </tr>

            </thead>

            <tbody>

              {filteredAssessments.map(
                (assessment) => (
                  <tr
                    key={
                      assessment.id
                    }
                  >

                    <td>

                      <span
                        className=
                          "assessment-name"
                      >
                        {
                          assessment.title
                        }
                      </span>

                      <span
                        className=
                          "assessment-code"
                      >
                        {
                          assessment.code
                        }
                      </span>

                    </td>

                    <td>
                      {
                        assessment.type
                      }
                    </td>

                    <td>
                      {
                        assessment
                          .technology
                      }
                    </td>

                    <td>
                      {
                        assessment
                          .difficulty
                      }
                    </td>

                    <td>
                      {
                        assessment
                          .questions
                      }
                    </td>

                    <td>
                      {
                        assessment
                          .marks
                      }
                    </td>

                    <td>
                      {
                        assessment
                          .duration
                      }{" "}
                      min
                    </td>

                    <td>

                      <span
                        className={`status-badge ${getStatusClass(
                          assessment
                            .status,
                        )}`}
                      >
                        {formatStatus(
                          assessment
                            .status,
                        )}
                      </span>

                    </td>

                    <td>
                      {
                        assessment
                          .updatedAt
                      }
                    </td>

                    <td>

                      <button
                        type="button"
                        className=
                          "assessment-action"
                      >
                        View
                      </button>

                    </td>

                  </tr>
                ),
              )}

            </tbody>

          </table>

          {
            filteredAssessments.length ===
              0 && (
              <div
                className=
                  "empty-state"
              >
                No assessments
                match the selected
                filters.
              </div>
            )
          }

        </section>

      </div>

    </main>
  );
}

interface SummaryCardProps {
  label: string;
  value: number;
}

function SummaryCard({
  label,
  value,
}: SummaryCardProps) {
  return (
    <div className="summary-card">

      <span
        className="summary-label"
      >
        {label}
      </span>

      <span
        className="summary-value"
      >
        {value}
      </span>

    </div>
  );
}