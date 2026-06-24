import { NextResponse } from "next/server";
import { isAuthDisabled } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  const disabled = await isAuthDisabled();
  return NextResponse.json({ authEnabled: !disabled });
}
