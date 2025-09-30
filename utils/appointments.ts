import { Appointment } from "@/lib/types/Appointment";
import { CalendarEvent } from "@/lib/types/CalendarEvent";

export function generateAllAppointments() {
  const horarios: string[] = [];
  const step = 30;
  const first = 10 * 60 + 30;
  const lastStart = 19 * 60 + 30;
  const breakStart = 14 * 60;
  const breakEnd = 15 * 60;
  for (let m = first; m <= lastStart; m += step) {
    if (m >= breakStart && m < breakEnd) continue;
    const hh = String(Math.floor(m / 60)).padStart(2, "0");
    const mm = String(m % 60).padStart(2, "0");
    horarios.push(`${hh}:${mm}`);
  }
  return horarios;
}

export const transformAppointmentsToEvents = (appointments: Appointment[],role: string): CalendarEvent[] => {
  return appointments.map(appt => {
    const rawStart = new Date(`${appt.date}T${appt.start_time}`);
    const rawEnd   = new Date(`${appt.date}T${appt.end_time}`);
    const start = new Date(rawStart.getTime() + 60 * 1000);
    const end   = new Date(rawEnd.getTime() - 60 * 1000);

    return {
      id: appt.id,
      title: role === 'guest' ? 'Reservado' : appt.client,
      start,
      end,
      paid: appt.paid,
      isAppt: appt.phone !== "0000000000"
    };
  });
};