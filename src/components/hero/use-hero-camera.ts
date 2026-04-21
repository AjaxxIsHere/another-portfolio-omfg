import { useState, useEffect, useRef, type RefObject } from "react";

// Reverted to 4 clean states
export type CameraState = "hero" | "about" | "milestones" | "native-content";

export function useHeroCamera(scrollContainerRef: RefObject<HTMLDivElement | null>) {
  const [cameraState, setCameraState] = useState<CameraState>("hero");
  const [isSnapping, setIsSnapping] = useState(false);
  const [hasEnteredNativeContent, setHasEnteredNativeContent] = useState(false);
  const settleTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (!window.matchMedia("(min-width: 768px)").matches || Math.abs(event.deltaY) < 28 || isSnapping) {
        return;
      }

      // 1. FREE SCROLL MODE (LeetCode to Footer)
      if (cameraState === "native-content") {
        const container = scrollContainerRef.current;
        if (!container) return;

        // Hijack back to Milestones if at the very top
        if (event.deltaY < 0 && container.scrollTop <= 5) {
          event.preventDefault();
          setCameraState("milestones");
          setIsSnapping(true);
        }
        return;
      }

      // 2. SLIDESHOW / HORIZONTAL MODE
      event.preventDefault();

      if (event.deltaY > 0) {
        if (cameraState === "hero") {
          setCameraState("about");
          setIsSnapping(true);
        } else if (cameraState === "about") {
          setCameraState("milestones");
          setIsSnapping(true);
        } else if (cameraState === "milestones") {
          setCameraState("native-content"); // Triggers the Native Container fade-in
          setHasEnteredNativeContent(true);
          setIsSnapping(true);
        }
      } else {
        if (cameraState === "milestones") {
          setCameraState("about");
          setIsSnapping(true);
        } else if (cameraState === "about") {
          setCameraState("hero");
          setIsSnapping(true);
        }
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [cameraState, isSnapping, scrollContainerRef]);

  useEffect(() => {
    if (!isSnapping) return;
    settleTimeoutRef.current = window.setTimeout(() => setIsSnapping(false), 760);
    return () => {
      if (settleTimeoutRef.current) window.clearTimeout(settleTimeoutRef.current);
    };
  }, [isSnapping]);

  return { cameraState, hasEnteredNativeContent };
}
