import type { StudentAssessmentAttempt } from "@/types";
import { mockAssessments } from "./assessments";
import { getAssessmentQuestionBank } from "./examQuestionBank";

function stringSeed(value: string): number {
  return value.split("").reduce((total, character) => total + character.charCodeAt(0), 0);
}

export function getStudentAssessmentAttempts(
  studentId: string,
  classId: string
): StudentAssessmentAttempt[] {
  const studentSeed = stringSeed(studentId);

  return mockAssessments
    .filter((assessment) => assessment.classId === classId)
    .map((assessment, assessmentIndex) => {
      const questions = getAssessmentQuestionBank(assessment);
      const targetAccuracy = Math.min(
        92,
        58 + (studentSeed % 31) + assessmentIndex * 2
      );
      const answers = questions.map((question, questionIndex) => {
        const answerSeed =
          studentSeed * 31 + assessmentIndex * 101 + questionIndex * 17;
        const correctIndex = question.choices.findIndex(
          (choice) => choice.id === question.correctChoiceId
        );
        const skipped = answerSeed % 41 === 0;
        const correct = !skipped && answerSeed % 100 < targetAccuracy;
        const wrongOffset =
          question.choices.length > 1 ? 1 + (answerSeed % (question.choices.length - 1)) : 0;
        const selectedIndex = correct
          ? correctIndex
          : (correctIndex + wrongOffset) % question.choices.length;

        return {
          questionId: question.id,
          selectedChoiceId: skipped ? null : question.choices[selectedIndex]?.id ?? null,
          timeSpentSeconds: 38 + ((answerSeed * 13) % 61),
        };
      });

      const correctAnswers = answers.filter((answer) => {
        const question = questions.find((item) => item.id === answer.questionId);
        return question?.correctChoiceId === answer.selectedChoiceId;
      }).length;
      const durationSeconds = answers.reduce(
        (total, answer) => total + answer.timeSpentSeconds,
        0
      );

      const startedAt = new Date(`${assessment.date}T16:00:00`);
      const completedAt = new Date(
        startedAt.getTime() + durationSeconds * 1000
      ).toISOString();

      return {
        id: `${assessment.id}-${studentId}`,
        studentId,
        assessmentId: assessment.id,
        startedAt: startedAt.toISOString(),
        completedAt,
        durationSeconds,
        score: answers.length ? Math.round((correctAnswers / answers.length) * 100) : 0,
        correctAnswers,
        totalQuestions: answers.length,
        answers,
      };
    })
    .sort(
      (first, second) =>
        new Date(second.completedAt).getTime() - new Date(first.completedAt).getTime()
    );
}
