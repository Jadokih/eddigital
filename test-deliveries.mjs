// Testes unitários das regras da Central de Entregas (Founders Grid)
import assert from 'node:assert';

console.log('=== TESTES DA CENTRAL DE ENTREGAS ===\n');

// 1. Teste de separação de integrantes (split_member_names)
console.log('--- 1. Testando separação de integrantes ---');
function splitMemberNames(text) {
  if (!text) return [];
  const parts = text.split(/\s*(?:[,;\r\n]+|\s[eE]\s)\s*/);
  const seen = new Set();
  const result = [];
  for (const part of parts) {
    const cleaned = part.replace(/\s+/g, ' ').replace(/^[\s.]+|[\s.]+$/g, '');
    if (cleaned && !seen.has(cleaned.toLowerCase())) {
      seen.add(cleaned.toLowerCase());
      result.push(cleaned);
    }
  }
  return result;
}

assert.deepStrictEqual(splitMemberNames('Lívia e Rhyana'), ['Lívia', 'Rhyana']);
assert.deepStrictEqual(
  splitMemberNames('Gustavo Vasconcelos, Marcela Oliveira, Sarah Maria e Vitória Estefane'),
  ['Gustavo Vasconcelos', 'Marcela Oliveira', 'Sarah Maria', 'Vitória Estefane']
);
assert.deepStrictEqual(
  splitMemberNames('Klaus Rafael, Isaque Emanuel, Ezequiel Cristian.'),
  ['Klaus Rafael', 'Isaque Emanuel', 'Ezequiel Cristian']
);
assert.deepStrictEqual(splitMemberNames('Jade Pereira'), ['Jade Pereira']);
assert.deepStrictEqual(splitMemberNames(''), []);
console.log('✓ Separação de integrantes aprovada em todos os padrões reais!');

// 2. Validação de extensão e tamanho de arquivo
console.log('\n--- 2. Testando regras de validação de arquivo ---');
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

function validateDeliveryFileMock({ name, size, magicBytes }) {
  if (!/\.xlsx$/i.test(name)) {
    return { ok: false, error: 'Formato não aceito. Envie uma planilha .xlsx' };
  }
  if (size <= 0) {
    return { ok: false, error: 'O arquivo está vazio.' };
  }
  if (size > MAX_BYTES) {
    return { ok: false, error: 'Arquivo maior que o limite de 5 MB.' };
  }
  if (magicBytes) {
    const isZip = magicBytes[0] === 0x50 && magicBytes[1] === 0x4b && magicBytes[2] === 0x03 && magicBytes[3] === 0x04;
    if (!isZip) {
      return { ok: false, error: 'Conteúdo não é um .xlsx válido.' };
    }
  }
  return { ok: true };
}

assert.strictEqual(validateDeliveryFileMock({ name: 'relatorio.xlsx', size: 1024, magicBytes: [0x50, 0x4b, 0x03, 0x04] }).ok, true);
assert.strictEqual(validateDeliveryFileMock({ name: 'virus.exe', size: 1024, magicBytes: [0x50, 0x4b, 0x03, 0x04] }).ok, false);
assert.strictEqual(validateDeliveryFileMock({ name: 'planilha.csv', size: 1024, magicBytes: [0x50, 0x4b, 0x03, 0x04] }).ok, false);
assert.strictEqual(validateDeliveryFileMock({ name: 'pesada.xlsx', size: 6 * 1024 * 1024, magicBytes: [0x50, 0x4b, 0x03, 0x04] }).ok, false);
assert.strictEqual(validateDeliveryFileMock({ name: 'falsa.xlsx', size: 1024, magicBytes: [0x00, 0x00, 0x00, 0x00] }).ok, false);
console.log('✓ Validação de arquivo (extensão, tamanho e magic bytes PK) aprovada!');

// 3. Regra de negócio: Cálculo de status da entrega
console.log('\n--- 3. Testando status da entrega ---');
function deliveryStatusOf(currentSubmission) {
  if (!currentSubmission) return 'pendente';
  return currentSubmission.status; // 'entregue' ou 'corrigida'
}

assert.strictEqual(deliveryStatusOf(undefined), 'pendente');
assert.strictEqual(deliveryStatusOf({ status: 'entregue', version: 1 }), 'entregue');
assert.strictEqual(deliveryStatusOf({ status: 'corrigida', version: 2 }), 'corrigida');
console.log('✓ Status de entrega (pendente / entregue / corrigida) aprovado!');

// 4. Regra de nota válida
console.log('\n--- 4. Testando validação de nota e pontuação máxima ---');
function validateScore(score, maxScore) {
  if (score === null || score === undefined || isNaN(score)) return false;
  return score >= 0 && score <= maxScore;
}

assert.strictEqual(validateScore(10, 10), true);
assert.strictEqual(validateScore(8.5, 10), true);
assert.strictEqual(validateScore(0, 10), true);
assert.strictEqual(validateScore(10.5, 10), false);
assert.strictEqual(validateScore(-1, 10), false);
console.log('✓ Validação de pontuação máxima aprovada!');

console.log('\n======================================================');
console.log(' TODOS OS TESTES DA CENTRAL DE ENTREGAS FORAM APROVADOS! ');
console.log('======================================================\n');

