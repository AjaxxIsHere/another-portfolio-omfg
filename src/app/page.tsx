import { HomeSections } from "@/components/home/home-sections";

const techStack = [
  "Flutter",
  "Firebase",
  "Next.js",
  "React",
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "Dart",
  "AWS",
];

const socials = [
  { label: "GitHub", href: "#", icon: "github" as const },
  { label: "LinkedIn", href: "#", icon: "linkedin" as const },
  { label: "Email", href: "#", icon: "email" as const },
  { label: "Website", href: "#", icon: "website" as const },
];

export default function Home() {
  return (
    <HomeSections
      name="Mohamad Ajaz Imran"
      about="Placeholder"
      stack={techStack}
      socials={socials}
    />
  );
}
