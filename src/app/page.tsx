import { HeroShell } from "@/components/hero/hero-shell";

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

const milestones = [
  { label: "Orbits Completed", value: "23", note: "Orbits Completed" },
  { label: "Years Breaking & Fixing Code", value: "5", note: "Placeholder value" },
  { label: "Side Quests Completed", value: "11", note: "Placeholder value" },
  { label: "Deployments", value: "5", note: "Placeholder value" },
];

export default function Home() {
  return (
    <HeroShell
      name="Mohamad Ajaz Imran"
      about="🇵🇭 Filipino | Aspiring Software Engineer & Mobile app Developer | Results Driven | Competitive Gamer | 🐱 Cats "
      stack={techStack}
      socials={socials}
      milestones={milestones}
    />
  );
}
