import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations/contact";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize Upstash Redis ratelimiter
// 3 requests per 24 hours per IP
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.fixedWindow(3, "24 h"),
  ephemeralCache: new Map(),
});

export async function POST(req: NextRequest) {
  try {
    // 1. IP Extraction
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";

    // 2. Rate Limiting
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // 3. Zod Validation
    const body = await req.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid form data.", details: result.error.format() },
        { status: 400 }
      );
    }

    const data = result.data;

    // 4. reCAPTCHA Verification
    const recaptchaResponse = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: process.env.RECAPTCHA_SECRET_KEY as string,
          response: data.recaptchaToken,
        }),
      }
    );

    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success || recaptchaData.score < 0.5) {
      return NextResponse.json(
        { error: "reCAPTCHA verification failed." },
        { status: 403 }
      );
    }

    // 5. The n8n Handoff
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    const n8nWebhookSecret = process.env.N8N_WEBHOOK_SECRET;

    if (!n8nWebhookUrl) {
      console.error("N8N_WEBHOOK_URL is not defined.");
      return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
      );
    }

    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(n8nWebhookSecret && { "x-portfolio-secret": n8nWebhookSecret }),
      },
      body: JSON.stringify({
        fullName: data.fullName,
        email: data.email,
        role: data.role,
        company: data.company,
        employmentType: data.employmentType,
        message: data.message,
        ip, // Forward IP if needed by n8n (optional)
      }),
    });

    if (!n8nResponse.ok) {
      console.error("Failed to send data to n8n webhook:", await n8nResponse.text());
      return NextResponse.json(
        { error: "Failed to forward request." },
        { status: 500 }
      );
    }

    // 6. Response
    return NextResponse.json({ success: true, message: "Message sent successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
