import PageContainer from "./PageContainer";
import PageHeader from "./PageHeader";

export default function PageLayout({
  title,
  subtitle,
  action = null,
  children,
}) {
  return (
    <PageContainer>

      <PageHeader
        title={title}
        subtitle={subtitle}
        action={action}
      />

      {children}

    </PageContainer>
  );
}