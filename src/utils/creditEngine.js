const MIN_INCOME_MULTIPLIER = 2;     // ingresos deben ser >= 2x el monto
const MAX_DTI = 0.40;                // deuda/ingreso máximo 40%
const MAX_EXPENSE_RATIO = 0.70;      // gastos no pueden superar 70% del ingreso

export function evaluateCredit({ income, expenses, debts, amount }) {
  const reasons = [];
  const warnings = [];

  // 1. Capacidad de pago
  const minIncome = amount / MIN_INCOME_MULTIPLIER;
  if (income < minIncome) {
    reasons.push(`Ingresos insuficientes. Se requieren mínimo $${minIncome.toLocaleString('es-CL')}`);
  }

  // 2. Ratio deuda/ingreso (DTI)
  const dti = debts / income;
  if (dti > MAX_DTI) {
    reasons.push(`Ratio deuda/ingreso (${(dti * 100).toFixed(1)}%) supera el máximo permitido (40%)`);
  } else if (dti > 0.25) {
    warnings.push(`DTI elevado (${(dti * 100).toFixed(1)}%). Aceptable pero con riesgo moderado.`);
  }

  // 3. Ratio de gastos
  const expenseRatio = expenses / income;
  if (expenseRatio > MAX_EXPENSE_RATIO) {
    reasons.push(`Gastos mensuales superan el 70% de los ingresos`);
  } else if (expenseRatio > 0.55) {
    warnings.push(`Gastos altos (${(expenseRatio * 100).toFixed(1)}% del ingreso)`);
  }

  // 4. Ingreso neto disponible
  const netIncome = income - expenses - debts;
  const monthlyPayment = amount / 24; // cuota estimada a 24 meses
  if (netIncome < monthlyPayment) {
    reasons.push(`Ingreso neto insuficiente para cubrir cuota estimada de $${monthlyPayment.toLocaleString('es-CL')}/mes`);
  }

  const approved = reasons.length === 0;
  const score = calculateScore({ income, expenses, debts, amount, dti, expenseRatio });

  return {
    approved,
    score,
    scoreLabel: getScoreLabel(score),
    reasons,
    warnings,
    monthlyPayment: Math.round(monthlyPayment),
    netIncome: Math.round(netIncome),
    dti: parseFloat((dti * 100).toFixed(1)),
    expenseRatio: parseFloat((expenseRatio * 100).toFixed(1)),
  };
}

function calculateScore({ income, dti, expenseRatio, amount }) {
  let score = 100;
  score -= dti * 80;
  score -= expenseRatio * 40;
  if (income < amount) score -= 20;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function getScoreLabel(score) {
  if (score >= 80) return { label: 'Excelente', color: 'success' };
  if (score >= 60) return { label: 'Bueno', color: 'info' };
  if (score >= 40) return { label: 'Regular', color: 'warning' };
  return { label: 'Alto riesgo', color: 'error' };
}