export const contractService = {
  generate: (lead, evaluation) => {
    const contract = {
      id: `CONT-${Date.now()}`,
      leadId: lead.id,
      leadName: lead.name,
      leadEmail: lead.email,
      amount: lead.amount,
      monthlyPayment: evaluation.monthlyPayment,
      termMonths: 24,
      interestRate: 1.8,          // % mensual
      totalAmount: Math.round(lead.amount * 1.018 ** 24),
      generatedAt: new Date().toISOString(),
      status: 'pending_signature',
      signatureToken: `tok_${Math.random().toString(36).slice(2, 10)}`,
      clauses: [
        'El cliente se compromete a pagar puntualmente la cuota mensual acordada.',
        'En caso de mora, se aplicará un interés penal del 1.5% mensual sobre el saldo insoluto.',
        'El cliente puede prepagar total o parcialmente sin penalización después del 3er mes.',
        'banca.me se reserva el derecho de verificar periódicamente el estado financiero del cliente.',
        'Cualquier disputa será resuelta bajo la legislación vigente en la República de Chile.',
      ],
    };
    return Promise.resolve(contract);
  },
};