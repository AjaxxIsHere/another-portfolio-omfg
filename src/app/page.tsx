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
  { label: "GitHub", href: "https://github.com/AjaxxIsHere", icon: "github" as const },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/mohamad-ajaz/", icon: "linkedin" as const },
  { label: "Email", href: "mailto:ajaz2468@gmail.com", icon: "email" as const },
  { label: "Instagram", href: "https://www.instagram.com/yours.truly__aj/profilecard/", icon: "website" as const },
];

const milestones = [
  { label: "Age", value: "23", note: "Orbits Completed" },
  { label: "Experience", value: "5", note: "Years Breaking & Fixing Code" },
  { label: "Personal Projects", value: "11", note: "Side Quests Completed" },
  { label: "Deployments", value: "5", note: "(a.k.a. The Boss Battles)" },
];

export default function Home() {
  return (
    <HeroShell
      name="Mohamad Ajaz Imran"
      // about="🇵🇭 Filipino | Aspiring Software Engineer & Mobile app Developer | Results Driven | Competitive Gamer | 🐱 Cats "
      about="Aspiring software Engineer and result-driven developer, blending high-end aesthetics with complex code for the love of gaming, cats, and the perfect build."
      stack={techStack}
      socials={socials}
      milestones={milestones}
    />
  );
}
