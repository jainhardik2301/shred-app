import DashboardCard from "./DashboardCard";

export default function SectionCard({
  title,
  children,
  action = null,
}) {
  return (
    <DashboardCard>

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-xl font-bold">
          {title}
        </h2>

        {action}

      </div>

      {children}

    </DashboardCard>
  );
}