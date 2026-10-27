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

// 2. Teste da integridade dos problemas pedagógicos e separação comum x específico
console.log('--- 2. Testando separação: Básico com o Professor vs Específicos com o Grupo ---');
assert.strictEqual(PROBLEMS_DATA.length, 4, 'Devem existir exatamente 4 problemas');
assert.strictEqual(COMMON_SPREADSHEET_TOOLS.length, 4, 'Devem existir 4 ferramentas básicas comuns');
assert.strictEqual(COMMON_LEARNING_OBJECTIVES.length, 4, 'Devem existir 4 metas comuns com o professor');

PROBLEMS_DATA.forEach((problem) => {
  const common = problem.learningObjectives.filter((o) => o.scope === 'comum');
  const specific = problem.learningObjectives.filter((o) => o.scope === 'especifico');
  assert.strictEqual(common.length, 4, `Problema ${problem.number} deve ter 4 metas comuns`);
  assert.strictEqual(specific.length, 3, `Problema ${problem.number} deve ter 3 metas específicas`);
  assert.strictEqual(problem.learningObjectives.length, 7, `Problema ${problem.number} deve ter total de 7 metas`);
  assert.strictEqual(problem.commonTools.length, 4);
  assert.strictEqual(problem.specificTools.length, 3);
});
console.log('✓ Todas as 4 missões possuem a divisão exata entre fundamentos comuns e metas do grupo!');

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
assert.strictEqual(calculateActivityStatus(null, 0, 7), 'nao_iniciada');
assert.strictEqual(calculateActivityStatus(1, 0, 7), 'em_andamento');
assert.strictEqual(calculateActivityStatus(1, 4, 7), 'em_andamento');
assert.strictEqual(calculateActivityStatus(1, 7, 7), 'concluida');
console.log('✓ Transições de status validadas!');

console.log('\n=============================================');
console.log(' TODOS OS TESTES UNITÁRIOS FORAM APROVADOS! ');
console.log('=============================================\n');
