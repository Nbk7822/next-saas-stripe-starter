import { auth } from "@/auth";
import { z } from "zod";

import { env } from "@/env.mjs";
import { resend } from "@/lib/email";

const supportFeedbackSchema = z.object({
  type: z.enum(["support", "feedback"]),
  name: z.string().trim().min(2).max(64),
  email: z.string().trim().email(),
  subject: z.string().trim().min(3).max(140),
  message: z.string().trim().min(10).max(5000),
});

const RECIPIENTS = ["nkovuru0@gmail.com", "prateekjannu@gmail.com"];

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const payload = supportFeedbackSchema.parse(json);

    const kind = payload.type === "support" ? "Support" : "Feedback";
    const subject = `[LLMHub ${kind}] ${payload.subject}`;

    const html = `
      <div style="font-family:Inter,Arial,sans-serif;line-height:1.6;color:#101828;">
        <h2 style="margin:0 0 12px;">${escapeHtml(kind)} Message</h2>
        <p style="margin:0 0 8px;"><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
        <p style="margin:0 0 8px;"><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
        <p style="margin:0 0 8px;"><strong>Subject:</strong> ${escapeHtml(payload.subject)}</p>
        <p style="margin:16px 0 8px;"><strong>Message:</strong></p>
        <pre style="white-space:pre-wrap;background:#f4f4f5;border-radius:8px;padding:12px;margin:0;">${escapeHtml(payload.message)}</pre>
      </div>
    `;

    const text = `${kind} Message
Name: ${payload.name}
Email: ${payload.email}
Subject: ${payload.subject}

${payload.message}`;

    await resend.emails.send({
      from: env.EMAIL_FROM,
      to: RECIPIENTS,
      reply_to: payload.email,
      subject,
      html,
      text,
    });

    return Response.json({ status: "ok" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { message: "Invalid request payload." },
        { status: 400 },
      );
    }

    return Response.json(
      { message: "Unable to send message at this time." },
      { status: 500 },
    );
  }
}
