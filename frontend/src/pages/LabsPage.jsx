import PageShell from "./PageShell.jsx";
import EmptyPanel from "./EmptyPanel.jsx";
import { useTranslation } from "react-i18next";

export default function LabsPage() {
  const { t } = useTranslation();
  return (
    <PageShell
      title={t("labs.title")}
      description={t("labs.description")}
    >
      <EmptyPanel
        icon="science"
        title={t("labs.empty")}
        detail={t("labs.emptyDetail")}
      />
    </PageShell>
  );
}
