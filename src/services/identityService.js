// RUTs que pre-califican en el mock
const QUALIFYING_RUTS = [
  '12345678-9', '98765432-1', '11111111-1',
  '22222222-2', '33333333-3', '15000000-0',
];

// RUTs con ClaveUnica válida (rut → clave)
const VALID_CLAVE_UNICA = {
  '12345678-9': '1234',
  '98765432-1': 'pass1',
  '11111111-1': '0000',
  '22222222-2': 'abc1',
  '33333333-3': 'clave',
  '15000000-0': '9999',
};

function formatRut(rut) {
  return rut.replace(/\s/g, '').toUpperCase();
}

export const identityService = {
  // Simula consulta a DICOM / historial crediticio
  checkRut: (rut) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const formatted = formatRut(rut);
        const qualifies = QUALIFYING_RUTS.includes(formatted);
        resolve({
          qualifies,
          rut: formatted,
          message: qualifies
            ? 'RUT verificado. Pre-califica para un crédito responsable.'
            : 'El RUT ingresado no pre-califica en este momento. Puede deberse a deudas morosas o historial crediticio insuficiente.',
        });
      }, 1800); // simula latencia de servicio externo
    });
  },

  // Simula verificación de ClaveÚnica contra SII / AFC / SUSESO
  verifyClave: (rut, clave) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const formatted = formatRut(rut);
        const expected = VALID_CLAVE_UNICA[formatted];
        const valid = expected === clave;
        resolve({
          valid,
          message: valid
            ? 'ClaveÚnica verificada correctamente. Acceso autorizado a SII, AFC y SUSESO.'
            : 'ClaveÚnica incorrecta. Verifica tus credenciales e intenta nuevamente.',
        });
      }, 2000);
    });
  },
};