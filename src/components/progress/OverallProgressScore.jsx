import { useApp } from "../../contexts/AppContext";

export default function OverallProgressScore() {
  const { appData } = useApp();

  const history =
    appData?.history?.weight || [];

  const currentWeight =
    Number(appData?.profile?.weight) || 0;

  const targetWeight =
    Number(appData?.goals?.targetWeight) || 0;

  const startingWeight =
    history.length > 0
      ? Number(history[0].value)
      : currentWeight;

  let progress = 0;

  if (
    startingWeight > 0 &&
    currentWeight > 0 &&
    targetWeight > 0
  ) {
    const totalRequired =
      startingWeight -
      targetWeight;

    const achieved =
      startingWeight -
      currentWeight;

    if (totalRequired !== 0) {
      progress =
        (achieved /
          totalRequired) *
        100;
    }
  }

  progress = Math.max(
    0,
    Math.min(
      100,
      Math.round(progress)
    )
  );

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

      <h2 className="text-xl font-bold">
        Overall Progress
      </h2>

      <div className="mt-6">

        <h1 className="text-5xl font-bold text-emerald-400">
          {progress}%
        </h1>

        <p className="mt-2 text-slate-400">
          Weight goal completion
        </p>

      </div>

      <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-800">

        <div
          className="h-full bg-emerald-500 transition-all"
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

    </div>
  );
}