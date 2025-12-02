"use client";

import { useEffect } from "react";
import * as amplitude from "@amplitude/unified";

export default function AmplitudeProvider() {
  useEffect(() => {
    // Initialize Amplitude only once on client-side
    amplitude.initAll("755ea55ab67d011151da1abc1fad3c14", {
      analytics: { autocapture: true },
      sessionReplay: { sampleRate: 1 },
    });
  }, []);

  return null;
}

