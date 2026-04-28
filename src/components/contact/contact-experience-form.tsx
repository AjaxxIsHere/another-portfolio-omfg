"use client";

import { FormEvent, useState, useRef } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { HalftoneBlobsBackground } from "@/components/portfolio/halftone-lava-lamp";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const easeOut = [0.16, 1, 0.3, 1] as const;

const fieldClassName =
  "mt-2 w-full rounded-2xl border-[0.5px] border-white/12 bg-black/30 px-4 py-3 text-sm text-foreground outline-none transition-all duration-200 placeholder:text-white/38 focus:border-accent/70";

type SocialIcon = "github" | "linkedin" | "email" | "website";

type SocialLink = {
  label: string;
  href: string;
  icon: SocialIcon;
};

const socials: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/AjaxxIsHere", icon: "github" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/mohamad-ajaz/",
    icon: "linkedin",
  },
  { label: "Email", href: "mailto:ajaz2468@gmail.com", icon: "email" },
  {
    label: "Instagram",
    href: "https://www.instagram.com/yours.truly__aj/profilecard/",
    icon: "website",
  },
];

type ContactFormData = {
  fullName: string;
  email: string;
  role: string;
  company: string;
  employmentType: string;
  message: string;
};

const initialFormState: ContactFormData = {
  fullName: "",
  email: "",
  role: "",
  company: "",
  employmentType: "",
  message: "",
};

function SocialGlyph({ icon }: { icon: SocialIcon }) {
  if (icon === "github") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
      </svg>
    );
  }

  if (icon === "linkedin") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    );
  }

  if (icon === "email") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

// Magnetic hover wrapper, matches footer-section behavior
function MagneticWrapper({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const boundingRect = ref.current?.getBoundingClientRect();
    if (!boundingRect) return;
    const { height, width, left, top } = boundingRect;
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="inline-flex"
    >
      {children}
    </motion.div>
  );
}

export function ContactExperienceForm() {
  const [formData, setFormData] = useState<ContactFormData>(initialFormState);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg(null);
    setIsSubmitted(false);
    setIsSending(true);

    if (!executeRecaptcha) {
      setErrorMsg("reCAPTCHA is not fully loaded. Please try again later.");
      setIsSending(false);
      return;
    }

    try {
      const recaptchaToken = await executeRecaptcha("contact_form");

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, recaptchaToken }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.error || "Failed to send message.");
      }

      setFormData(initialFormState);
      setIsSubmitted(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Failed to send message.");
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-background px-5 pb-10 pt-28 sm:px-8 lg:px-12 lg:pt-32">
      <HalftoneBlobsBackground />

      <div className="relative z-10 mx-auto w-full max-w-[1320px]">
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: easeOut }}
          className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
        >
          <motion.div
            initial={{ opacity: 0, x: -22 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: easeOut }}
            className="rounded-[2rem] border-[0.5px] border-white/10 bg-surface/74 p-7 backdrop-blur-sm sm:p-9"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent/90">
              Hiring Desk
            </p>

            <h1 className="mt-5 max-w-[12ch] font-display text-[clamp(2.2rem,7vw,4.8rem)] leading-[0.98] tracking-[-0.02em] text-foreground">
              If You&apos;re Hiring, Let&apos;s Talk.
            </h1>

            <p className="mt-6 max-w-[42ch] text-sm leading-relaxed text-white/72 sm:text-base">
              I&apos;m open to impactful software engineering roles across frontend, mobile,
              and full-stack product teams. Share your role details and I&apos;ll get back to
              you quickly.
            </p>

            <div className="mt-8 grid gap-3 text-sm text-white/68 sm:grid-cols-2">
              <div className="rounded-2xl border-[0.5px] border-white/10 bg-black/25 p-4">
                <p className="text-[0.65rem] uppercase tracking-[0.22em] text-accent/85">
                  Open To
                </p>
                <p className="mt-2 text-base text-white/84">Frontend, Mobile, Full-Stack</p>
              </div>
              <div className="rounded-2xl border-[0.5px] border-white/10 bg-black/25 p-4">
                <p className="text-[0.65rem] uppercase tracking-[0.22em] text-accent/85">
                  Start Window
                </p>
                <p className="mt-2 text-base text-white/84">Immediate to 2 Weeks</p>
              </div>
            </div>

            <div className="mt-10 space-y-2 border-t border-white/10 pt-6 text-sm text-white/64">
              <p>Email: ajaz2468@gmail.com</p>
              <p>Location: Dubai, UAE</p>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: easeOut }}
            onSubmit={handleSubmit}
            className="rounded-[2rem] border-[0.5px] border-white/10 bg-surface/72 p-7 shadow-[0_40px_120px_rgba(0,0,0,0.42)] backdrop-blur-sm sm:p-9"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-xs font-medium uppercase tracking-[0.2em] text-white/62 sm:col-span-1">
                Name
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(event) =>
                    setFormData((previous) => ({ ...previous, fullName: event.target.value }))
                  }
                  className={fieldClassName}
                  placeholder="Mohamad Ajaz"
                  autoComplete="name"
                />
              </label>

              <label className="text-xs font-medium uppercase tracking-[0.2em] text-white/62 sm:col-span-1">
                Email
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(event) =>
                    setFormData((previous) => ({ ...previous, email: event.target.value }))
                  }
                  className={fieldClassName}
                  placeholder="recruiter@company.com"
                  autoComplete="email"
                />
              </label>

              <label className="text-xs font-medium uppercase tracking-[0.2em] text-white/62 sm:col-span-1">
                Role You&apos;re Hiring For
                <input
                  type="text"
                  value={formData.role}
                  onChange={(event) =>
                    setFormData((previous) => ({ ...previous, role: event.target.value }))
                  }
                  className={fieldClassName}
                  placeholder="Software Engineer"
                />
              </label>

              <label className="text-xs font-medium uppercase tracking-[0.2em] text-white/62 sm:col-span-1">
                Company
                <input
                  type="text"
                  value={formData.company}
                  onChange={(event) =>
                    setFormData((previous) => ({ ...previous, company: event.target.value }))
                  }
                  className={fieldClassName}
                  placeholder="Your Company"
                  autoComplete="organization"
                />
              </label>

              <label className="text-xs font-medium uppercase tracking-[0.2em] text-white/62 sm:col-span-2">
                Employment Type
                <select
                  value={formData.employmentType}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      employmentType: event.target.value,
                    }))
                  }
                  className={fieldClassName}
                >
                  <option value="">Select employment type</option>
                  <option value="full-time">Full-Time</option>
                  <option value="internship">Internship</option>
                  <option value="contract">Contract</option>
                </select>
              </label>

              <label className="text-xs font-medium uppercase tracking-[0.2em] text-white/62 sm:col-span-2">
                Message
                <textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(event) =>
                    setFormData((previous) => ({ ...previous, message: event.target.value }))
                  }
                  className={`${fieldClassName} resize-none`}
                  placeholder="Tell me about your team, role scope, and what success looks like in this position."
                />
              </label>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs tracking-[0.08em] text-white/52">
                This form is protected by reCAPTCHA and subject to Google's Privacy Policy.
              </p>

              <motion.button
                type="submit"
                disabled={isSending}
                whileTap={{ scale: isSending ? 1 : 0.97 }}
                whileHover={{ y: isSending ? 0 : -2 }}
                className="inline-flex items-center justify-center rounded-full border-[0.5px] border-accent/80 bg-accent px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-background transition-colors hover:bg-[#ff793f] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? "Sending..." : "Send Hiring Message"}
              </motion.button>
            </div>

            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400"
              >
                {errorMsg}
              </motion.div>
            )}

            <motion.div
              aria-live="polite"
              initial={false}
              animate={{
                opacity: isSubmitted ? 1 : 0,
                y: isSubmitted ? 0 : 8,
                height: isSubmitted ? "auto" : 0,
              }}
              transition={{ duration: 0.3, ease: easeOut }}
              className="overflow-hidden pt-4 text-sm text-accent"
            >
              Thanks. Your message has been sent successfully. I'll get back to you soon.
            </motion.div>
          </motion.form>
        </motion.section>

        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: easeOut }}
          className="mt-16 border-t border-white/10 pt-8"
        >
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-2">
              {socials.map((social) => (
                <MagneticWrapper key={social.label}>
                  <a
                    href={social.href}
                    aria-label={social.label}
                    className="group flex h-14 w-14 items-center justify-center rounded-full border-[0.5px] border-white/12 bg-surface/40 text-white/70 backdrop-blur-md transition-colors hover:border-[#FA5D19]/55 hover:text-[#FA5D19]"
                  >
                    <SocialGlyph icon={social.icon} />
                  </a>
                </MagneticWrapper>
              ))}
            </div>

            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
              ©2026 Made by Mohamad Ajaz - All Rights Reserved
            </p>
          </div>
        </motion.footer>
      </div>
    </main>
  );
}