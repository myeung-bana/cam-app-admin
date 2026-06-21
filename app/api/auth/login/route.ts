import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isDevMode } from "@/lib/dev/config";
import { signInAdmin } from "@/lib/data/auth";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  if (isDevMode()) {
    return NextResponse.json(
      { ok: false, error: "Use /api/dev/login in dev mode" },
      { status: 400 }
    );
  }

  try {
    const body = LoginSchema.parse(await req.json());
    const session = await signInAdmin(body.email, body.password);

    return NextResponse.json({
      ok: true,
      data: { user: session.user },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Sign in failed";

    const status =
      message.toLowerCase().includes("admin") ||
      message.toLowerCase().includes("access")
        ? 403
        : 401;

    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
