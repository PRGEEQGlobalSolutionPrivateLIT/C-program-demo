"use client";

import { useParams } from "next/navigation";

import CWorkspace from "@/components/lab/CWorkspace";

const starterCode = `#include <stdio.h>

int main(void)
{
    int a;
    int b;

    scanf("%d %d", &a, &b);

    // Write your solution here

    return 0;
}
`;

const testCases = [
  {
    id: "1",
    input: "10 20",
    expectedOutput: "30",
    hidden: false,
    marks: 2,
  },
  {
    id: "2",
    input: "5 7",
    expectedOutput: "12",
    hidden: false,
    marks: 2,
  },
  {
    id: "3",
    input: "-10 5",
    expectedOutput: "-5",
    hidden: true,
    marks: 3,
  },
  {
    id: "4",
    input: "100 200",
    expectedOutput: "300",
    hidden: true,
    marks: 3,
  },
];

export default function CChallengePage() {
  const params = useParams();

  return (
    <main className="p-6">
      <div className="mb-5">
        <h1 className="text-2xl font-bold">
          Add Two Numbers
        </h1>

        <p className="mt-1">
          Challenge ID:{" "}
          {String(params.challengeId)}
        </p>

        <div className="mt-4 rounded-xl border p-4">
          <h2 className="font-semibold">
            Problem
          </h2>

          <p className="mt-2">
            Read two integers and print their
            sum.
          </p>

          <p className="mt-2">
            Input: two integers separated by a
            space.
          </p>

          <p>
            Output: the sum of the two
            integers.
          </p>
        </div>
      </div>

      <CWorkspace
        initialCode={starterCode}
        testCases={testCases}
      />
    </main>
  );
}