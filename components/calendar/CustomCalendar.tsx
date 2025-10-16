'use client';

import { Calendar, momentLocalizer, SlotInfo } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '@/styles/calendar.css';
import { Appointment } from '@/lib/types/Appointment';
import { CalendarEvent } from '@/lib/types/CalendarEvent';
import Spinner from '@/components/loading/Spinner';
import { formats } from '@/components/calendar/CalendarFormats';
import { useCalendarData } from '@/lib/hooks/useCalendarData';
import { useCalendarNavigation } from '@/lib/hooks/useCalendarNavigation';
import DatePickerField from '@/components/admin/DatePickerField';
import type { GlobalHours } from '@/lib/types/BusinessHours';
import type { BusinessSettings } from '@/lib/types/BusinessSettings';

moment.locale('es');
const localizer = momentLocalizer(moment);

interface Props {
  selectedBarberId: number;
  role: string;
  isMobile: boolean;
  onSlotClick: (appointment: Appointment, events: CalendarEvent[]) => void;
  onEventClick: (appointment: Appointment) => void;
  businessHours: GlobalHours;
  businessSettings: BusinessSettings;
}

export default function CustomCalendar({selectedBarberId,role,isMobile,onSlotClick,onEventClick,businessHours, businessSettings, }: Readonly<Props>) {
  const { currentDate, currentRange, onNavigate, onRangeChange } = useCalendarNavigation();
  const { events, allAppointments } = useCalendarData(selectedBarberId, role, currentRange);

  const parseHHMM = (s: string) => {
    const [h, m] = s.split(':').map(Number);
    return { H: h ?? 0, M: m ?? 0 };
  };
  const setTimeOn = (base: Date, hhmm?: string | null) => {
    if (!hhmm) return null;
    const { H, M } = parseHHMM(hhmm);
    const d = new Date(base);
    d.setHours(H, M, 0, 0);
    return d;
  };
  const isClosedDay = (d: Date) => businessHours.closed_days.includes(d.getDay());
  const isLunchBreak = (d: Date) => {
    if (!businessHours.lunch_start || !businessHours.lunch_end) return false;
    const ls = setTimeOn(d, businessHours.lunch_start)!;
    const le = setTimeOn(d, businessHours.lunch_end)!;
    return d >= ls && d < le;
  };
  const calendarMin = setTimeOn(currentDate, businessHours.open_time) ?? new Date(new Date(currentDate).setHours(8, 0, 0, 0));
  const calendarMax = setTimeOn(currentDate, businessHours.close_time) ?? new Date(new Date(currentDate).setHours(22, 0, 0, 0));
  const step = businessSettings.slot_step_minutes ?? 30;
  const timeslots = 1;

  if (!allAppointments) {
    return <div className="flex justify-center items-center h-96"><Spinner /></div>;
  }

  return (
    <div className="space-y-4">
      {isMobile && (
        <div className="flex justify-center space-x-2">
          <DatePickerField date={currentDate} onChange={(d) => d && onNavigate(d)} displayButton />
        </div>
      )}

      <div className="custom-calendar p-6 rounded-lg">
        <Calendar
          localizer={localizer}
          events={events}
          defaultView={isMobile ? 'day' : 'week'}
          views={isMobile ? ['day'] : ['week']}
          selectable
          popup={isMobile}
          longPressThreshold={0}
          step={step}
          timeslots={timeslots}
          min={calendarMin}
          max={calendarMax}
          drilldownView={null}
          showMultiDayTimes={false}
          tooltipAccessor={null}
          onSelectSlot={(slotInfo: SlotInfo) => {
            const now = new Date();
            if (slotInfo.start < now && role === "guest") return;
            if (isClosedDay(slotInfo.start) || isLunchBreak(slotInfo.start)) return;
            if (events.some(ev => slotInfo.start >= ev.start && slotInfo.start < ev.end)) return;

            const appt: Appointment = {
              id: 0,
              barber_id: selectedBarberId,
              date: slotInfo.start.toISOString().slice(0, 10),
              start_time: slotInfo.start.toTimeString().slice(0, 5),
              end_time: slotInfo.end.toTimeString().slice(0, 5),
              client: '',
              phone: '',
              paid: false, price: 0,
              service_id: 1,
            };
            onSlotClick(appt, events);
          }}
          onSelectEvent={(ev: CalendarEvent) => {
            const sel = allAppointments.find(a => a.id === ev.id);
            if (sel) onEventClick(sel);
          }}
          onRangeChange={onRangeChange}
          date={currentDate}
          onNavigate={onNavigate}
          eventPropGetter={ev => {
            let backgroundColor: string;
            if (role === 'guest') backgroundColor = '#EF4444';
            else {
              if (!ev.isAppt) backgroundColor = 'var(--calendar-non-appointment)';
              else if (!ev.paid) backgroundColor = '#EF4444';
              else backgroundColor = '#10B981';
            }
            return {
              style: {
                backgroundColor,
                color: 'var(--foreground)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              },
            };
          }}
          dayPropGetter={date =>
            isClosedDay(date)
              ? { className: 'rbc-disabled-day', style: { pointerEvents: 'none', opacity: 0.5, background: 'var(--calendar-disabled-slot)' } }
              : {}
          }
          slotPropGetter={date => {
            const beforeOpen = businessHours.open_time ? date < setTimeOn(date, businessHours.open_time)! : false;
            const afterClose = businessHours.close_time ? date >= setTimeOn(date, businessHours.close_time)! : false;
            const lunch = isLunchBreak(date);
            if (isClosedDay(date) || beforeOpen || afterClose || lunch) {
              return { style: { pointerEvents: 'none', backgroundColor: 'var(--calendar-disabled-slot)', opacity: 0.8 } };
            }
            return {};
          }}
          messages={{ month: 'Month', week: 'Semana', day: 'Día', previous: 'Atrás', next: 'Siguiente', today: 'Hoy', date: 'Fecha', time: 'Hora', event: 'Turno' }}
          formats={formats}
        />
      </div>
    </div>
  );
}