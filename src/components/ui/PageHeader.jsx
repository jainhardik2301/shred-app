import SectionHeader from "./SectionHeader";

export default function PageHeader({
  title,
  subtitle,
  action = null,
}) {
  return (
    <SectionHeader
      title={title}
      subtitle={subtitle}
      action={action}
    />
  );
}