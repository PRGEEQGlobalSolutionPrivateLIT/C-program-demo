"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import "./question-bank.css";

type QuestionStatus =
  | "DRAFT"
  | "IN_REVIEW"
  | "APPROVED"
  | "PUBLISHED";

interface Question {
  id: string;
  title: string;
  type: string;
  technology: string;
  difficulty: string;
  marks: number;
  status: QuestionStatus;
  updatedAt: string;
}

const SAMPLE_QUESTIONS: Question[] = [
  {
    id: "Q-C-001",
    title: "Add Two Numbers",
    type: "Coding",
    technology: "C",
    difficulty: "Easy",
    marks: 10,
    status: "DRAFT",
    updatedAt: "02 Sep 2026",
  },
  {
    id: "Q-C-002",
    title: "Find Maximum in an Array",
    type: "Coding",
    technology: "C",
    difficulty: "Medium",
    marks: 20,
    status: "IN_REVIEW",
    updatedAt: "01 Sep 2026",
  },
  {
    id: "Q-C-003",
    title: "Pointer Swap",
    type: "Coding",
    technology: "C",
    difficulty: "Medium",
    marks: 20,
    status: "PUBLISHED",
    updatedAt: "31 Aug 2026",
  },
];

export default function QuestionBankPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [type, setType] = useState("ALL");
  const [technology, setTechnology] = useState("ALL");
  const [difficulty, setDifficulty] = useState("ALL");
  const [status, setStatus] = useState("ALL");

  const filteredQuestions = useMemo(() => {
    return SAMPLE_QUESTIONS.filter((question) => {
      const matchesSearch =
        question.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        question.id
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesType =
        type === "ALL" ||
        question.type === type;

      const matchesTechnology =
        technology === "ALL" ||
        question.technology === technology;

      const matchesDifficulty =
        difficulty === "ALL" ||
        question.difficulty === difficulty;

      const matchesStatus =
        status === "ALL" ||
        question.status === status;

      return (
        matchesSearch &&
        matchesType &&
        matchesTechnology &&
        matchesDifficulty &&
        matchesStatus
      );
    });
  }, [
    search,
    type,
    technology,
    difficulty,
    status,
  ]);

  function createQuestion() {
    router.push(
      "/question-bank/coding/create",
    );
  }

  function getStatusClass(
    questionStatus: QuestionStatus,
  ) {
    switch (questionStatus) {
      case "DRAFT":
        return "status-draft";

      case "IN_REVIEW":
        return "status-review";

      case "APPROVED":
        return "status-approved";

      case "PUBLISHED":
        return "status-published";

      default:
        return "";
    }
  }

  return (
    <main className="question-bank-page">
      <div className="question-bank-container">

        <header className="question-bank-header">
          <div>
            <h1>Question Bank</h1>

            <p>
              Create, review, manage and
              publish assessment questions.
            </p>
          </div>

          <button
            type="button"
            className="create-question-button"
            onClick={createQuestion}
          >
            + Create Question
          </button>
        </header>

        <section className="filter-card">

          <div className="filter-grid">

            <input
              className="filter-input"
              type="text"
              placeholder="Search question title or ID..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

            <select
              className="filter-select"
              value={type}
              onChange={(event) =>
                setType(event.target.value)
              }
            >
              <option value="ALL">
                All Types
              </option>

              <option value="Coding">
                Coding
              </option>
            </select>

            <select
              className="filter-select"
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
              className="filter-select"
              value={difficulty}
              onChange={(event) =>
                setDifficulty(
                  event.target.value,
                )
              }
            >
              <option value="ALL">
                All Difficulties
              </option>

              <option value="Easy">
                Easy
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="Hard">
                Hard
              </option>
            </select>

            <select
              className="filter-select"
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value,
                )
              }
            >
              <option value="ALL">
                All Statuses
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
            </select>

          </div>
        </section>

        <section className="question-table-card">

          <table className="question-table">

            <thead>
              <tr>
                <th>Question</th>
                <th>Type</th>
                <th>Technology</th>
                <th>Difficulty</th>
                <th>Marks</th>
                <th>Status</th>
                <th>Updated</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredQuestions.map(
                (question) => (
                  <tr key={question.id}>

                    <td>
                      <div className="question-title">
                        {question.title}
                      </div>

                      <small>
                        {question.id}
                      </small>
                    </td>

                    <td>
                      {question.type}
                    </td>

                    <td>
                      {question.technology}
                    </td>

                    <td>
                      {question.difficulty}
                    </td>

                    <td>
                      {question.marks}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${getStatusClass(
                          question.status,
                        )}`}
                      >
                        {question.status.replace(
                          "_",
                          " ",
                        )}
                      </span>
                    </td>

                    <td>
                      {question.updatedAt}
                    </td>

                    <td>
                      <button
                        type="button"
                        className="question-action"
                      >
                        View
                      </button>
                    </td>

                  </tr>
                ),
              )}

            </tbody>
          </table>

          {filteredQuestions.length === 0 && (
            <div className="empty-message">
              No questions match the selected
              filters.
            </div>
          )}

        </section>

      </div>
    </main>
  );
}