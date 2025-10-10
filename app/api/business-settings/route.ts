import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/supabaseAdmin";
import type { BusinessSettings } from "@/lib/types/BusinessSettings";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("business_settings")
    .select("slot_step_minutes")
    .eq("id", 1)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data as BusinessSettings);
}

export async function PUT(req: Request) {
  const payload = (await req.json()) as BusinessSettings;
  const { data, error } = await supabaseAdmin
    .from("business_settings")
    .upsert({ id: 1, ...payload })
    .select("slot_step_minutes")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data as BusinessSettings);
}
