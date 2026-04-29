"use client";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { ContactExperienceForm } from "@/components/contact/contact-experience-form";

export default function ContactPage() {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
      scriptProps={{
        async: false,
        defer: false,
        appendTo: "head",
        nonce: undefined,
      }}
    >
      <ContactExperienceForm />
    </GoogleReCaptchaProvider>
  );
}
