/* eslint-disable @typescript-eslint/no-explicit-any */
import { GlobalHours } from "@/lib/types/BusinessHours";

const BASE = process.env.NEXT_PUBLIC_APP_URL!;

export const getBusinessHours = async (): Promise<GlobalHours> => {
  const res = await fetch(`${BASE}/api/business-hours/global`, {
    next: { tags: ["business-hours-global"], revalidate: 86400 },
  });
  return (await res.json()) as GlobalHours;
};

export const upsertBusinessHours = async (hours: GlobalHours): Promise<GlobalHours | null> => {
  const res = await fetch(`${BASE}/api/business-hours/global`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(hours),
  });
  if (!res.ok) return null;
  return (await res.json()) as GlobalHours;
};
