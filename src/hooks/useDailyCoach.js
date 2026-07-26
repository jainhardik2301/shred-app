import { useEffect, useRef, useState } from "react";
import { generateDailyCoachInsight } from "../services/dailyCoachService";
import createCoachContextHash from "../utils/createCoachContextHash";
import AIRefreshManager from "../services/ai/AIRefreshManager";
import { updateCoachMemory } from "../services/ai/AICoachMemory";

export default function useDailyCoach({
  coachData,
  dailyCoach,
  setAppData,
  cloudReady,
  workoutCompletedToday,
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const isRefreshingRef = useRef(false);

  async function refresh(forceRefresh = false) {
    if (!cloudReady) return;

const hasOnboarding =
  coachData?.onboardingProfile &&
  Object.keys(coachData.onboardingProfile).length > 0;

if (!hasOnboarding) return;

if (isRefreshingRef.current) return;

    const contextHash =
      createCoachContextHash(coachData);

    if (
      !forceRefresh &&
      dailyCoach?.contextHash === contextHash
    ) {
      return;
    }

    try {
      isRefreshingRef.current = true;

      setIsGenerating(true);
      setError("");

      const insight =
        await generateDailyCoachInsight(coachData);

      setAppData((prev) => {
  const memory = updateCoachMemory(prev, {
  ...insight,
  workoutCompletedToday,
});

  return {
    ...prev,

    dailyCoach: {
      ...insight,
      contextHash,
    },

    ...memory,
  };
});
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Unable to generate today's focus."
      );
    } finally {
      isRefreshingRef.current = false;
      setIsGenerating(false);
    }
  }

  useEffect(() => {
  AIRefreshManager.schedule(() => refresh());
}, [coachData]);

  return {
    isGenerating,
    error,
    refresh,
  };
}