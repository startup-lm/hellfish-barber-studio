export type GlobalHours = {
  open_time: string;
  close_time: string;
  lunch_start: string | null;
  lunch_end: string | null;
  closed_days: number[];
};
