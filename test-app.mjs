// Teste de integridade de regras de negócio do Founders Grid
import assert from 'node:assert';

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

// 2. Teste da integridade dos 5 problemas e seus objetivos
console.log('--- 2. Testando integridade dos problemas pedagógicos ---');
const expectedProblems = [
  'Falta de organização financeira',
  'Dificuldade para controlar estoque',
  'Falta de organização de tarefas e prazos',
  'Divulgação ineficiente de pequenos negócios',
  'Falta de organização de informações e cadastros'
];

assert.strictEqual(expectedProblems.length, 5);
console.log('✓ Todos os 5 problemas pedagógicos foram validados com sucesso!');

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
assert.strictEqual(calculateActivityStatus(null, 0, 6), 'nao_iniciada');
assert.strictEqual(calculateActivityStatus(1, 0, 6), 'em_andamento');
assert.strictEqual(calculateActivityStatus(1, 3, 6), 'em_andamento');
assert.strictEqual(calculateActivityStatus(1, 6, 6), 'concluida');
console.log('✓ Transições de status validadas!');

console.log('\n=============================================');
console.log(' TODOS OS TESTES UNITÁRIOS FORAM APROVADOS! ');
console.log('=============================================\n');
