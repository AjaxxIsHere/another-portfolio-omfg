import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

type SocialIcon = "github" | "linkedin" | "email" | "website";

type SocialLink = {
  label: string;
  href: string;
  icon: SocialIcon;
};

type FooterSectionProps = {
  reveal: boolean;
  socials: SocialLink[];
  className?: string;
  contentClassName?: string;
};

const easeOut = [0.16, 1, 0.3, 1] as const;

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

export function FooterSection({
  reveal,
  socials,
  className,
  contentClassName,
}: FooterSectionProps) {
  return (
    <section
      className={`relative mx-auto flex h-full w-full max-w-[1440px] items-end px-6 pb-2 pt-24 sm:px-8 md:px-10 md:pt-[38vh] lg:px-14 ${className ?? ""}`}
    >
      <motion.div
        className={`mt-auto flex min-h-[54vh] w-full flex-col justify-between p-6 sm:p-8 md:min-h-[46vh] md:p-10 ${contentClassName ?? ""}`}
        initial={false}
        animate={reveal ? "visible" : "hidden"}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.08,
              delayChildren: 0.1,
            },
          },
        }}
      >
        <div>
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.4, ease: easeOut },
              },
            }}
            className="text-xs uppercase tracking-[0.3em] text-white/58"
          >
            Like what you see?
          </motion.p>

          <div className="mt-4 flex flex-wrap items-end justify-between gap-5">
            <motion.h2
              variants={{
                hidden: { opacity: 0, y: 14 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.52, ease: easeOut },
                },
              }}
            >
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full border-[0.5px] border-[#FA5D19]/55 bg-[#FA5D19]/10 px-6 py-3 font-display text-[clamp(1.4rem,3.8vw,2.8rem)] leading-none tracking-[-0.02em] text-[#FA5D19] transition-colors hover:bg-[#FA5D19]/16"
              >
                Let&apos;s Connect!
              </Link>
            </motion.h2>

            <motion.div
              variants={{
                hidden: { opacity: 0, x: 28, y: 12, rotate: -7, scale: 0.84 },
                visible: {
                  opacity: 1,
                  x: 0,
                  y: 0,
                  rotate: 0,
                  scale: 1,
                  transition: {
                    duration: 0.66,
                    delay: 0.08,
                    ease: easeOut,
                  },
                },
              }}
              className="ml-auto"
            >
              <Link
                href="/easter-egg"
                aria-label="Open easter egg page"
                className="group block"
              >
                <motion.div
                  whileHover={{ y: -3, rotate: 1.5, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Image
                    src="/cat.png"
                    alt="Cat sticker that says click me"
                    width={260}
                    height={180}
                    className="h-auto w-[130px] select-none object-contain drop-shadow-[0_14px_26px_rgba(0,0,0,0.36)] sm:w-[168px] md:w-[230px]"
                  />
                </motion.div>
              </Link>
            </motion.div>
          </div>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.46, ease: easeOut },
              },
            }}
            className="mt-5 max-w-2xl text-sm leading-relaxed text-white/72 sm:text-base"
          >
            &quot;To progress again, man must remake himself. And he cannot remake himself without suffering. For he is both the marble and the sculptor. In order to uncover his true visage he must shatter his own substance with heavy blows of his hammer.&quot; ~Alexis Carrell
          </motion.p>
        </div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 14 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, ease: easeOut },
            },
          }}
          className="mt-10 flex flex-col gap-4 border-t-[0.5px] border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-xs uppercase tracking-[0.16em] text-white/45">
            ©2026 Made by Mohamad Ajaz - All Rights Reserved
          </p>

          <div className="flex items-center gap-2.5">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border-[0.5px] border-white/12 bg-background/45 text-white/68 transition-colors hover:border-[#FA5D19]/55 hover:text-[#FA5D19]"
              >
                <SocialGlyph icon={social.icon} />
              </a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
