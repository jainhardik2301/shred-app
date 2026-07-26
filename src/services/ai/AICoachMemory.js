import {
  buildHistoryEntry,
  updateHistory,
  buildTrendSummary,
} from "./AIHistoryService";

export function updateCoachMemory(appData, dailyCoach) {
  const history = appData?.coachHistory || [];

  const entry = buildHistoryEntry(
    appData,
    dailyCoach
  );

  const newHistory = updateHistory(
    history,
    entry
  );

  const trends =
    buildTrendSummary(newHistory);

  return {
    coachHistory: newHistory,
    coachTrends: trends,
  };
}