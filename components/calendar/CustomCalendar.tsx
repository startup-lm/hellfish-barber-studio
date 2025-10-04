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
import DatePickerField from '../admin/DatePickerField';
import { getMinAndMaxTime } from '../../utils/time';

moment.locale('es');
const localizer = momentLocalizer(moment);

interface CustomCalendarProps {
  selectedBarberId: number;
  role: string;
  isMobile: boolean;
  onSlotClick: (appointment: Appointment, events: CalendarEvent[]) => void;
  onEventClick: (appointment: Appointment) => void;
}

export default function CustomCalendar({ selectedBarberId, role, isMobile, onSlotClick, onEventClick, }: Readonly<CustomCalendarProps>) {
  const { currentDate, currentRange, onNavigate, onRangeChange } = useCalendarNavigation();
  const { events, allAppointments } = useCalendarData(selectedBarberId, role, currentRange);
  const { minTime, maxTime } = getMinAndMaxTime();
  const disableWeekends = ({ start }: { start: Date }) => {
    const d = start.getDay();
    return d === 0 || d === 1;
  };

  if (!allAppointments) {
    return (
      <div className="flex justify-center items-center h-96"><Spinner /></div>
    );
  }

  const isLunchBreak = (d: Date) => {
    const start = new Date(d);
    start.setHours(14, 0, 0, 0);
    const end = new Date(d);
    end.setHours(15, 0, 0, 0);
    return d >= start && d < end;
  };

  return (
    <div className="space-y-4">
      {isMobile && (
        <div className="flex justify-center space-x-2">
          <DatePickerField
            date={currentDate}
            onChange={(d) => {
              if (!d) return;
              onNavigate(d);
            }}
            displayButton
          />
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
          step={30}
          timeslots={1}
          min={minTime}
          max={maxTime}
          drilldownView={null}
          showMultiDayTimes={false}
          tooltipAccessor={null}
          onSelectSlot={(slotInfo: SlotInfo) => {
            const todayStart = new Date();
            if (slotInfo.start < todayStart && role === "guest") return;
            if (isLunchBreak(slotInfo.start)) return;
            if (events.some(ev => slotInfo.start >= ev.start && slotInfo.start < ev.end))
              return;
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
            disableWeekends({ start: date })
              ? { className: 'rbc-disabled-day', style: { pointerEvents: 'none', opacity: 0.5 } } : {}
          }
          slotPropGetter={date =>
            date.getHours() < 10 || isLunchBreak(date)
              ? { style: { pointerEvents: 'none', backgroundColor: 'var(--calendar-disabled-slot)', opacity: 0.8, }, } : {}
          }
          messages={{ month: 'Month', week: 'Semana', day: 'Día', previous: 'Atrás', next: 'Siguiente', today: 'Hoy', date: 'Fecha', time: 'Hora', event: 'Turno', }}
          formats={formats}
        />
      </div>
    </div>
  );
}
