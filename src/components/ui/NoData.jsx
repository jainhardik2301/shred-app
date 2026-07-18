import EmptyState from "./EmptyState";

export default function NoData({
  title = "No Data Available",
  description = "Nothing to display yet.",
}) {
  return (
    <EmptyState
      title={title}
      description={description}
    />
  );
}