import { z } from "zod";

export const contactSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.string().optional(),
  company: z.string().optional(),
  employmentType: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  recaptchaToken: z.string().min(1, "reCAPTCHA token is required"),
});

export type ContactFormData = z.infer<typeof contactSchema>;
