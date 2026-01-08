import { useMemo } from "react";

interface NetworkInformation extends EventTarget {
  effectiveType?: string;
}

export interface PerformanceMode {
  isSlowConnection: boolean;
  isLowPerformance: boolean;
  enableAnimations: boolean;
  enableApiCalls: boolean;
  imageQuality: "low" | "medium" | "high";
}

export function usePerformance(): PerformanceMode {
  return useMemo(() => {
    // Check connection speed
    const connection =
      (
        navigator as unknown as {
          connection?: NetworkInformation;
          mozConnection?: NetworkInformation;
          webkitConnection?: NetworkInformation;
        }
      ).connection ||
      (
        navigator as unknown as {
          connection?: NetworkInformation;
          mozConnection?: NetworkInformation;
          webkitConnection?: NetworkInformation;
        }
      ).mozConnection ||
      (
        navigator as unknown as {
          connection?: NetworkInformation;
          mozConnection?: NetworkInformation;
          webkitConnection?: NetworkInformation;
        }
      ).webkitConnection;

    let isSlowConnection = false;
    if (connection?.effectiveType) {
      isSlowConnection =
        connection.effectiveType === "slow-2g" ||
        connection.effectiveType === "2g";
    }

    // Check device performance (rough estimate)
    const isLowPerformance = (navigator.hardwareConcurrency ?? 4) < 4;

    // Determine performance mode
    const enableAnimations = !isSlowConnection && !isLowPerformance;
    const enableApiCalls = !isSlowConnection;
    const imageQuality = isSlowConnection
      ? "low"
      : isLowPerformance
      ? "medium"
      : "high";

    return {
      isSlowConnection,
      isLowPerformance,
      enableAnimations,
      enableApiCalls,
      imageQuality,
    };
  }, []);
}
