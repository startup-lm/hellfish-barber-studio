import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/supabaseAdmin";
import type { GlobalHours } from "@/lib/types/BusinessHours";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("business_hours_global")
    .select("open_time, close_time, lunch_start, lunch_end, closed_days")
    .eq("id", 1)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) { return NextResponse.json({ error: "business_hours_global not found" }, { status: 404 }); }
  return NextResponse.json(data as GlobalHours);
}

export async function PUT(req: Request) {
  const payload = (await req.json()) as GlobalHours;
  const { data, error } = await supabaseAdmin
    .from("business_hours_global")
    .upsert({ id: 1, ...payload })
    .select("open_time, close_time, lunch_start, lunch_end, closed_days")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data as GlobalHours);
}
