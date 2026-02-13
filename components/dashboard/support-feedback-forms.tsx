"use client";

import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/shared/icons";

type MessageType = "support" | "feedback";

async function sendMessage(payload: {
  type: MessageType;
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const response = await fetch("/api/support-feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;
    throw new Error(error?.message || "Request failed");
  }
}

export function SupportFeedbackForms() {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(session?.user?.name || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [supportSubject, setSupportSubject] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [feedbackSubject, setFeedbackSubject] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const submit = (
    type: MessageType,
    subject: string,
    message: string,
    onSuccess: () => void,
  ) => {
    startTransition(async () => {
      try {
        await sendMessage({
          type,
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
        });
        onSuccess();
        toast.success(
          type === "support" ? "Support request sent" : "Feedback sent",
        );
      } catch (error) {
        toast.error("Unable to send message", {
          description:
            error instanceof Error
              ? error.message
              : "Please try again in a moment.",
        });
      }
    });
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="landing-glass landing-hover-box rounded-2xl border-white/20 p-5 dark:border-white/10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/55">
          Contact Details
        </p>
        <h3 className="mt-3 font-heading text-2xl">Support Inbox</h3>
        <p className="mt-2 text-sm text-foreground/65">
          Every message is delivered to both founders:
          <br />
          <span className="font-mono text-xs text-foreground/75">
            nkovuru0@gmail.com
          </span>
          <br />
          <span className="font-mono text-xs text-foreground/75">
            prateekjannu@gmail.com
          </span>
        </p>

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="support-name">Name</Label>
            <Input
              id="support-name"
              className="dashboard-input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="support-email">Email</Label>
            <Input
              id="support-email"
              type="email"
              className="dashboard-input"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
            />
          </div>
        </div>
      </section>

      <div className="grid gap-5">
        <section className="landing-glass landing-hover-box rounded-2xl border-white/20 p-5 dark:border-white/10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/55">
            Support
          </p>
          <div className="mt-4 grid gap-3">
            <div className="space-y-2">
              <Label htmlFor="support-subject">Subject</Label>
              <Input
                id="support-subject"
                className="dashboard-input"
                value={supportSubject}
                onChange={(event) => setSupportSubject(event.target.value)}
                placeholder="Describe the issue"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="support-message">Message</Label>
              <Textarea
                id="support-message"
                className="dashboard-input min-h-[132px] resize-none"
                value={supportMessage}
                onChange={(event) => setSupportMessage(event.target.value)}
                placeholder="Tell us what happened and what you expected."
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              className="dashboard-btn rounded-xl"
              disabled={
                isPending ||
                !name.trim() ||
                !email.trim() ||
                !supportSubject.trim() ||
                !supportMessage.trim()
              }
              onClick={() =>
                submit("support", supportSubject, supportMessage, () => {
                  setSupportSubject("");
                  setSupportMessage("");
                })
              }
            >
              {isPending ? (
                <>
                  <Icons.spinner className="mr-2 size-4 animate-spin" />
                  Sending
                </>
              ) : (
                "Send Support Request"
              )}
            </Button>
          </div>
        </section>

        <section className="landing-glass landing-hover-box rounded-2xl border-white/20 p-5 dark:border-white/10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/55">
            Feedback
          </p>
          <div className="mt-4 grid gap-3">
            <div className="space-y-2">
              <Label htmlFor="feedback-subject">Subject</Label>
              <Input
                id="feedback-subject"
                className="dashboard-input"
                value={feedbackSubject}
                onChange={(event) => setFeedbackSubject(event.target.value)}
                placeholder="Feature idea or improvement"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback-message">Message</Label>
              <Textarea
                id="feedback-message"
                className="dashboard-input min-h-[132px] resize-none"
                value={feedbackMessage}
                onChange={(event) => setFeedbackMessage(event.target.value)}
                placeholder="Tell us what would make LLMHub better for your workflow."
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              className="dashboard-btn rounded-xl"
              variant="outline"
              disabled={
                isPending ||
                !name.trim() ||
                !email.trim() ||
                !feedbackSubject.trim() ||
                !feedbackMessage.trim()
              }
              onClick={() =>
                submit("feedback", feedbackSubject, feedbackMessage, () => {
                  setFeedbackSubject("");
                  setFeedbackMessage("");
                })
              }
            >
              {isPending ? (
                <>
                  <Icons.spinner className="mr-2 size-4 animate-spin" />
                  Sending
                </>
              ) : (
                "Send Feedback"
              )}
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
