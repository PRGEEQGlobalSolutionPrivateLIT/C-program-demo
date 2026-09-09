import CWorkspace from "@/components/lab/CWorkspace";

export default function AssessmentAttemptPage() {
  const starterCode = `#include <stdio.h>

int main(void)
{
    int number;

    scanf("%d", &number);

    // Print square of number

    return 0;
}
`;

  const testCases = [
    {
      id: "1",
      input: "5",
      expectedOutput: "25",
      hidden: false,
      marks: 2,
    },
    {
      id: "2",
      input: "10",
      expectedOutput: "100",
      hidden: true,
      marks: 4,
    },
    {
      id: "3",
      input: "-3",
      expectedOutput: "9",
      hidden: true,
      marks: 4,
    },
  ];

  async function submitCode(
    code: string,
  ) {
    console.log(
      "Submitting assessment:",
      code,
    );

    // Later:
    // POST /assessment-attempts/{id}/submit
  }

  return (
    <main className="p-6">
      <div className="mb-5">
        <h1 className="text-2xl font-bold">
          Coding Assessment
        </h1>

        <p>
          Write a C program that reads an
          integer and prints its square.
        </p>
      </div>

      <CWorkspace
        initialCode={starterCode}
        testCases={testCases}
        onSubmit={submitCode}
      />
    </main>
  );
}