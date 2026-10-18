import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
const context = vm.createContext({ window: {} });
for (const file of ['lessons.js', 'bank.js', 'quiz-core.js']) vm.runInContext(await readFile(new URL('../dist/' + file, import.meta.url), 'utf8'), context, { filename: file });
const { STUDY_LESSONS: lessons, STUDY_BANK: bank, StudyCore: core } = context.window;
assert(lessons.length >= 20, 'Complete lessons required');
assert(bank.facts.length >= 55, 'Fact coverage required');
assert(bank.questions.length >= 30, 'Full exam pool required');
assert.equal(bank.labs.length, 6);
for (const [name, list] of Object.entries({ lessons, facts: bank.facts, questions: bank.questions, labs: bank.labs })) {
  assert.equal(new Set(list.map(item => item.id)).size, list.length, `${name} IDs must be unique`);
  assert(!/[A-Z]:[\\/]|file:\/\/|sirikanya|source_repository_credential/.test(JSON.stringify(list)), `${name} must not contain local/private paths`);
}
for (const lesson of lessons) {
  assert(lesson.html.length > 300, lesson.id + ' is too short');
  assert(!/<script\b|\sonclick\s*=|\sonerror\s*=/i.test(lesson.html), lesson.id + ' has active markup');
}
for (const question of bank.questions) {
  assert.equal(question.options.length, 4, question.id);
  const correct = question.options.flatMap((option, index) => option.correct ? [index] : []);
  assert(correct.length >= 1 && correct.length <= 3, question.id);
  assert(question.options.every(option => typeof option.correct === 'boolean' && option.why?.length > 5), question.id + ' missing reasoning');
  assert(core.gradeSelection(question, correct).correct, question.id + ' exact set');
  assert(!core.gradeSelection(question, []).correct, question.id + ' empty answer');
  assert(!core.gradeSelection(question, correct.slice(1)).correct, question.id + ' missing answer');
  const wrong = question.options.findIndex(option => !option.correct);
  assert(!core.gradeSelection(question, [...correct, wrong]).correct, question.id + ' extra answer');
  assert(!core.gradeSelection(question, [wrong]).correct, question.id + ' wrong answer');
}
// A mixed attempt must keep unanswered questions in the denominator.
const sample = bank.questions.slice(0, 3);
const answers = { [sample[0].id]: sample[0].options.flatMap((o, i) => o.correct ? [i] : []) };
const result = core.summarize(sample, answers);
assert.equal(result.correct, 1);
assert.equal(result.total, 3);
assert.equal(result.percent, 33);
for (const lab of bank.labs) assert(lab.requirements.length && lab.hints.length && lab.checks.length && lab.solution.length > 100, lab.id);
console.log(JSON.stringify({ status: 'passed', lessons: lessons.length, facts: bank.facts.length, questions: bank.questions.length, labs: bank.labs.length, scoring: 'Exact set only; missing, extra, empty and wrong choices score zero' }));
