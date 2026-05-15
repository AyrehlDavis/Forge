import { NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_TRACKS = new Set(["A_use_broker", "B_go_direct", "C_hybrid"]);

interface SendPdfPayload {
  email?: unknown;
  recommendation?: { track?: unknown };
  inputs?: Record<string, unknown>;
}

function validate(body: SendPdfPayload): string | null {
  if (typeof body.email !== "string" || !EMAIL_REGEX.test(body.email)) {
    return "invalid_email";
  }
  const track = body.recommendation?.track;
  if (typeof track !== "string" || !VALID_TRACKS.has(track)) {
    return "invalid_recommendation";
  }
  if (!body.inputs || typeof body.inputs !== "object") {
    return "invalid_inputs";
  }
  return null;
}

export async function POST(request: Request) {
  let payload: SendPdfPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ status: "error", code: "bad_json" }, { status: 400 });
  }

  const validationError = validate(payload);
  if (validationError) {
    return NextResponse.json({ status: "error", code: "bad_request" }, { status: 400 });
  }

  // TODO(story 7.10): integrate PDF generation (@react-pdf/renderer) and
  // transactional email provider (Resend). For the rapid prototype this is a
  // stub — the queueing/sending pipeline is not wired up yet.
  return NextResponse.json({ status: "queued" }, { status: 200 });
}
