// Teste de integridade de regras de negócio do Founders Grid
import assert from 'node:assert';
import { PROBLEMS_DATA, COMMON_SPREADSHEET_TOOLS, COMMON_LEARNING_OBJECTIVES } from './src/data/problems.ts';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

console.log('--- 1. Testando validação de e-mail ---');
assert.strictEqual(isValidEmail('grupo1@escola.com'), true);
assert.strictEqual(isValidEmail('empresa_202@gmail.com'), true);
assert.strictEqual(isValidEmail('invalido'), false);
assert.strictEqual(isValidEmail('@semusuario.com'), false);
assert.strictEqual(isValidEmail('sem_dominio@'), false);
console.log('✓ Validação de e-mail aprovada!');

// 2. Teste da integridade: Aprendendo o básico vs Agora é com você
console.log('--- 2. Testando: Aprendendo o básico vs Agora é com você ---');
assert.strictEqual(PROBLEMS_DATA.length, 4, 'Devem existir exatamente 4 problemas');
assert.strictEqual(COMMON_SPREADSHEET_TOOLS.length, 6, 'Devem existir 6 ferramentas em Aprendendo o básico');
assert.strictEqual(COMMON_LEARNING_OBJECTIVES.length, 6, 'Devem existir 6 metas em Aprendendo o básico');

// Verifica se inclui 'Introdução ao ONLYOFFICE' e 'Criando uma Planilha'
const hasIntro = COMMON_SPREADSHEET_TOOLS.some((t) => t.category.toLowerCase().includes('onlyoffice'));
const hasCreating = COMMON_SPREADSHEET_TOOLS.some((t) => t.category.toLowerCase().includes('criando uma planilha'));
assert.strictEqual(hasIntro, true, 'Deve conter Introdução ao ONLYOFFICE');
assert.strictEqual(hasCreating, true, 'Deve conter Criando uma Planilha');

PROBLEMS_DATA.forEach((problem) => {
  const common = problem.learningObjectives.filter((o) => o.scope === 'comum');
  const specific = problem.learningObjectives.filter((o) => o.scope === 'especifico');
  assert.strictEqual(common.length, 6, `Problema ${problem.number} deve ter 6 metas em Aprendendo o básico`);
  assert.strictEqual(specific.length, 3, `Problema ${problem.number} deve ter 3 metas em Agora é com você`);
  assert.strictEqual(problem.learningObjectives.length, 9, `Problema ${problem.number} deve ter total de 9 metas`);
  assert.strictEqual(problem.commonTools.length, 6);
  assert.strictEqual(problem.specificTools.length, 3);
});
console.log('✓ Todas as 4 missões possuem a divisão exata entre Aprendendo o básico (6) e Agora é com você (3)!');

// 3. Teste de cálculo de status de conclusão
function calculateActivityStatus(selectedProblemId, completedObjectivesCount, totalObjectivesCount) {
  if (completedObjectivesCount === totalObjectivesCount && totalObjectivesCount > 0) {
    return 'concluida';
  }
  if (selectedProblemId) {
    return 'em_andamento';
  }
  return 'nao_iniciada';
}

console.log('--- 3. Testando transição de status ---');
assert.strictEqual(calculateActivityStatus(null, 0, 9), 'nao_iniciada');
assert.strictEqual(calculateActivityStatus(1, 0, 9), 'em_andamento');
assert.strictEqual(calculateActivityStatus(1, 6, 9), 'em_andamento');
assert.strictEqual(calculateActivityStatus(1, 9, 9), 'concluida');
console.log('✓ Transições de status validadas!');

console.log('\n=============================================');
console.log(' TODOS OS TESTES UNITÁRIOS FORAM APROVADOS! ');
console.log('=============================================\n');
