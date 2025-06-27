"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Progress } from "@/components/ui/progress";

export function ProgressBar() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let interval: NodeJS.Timeout;

    const startProgress = () => {
      setIsAnimating(true);
      setProgress(10);

      // Simulation de progression
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);
    };

    const completeProgress = () => {
      clearInterval(interval);
      setProgress(100);
      timeout = setTimeout(() => setIsAnimating(false), 200);
    };

    // Start progress when pathname changes
    startProgress();
    timeout = setTimeout(completeProgress, 2000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [pathname]);

  if (!isAnimating) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1">
      <Progress
        value={progress}
        className="h-1 bg-gray-200 [&>div]:bg-blue-500 transition-all duration-300"
      />
    </div>
  );
}
