const LEADS_KEY = 'empresax_leads';

const initialLeads = [
  {
    id: '1', name: 'María González', email: 'maria@gmail.com',
    phone: '+56 9 8765 4321', amount: 5000000, status: 'pendiente',
    createdAt: '2024-03-10T10:00:00Z', income: 1800000, expenses: 600000, debts: 200000,
  },
  {
    id: '2', name: 'Jorge Ramírez', email: 'jorge@gmail.com',
    phone: '+56 9 7654 3210', amount: 2000000, status: 'en_evaluacion',
    createdAt: '2024-03-12T14:30:00Z', income: 950000, expenses: 400000, debts: 150000,
  },
  {
    id: '3', name: 'Sofía Herrera', email: 'sofia@gmail.com',
    phone: '+56 9 6543 2109', amount: 8000000, status: 'aprobado',
    createdAt: '2024-03-13T09:15:00Z', income: 3200000, expenses: 900000, debts: 0,
  },
  {
    id: '4', name: 'Luis Pardo', email: 'luis@gmail.com',
    phone: '+56 9 5432 1098', amount: 1500000, status: 'rechazado',
    createdAt: '2024-03-14T16:45:00Z', income: 600000, expenses: 500000, debts: 300000,
  },
];

function getLeads() {
  const stored = localStorage.getItem(LEADS_KEY);
  if (!stored) {
    localStorage.setItem(LEADS_KEY, JSON.stringify(initialLeads));
    return initialLeads;
  }
  return JSON.parse(stored);
}

function saveLeads(leads) {
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
}

export const leadService = {
  getAll: () => Promise.resolve(getLeads()),

  getById: (id) => {
    const lead = getLeads().find(l => l.id === id);
    return lead ? Promise.resolve(lead) : Promise.reject(new Error('Lead no encontrado'));
  },

  create: (data) => {
    const leads = getLeads();
    const newLead = {
      ...data,
      id: Date.now().toString(),
      status: 'pendiente',
      createdAt: new Date().toISOString(),
    };
    saveLeads([newLead, ...leads]);
    return Promise.resolve(newLead);
  },

  updateStatus: (id, status) => {
    const leads = getLeads().map(l => l.id === id ? { ...l, status } : l);
    saveLeads(leads);
    return Promise.resolve(leads.find(l => l.id === id));
  },
};