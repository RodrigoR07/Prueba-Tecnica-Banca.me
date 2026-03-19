const EVALS_KEY = 'empresax_evaluations';

function getEvaluations() {
  const stored = localStorage.getItem(EVALS_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveEvaluations(evals) {
  localStorage.setItem(EVALS_KEY, JSON.stringify(evals));
}

export const evaluationService = {
  getByLeadId: (leadId) => {
    const evals = getEvaluations();
    return Promise.resolve(evals.find(e => e.leadId === leadId) || null);
  },

  save: (leadId, result, collaboratorNote, decision) => {
    const evals = getEvaluations().filter(e => e.leadId !== leadId);
    const record = {
      id: Date.now().toString(),
      leadId,
      result,
      collaboratorNote,
      decision,           // 'approved' | 'rejected'
      evaluatedAt: new Date().toISOString(),
    };
    saveEvaluations([record, ...evals]);
    return Promise.resolve(record);
  },
};