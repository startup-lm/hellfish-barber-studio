import { getBarbers } from "@/lib/repository/barbers";
import { getCalendarConfig } from "@/lib/repository/calendar";
import TurnosClient from "./TurnosClient";

export const revalidate = 60;

export default async function TurnosPage() {
  const [barbers, { businessHours, businessSettings }] = await Promise.all([ getBarbers(), getCalendarConfig(), ]);

  return (
    <TurnosClient initialBarbers={barbers} businessHours={businessHours} businessSettings={businessSettings} />
  );
}
