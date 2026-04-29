"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Contact", href: "/contact" },
];

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function TopNav() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false); // mobile toggle
  const hoverRef = useRef(false);
  const hideTimer = useRef<number | null>(null);

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (e.clientY <= 64) {
        if (hideTimer.current) {
          window.clearTimeout(hideTimer.current);
          hideTimer.current = null;
        }
        setVisible(true);
      } else if (!hoverRef.current) {
        if (hideTimer.current) window.clearTimeout(hideTimer.current);
        hideTimer.current = window.setTimeout(() => setVisible(false), 800);
      }
    };

    window.addEventListener("pointermove", onPointerMove);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, []);

  const handleMouseEnter = () => {
    hoverRef.current = true;
    if (hideTimer.current) {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    setVisible(true);
  };

  const handleMouseLeave = () => {
    hoverRef.current = false;
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setVisible(false), 700);
  };

  return (
    <>
      {/* Mobile menu toggle (visible on small screens) */}
      <button
        aria-label="Open menu"
        className="sm:hidden fixed top-4 right-4 z-50 rounded-full bg-surface/70 border-[0.5px] border-white/10 px-3 py-2 text-sm text-white/80 backdrop-blur-sm shadow-md"
        onClick={() => setOpen((s) => !s)}
      >
        Menu
      </button>

      <AnimatePresence>
        {(visible || open) && (
          <motion.nav
            initial={{ y: -12, opacity: 0, scale: 0.99 }}
            animate={{ y: 0, opacity: 1, scale: 1, transition: { duration: 0.28, ease: easeOut } }}
            exit={{ y: -10, opacity: 0, transition: { duration: 0.2, ease: easeOut } }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="hidden sm:block fixed left-0 right-0 top-4 z-40 pointer-events-none"
            role="navigation"
            aria-label="Main Navigation"
          >
            <div className="mx-auto max-w-[1100px] px-4">
              <div className="pointer-events-auto rounded-full bg-surface/72 border-[0.5px] border-white/10 backdrop-blur-sm shadow-lg">
                <div className="flex items-center justify-between gap-3 px-4 py-2">
                  <div className="flex items-center gap-3">
                    {NAV_ITEMS.map((item) => {
                      const active = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm transition-all duration-200 ${
                            active
                              ? "bg-accent text-background"
                              : "text-white/78 hover:text-accent"
                          }`}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>

                  <div className="hidden sm:flex items-center gap-3">
                    <span className="text-xs text-white/58">Mohamad Ajaz</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Chevron indicator when nav is hidden (desktop only) */}
      <AnimatePresence>
        {!visible && !open && (
          <motion.div
            key="chevron-indicator"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: easeOut }}
            aria-hidden
            className="hidden sm:block fixed top-6 left-1/2 z-40 -translate-x-1/2 pointer-events-none"
          >
            <motion.span
              className="inline-flex items-center justify-center rounded-full bg-surface/40 p-2 backdrop-blur-sm border-[0.5px] border-white/8"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/72">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile full panel when open */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.18 } }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            className="sm:hidden fixed inset-0 z-40 flex items-start justify-center pt-24"
          >
            <div className="mx-6 w-[calc(100%-3rem)] rounded-xl bg-surface/90 border-[0.5px] border-white/10 p-4 backdrop-blur-sm shadow-2xl">
              <div className="flex flex-col gap-3">
                {NAV_ITEMS.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`block rounded-md px-3 py-2 text-lg ${
                        active ? "bg-accent text-background" : "text-white/84 hover:text-accent"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
