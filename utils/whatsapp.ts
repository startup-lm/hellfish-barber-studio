const WHATSAPP_API_URL = 'https://api.whatsapp.com/send';
export const DEFAULT_PHONE = '1133675227';

export function buildWhatsAppUrl(phone: string, message: string): string {
  const encoded = encodeURIComponent(message);
  return `${WHATSAPP_API_URL}?phone=+549${phone}&text=${encoded}`;
}

function openInNewTab(url: string) {
  if (typeof window === 'undefined') return;
  window.open(url, '_blank', 'noopener');
}

export function sendWhatsAppMessage( message = 'Hola! Quiero reservar un turno.', phone = DEFAULT_PHONE) {
  const url = buildWhatsAppUrl(phone, message);
  openInNewTab(url);
}

export function sendConfirmAppointment(id: number,date: Date,time: string,name: string,phone = DEFAULT_PHONE) {
  const formattedDate = date.toLocaleDateString('es-AR', { day:   '2-digit', month: '2-digit', year:  'numeric'});
  const text = [
    'Hola! 😊 Reservé un turno.',
    '',
    `Número de turno: 🆔 #${id}`,
    `Fecha: 📅 ${formattedDate}`,
    `Hora: ⏰ ${time}`,
    `Nombre: 🙋‍♂️ ${name}`,
    '',
    '¡Muchas gracias! 🙏'
  ].join('\n');

  const url = buildWhatsAppUrl(phone, text);
  openInNewTab(url);
}

export function sendCancelAppointment(date: string, time: string, name: string, phone = DEFAULT_PHONE) {
  const text = [
    'Hola! Cancelé mi turno.',
    '',
    `Nombre: 🙋‍♂️ ${name}`,
    `Fecha: 📅 ${date}`,
    `Hora: ⏰ ${time}`,
  ].join('\n');

  const url = buildWhatsAppUrl(phone, text);
  openInNewTab(url);
}
