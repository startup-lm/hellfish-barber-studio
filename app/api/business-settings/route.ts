import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/supabaseAdmin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("business_settings")
    .select("slot_step_minutes")
    .eq("id", 1)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  const payload = await req.json()
  const { data, error } = await supabaseAdmin
    .from("business_settings")
    .upsert({ id: 1, ...payload })
    .select("slot_step_minutes")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
