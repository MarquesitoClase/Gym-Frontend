import { Link } from "react-router-dom";
import { EmptyState } from "../components/EmptyState/EmptyState";
import { PageContainer } from "../components/PageContainer/PageContainer";
import { useI18n } from "../i18n/I18nContext";

export function NotFoundPage() {
  const { t } = useI18n();
  return (
    <PageContainer className="not-found-page">
      <EmptyState
        action={
          <Link className="button button--primary button--md" to="/">
            {t("notFound.action")}
          </Link>
        }
        description={t("notFound.description")}
        title={t("notFound.title")}
      />
    </PageContainer>
  );
}
