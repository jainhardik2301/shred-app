export default function Tabs({
  tabs,
  activeTab,
  onChange,
}) {
  return (
    <div className="mb-6 flex gap-2 rounded-xl bg-slate-900 p-2">

      {tabs.map((tab) => (

        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`
            flex-1
            rounded-lg
            px-4
            py-3
            font-medium
            transition
            ${
              activeTab === tab
                ? "bg-emerald-500 text-white"
                : "text-slate-400 hover:bg-slate-800"
            }
          `}
        >
          {tab}
        </button>

      ))}

    </div>
  );
}