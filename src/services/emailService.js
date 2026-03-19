export const emailService = {
  sendContractEmail: (lead) => {
    console.log(`[EMAIL MOCK] Contrato enviado a ${lead.email}`);
    // En producción: llamada a SendGrid / AWS SES / etc.
    return Promise.resolve({
      success: true,
      message: `Correo de contrato enviado a ${lead.email}`,
      sentAt: new Date().toISOString(),
    });
  },

  sendRejectionEmail: (lead) => {
    console.log(`[EMAIL MOCK] Rechazo enviado a ${lead.email}`);
    return Promise.resolve({
      success: true,
      message: `Correo de rechazo enviado a ${lead.email}`,
      sentAt: new Date().toISOString(),
    });
  },

  sendConfirmationEmail: (lead) => {
    console.log(`[EMAIL MOCK] Confirmación de solicitud enviada a ${lead.email}`);
    return Promise.resolve({
      success: true,
      message: `Correo de confirmación enviado a ${lead.email}`,
    });
  },
};