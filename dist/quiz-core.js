/* Shared quiz rules: a question earns one point only for the exact correct set. */
(() => {
  'use strict';
  function gradeSelection(question, selected) {
    const expected = question.options.flatMap((option, index) => option.correct ? [index] : []);
    const chosen = [...new Set(selected)].filter(Number.isInteger);
    const missing = expected.filter(index => !chosen.includes(index));
    const extra = chosen.filter(index => !expected.includes(index));
    return { correct: expected.length > 0 && missing.length === 0 && extra.length === 0, expected, missing, extra };
  }
  function summarize(questions, answers) {
    const rows = questions.map(question => ({ question, ...gradeSelection(question, answers[question.id] || []) }));
    const correct = rows.filter(row => row.correct).length;
    const topics = {};
    for (const row of rows) {
      const topic = topics[row.question.topic] ||= { total: 0, correct: 0 };
      topic.total++;
      if (row.correct) topic.correct++;
    }
    return { rows, correct, total: questions.length, percent: questions.length ? Math.round(correct / questions.length * 100) : 0, topics };
  }
  window.StudyCore = { gradeSelection, summarize };
})();
